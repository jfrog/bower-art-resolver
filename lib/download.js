var progress = require('request-progress');
var Q = require('q');
var object = require('mout/object');
var retry = require('retry');
var fs = require('graceful-fs');
var createError = require('./createError');
var url = require('url')
var request = require('request');
var tmp = require('tmp');
var path = require('path');

var errorCodes = [
    'EADDRINFO',
    'ETIMEDOUT',
    'ECONNRESET',
    'EINCOMPLETE',
    'ESOCKETTIMEDOUT'
];

function download(requestUrl, downloadPath, config) {
    var parsedUrl = url.parse(requestUrl);

    var file = tmp.tmpNameSync({ dir: downloadPath, postfix: '.tar.gz' });

    var operation;
    var response;
    var deferred = Q.defer();
    var progressDelay = 8000;

    if (config === undefined) {
        config = {};
    }

    var retryOptions = object.mixIn({
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 35000,
        randomize: true
    }, config.retry || {});

    var _request = request.defaults({
        ca: config.ca.search[0],
        strictSSL: config.strictSsl,
        timeout: config.timeout
    })

    _request = _request.defaults(config.request || {})

    // Retry on network errors
    operation = retry.operation(retryOptions);
    operation.attempt(function () {
        var req;
        var writeStream;
        var contentLength;
        var bytesDownloaded = 0;

        req = progress(_request(requestUrl), {
            delay: progressDelay
        })
        .on('response', function (res) {
            var status = res.statusCode;

            if (status < 200 || status >= 300) {
                return deferred.reject(createError('Status code of ' + status + ' for ' + requestUrl, 'EHTTP', {
                    details: res.toString()
                }));
            }

            response = res;
            contentLength = Number(res.headers['content-length']);
        })
        .on('data', function (data) {
            bytesDownloaded += data.length;
        })
        .on('progress', function (state) {
            deferred.notify(state);
        })
        .on('end', function () {
            // Check if the whole file was downloaded
            // In some unstable connections the ACK/FIN packet might be sent in the
            // middle of the download
            // See: https://github.com/joyent/node/issues/6143
            if (contentLength && bytesDownloaded < contentLength) {
                req.emit('error', createError('Transfer closed with ' + (contentLength - bytesDownloaded) + ' bytes remaining to read', 'EINCOMPLETE'));
            }
        })
        .on('error', function (error) {
            var timeout = operation._timeouts[0];

            // Reject if error is not a network error
            if (errorCodes.indexOf(error.code) === -1) {
                return deferred.reject(error);
            }

            // Next attempt will start reporting download progress immediately
            progressDelay = 0;

            // Check if there are more retries
            if (operation.retry(error)) {
                // Ensure that there are no more events from this request
                req.removeAllListeners();
                req.on('error', function () {});
                // Ensure that there are no more events from the write stream
                writeStream.removeAllListeners();
                writeStream.on('error', function () {});

                return deferred.notify({
                    retry: true,
                    delay: timeout,
                    error: error
                });
            }

            // No more retries, reject!
            deferred.reject(error);
        });

        // Pipe read stream to write stream
        writeStream = req
        .pipe(fs.createWriteStream(file))
        .on('error', deferred.reject)
        .on('close', function () {
            deferred.resolve(file);
        });
    });

    return deferred.promise;
}

module.exports = download;
