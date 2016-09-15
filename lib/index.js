var tmp = require('tmp');
tmp.setGracefulCleanup();

var request = require('./request');
var download = require('./download');
var extract = require('./extract');
var utils = require('./utils');

module.exports = function (bower) {
    function getFragments(source) {
        return {
            registryUrl: utils.getRegistryUrl(bower.config),
            repositoryName: utils.getRepositoryName(source)
        }
    };

    return {
        match: function (source) {
            return source.indexOf(utils.ARTIFACTORY_PREFIX) === 0;
        },

        releases: function (source) {
            var fragments = getFragments(source);
            var requestUrl = fragments.registryUrl + '/refs/' + fragments.repositoryName;

            return request(requestUrl, bower.config).then(function (response) {
                return utils.extractReleases(response);
            });
        },

        fetch: function (endpoint, cached) {
            // If cached package is semver, reuse it
            if (cached.version === endpoint.target) return;

            var fragments = getFragments(endpoint.source);

            var downloadUrl = fragments.registryUrl + '/binaries/' + fragments.repositoryName + '.git/' + endpoint.target;

            var downloadPath = tmp.dirSync();

            return download(downloadUrl, downloadPath.name, bower.config).then(function (archivePatch) {
                var extractPath = tmp.dirSync();

                return extract(archivePatch, extractPath.name).then(function () {
                    downloadPath.removeCallback();

                    return {
                        tempPath: extractPath.name,
                        removeIgnores: true
                    };
                });
            });
        }
    }
}
