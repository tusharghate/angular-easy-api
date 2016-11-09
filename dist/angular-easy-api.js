(function() {

    angular
        .module('easyAPI', [])
        .factory('util', util)
        .provider('easyAPI', easyAPIProvider);

    util.$inject = ['$log'];

    function util($log) {
        return {

            /**
             * Replaces path variables with associated data properties.
             *
             * @param {String} path
             * @param {Object} data
             * @return {String}
             */
            replaceInPath: function(path, data) {
                var properties = path.match(/[^{}]+(?=\})/g) || [];
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    path = path.replace('{' + property + '}', data[property]);
                }

                return path;
            }
        }
    }

    function easyAPIProvider() {

        // Allow user to specify the JSON which will be
        // used to generate the API.
        var _json = {};

        this.setJSON = function(json) {
            _json = json;
        };

        this.$get = EasyAPI;

        EasyAPI.$inject = ['$log', '$http', 'util'];

        function EasyAPI($log, $http, util) {

            return _generate(_json);

            /**
             * Generates a dynamic API from the user-specified JSON.
             *
             * @param {JSON} json
             * @return {Object}
             */
            function _generate(json) {

                // Reset the API.
                var _api = {};

                // Ensure that the JSON is valid. If not, return an
                // empty Object.
                if (!_isJSONValid(json)) {
                    return {};
                }

                // Keep a reference to all properties required to build our API.
                var protocol = json.protocol || "http",
                    host = json.host,
                    endpoints = json.endpoints;

                // Loop through our endpoints.
                angular.forEach(endpoints, function(data, path) {

                    // Construct namespace if it doesn't already exist.
                    if (!_api[data.namespace]) {
                        _api[data.namespace] = {};
                    }

                    // Construct the HTTP Request for each method.
                    angular.forEach(data.methods, function(method, operationId) {
                        _api[data.namespace][operationId] = function(data, config) {

                            // Construct the configuration Object.
                            config = config || {};
                            config.method = method;
                            config.url = protocol + "://" + host + util.replaceInPath(path, data);
                            config.data = data;

                            // Trigger the HTTP Request.
                            return $http(config);
                        }
                    });
                });

                return _api;
            }

            /**
             * Verifys whether the JSON specified by the user is valid and
             * is formatted correctly.
             *
             * @param  {JSON} _json
             * @return {Boolean}
             */
            function _isJSONValid(_json) {

                // Check if JSON passes general validation tests.
                if (!_json || _json == '') {
                    $log.error('JSON is empty!');
                    return false;
                }

                // Check if the JSON is constructed correctly and has all
                // required properties.
                if (Object.getOwnPropertyNames(_json).length === 0) {
                    $log.error('JSON is not constructed correctly!');
                    return false;
                }

                if (!_json.hasOwnProperty("host") || !_json.hasOwnProperty("endpoints")) {
                    $log.error("JSON is missing host and/or endpoints!");
                    return false;
                }

                return true;
            }
        }
    }

})(angular);