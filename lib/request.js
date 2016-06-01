var request = require('request');
var Q = require('q');
var url = require('url');
var object = require('mout/object');
var createError = require('./createError');

function requestWrapper(requestUrl, config) {
    var deferred = Q.defer();

    var protocol = url.parse(requestUrl).protocol;

    var _request = request.defaults({
        ca: config.ca.search[0],
        strictSSL: config.strictSsl,
        timeout: config.timeout
    })

    _request = _request.defaults(config.request || {})

    _request(requestUrl, function (error, response, body) {
        if (error) {
            deferred.reject(createError('Request to ' + requestUrl + ' failed: ' + error.message, error.code));
        } else {
            if (response.statusCode === 200) {
                deferred.resolve(body);
            } else {
                deferred.reject(createError('Request to ' + requestUrl + ' returned ' + response.statusCode + ' status code.', 'EREQUEST', {
                    details: response.toString()
                }));
            }
        }
    });

    return deferred.promise;
};

module.exports = requestWrapper;
