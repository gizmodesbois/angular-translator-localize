'use strict';

/*
 * An AngularJS Localization Service
 *
 * Written by Simon Henrotte
 * http://henrottesimon.com
 *
 */

angular
    .module('translator', [])
    .factory('translator', ['$http', '$rootScope', '$window', '$filter',
        function($http, $rootScope, $window, $filter) {
            var translator = {
                dictionary: [],
                dictionaryVersion: '0.0.2',
                url: undefined,
                init: function() {
                    var url = translator.restoreUrl() || translator.buildUrl();
                    if (!sessionStorage.dictionary || !sessionStorage.dictionaryVersion || (sessionStorage.dictionaryVersion != translator.dictionaryVersion)) {
                        $http({
                            method: 'GET',
                            url: url
                        }).success(translator.successData).error(function(status, response) {
                            $http({
                                method: 'GET',
                                url: 'languages/dictionary-default.json'
                            }).success(translator.successData)
                        });
                    } else {
                        translator.dictionary = angular.fromJson(sessionStorage.dictionary);
                    }
                },
                successData: function(data) {
                    sessionStorage.dictionary = angular.toJson(data);
                    sessionStorage.dictionaryVersion = translator.dictionaryVersion;
                    translator.dictionary = angular.fromJson(sessionStorage.dictionary);
                    $rootScope.$broadcast('translatorDictionaryUpdated');
                },
                saveUrl: function(lang) {
                    return sessionStorage.url = 'languages/dictionary-' + lang + '.json';
                },
                restoreUrl: function() {
                    return sessionStorage.url;
                },
                buildUrl: function() {
                    var lang, aLang;
                    if ($window.navigator && $window.navigator.userAgent && (aLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                        lang = aLang[1];
                    } else {
                        lang = $window.navigator.userLanguage || $window.navigator.language;
                    }
                    return translator.saveUrl(lang);
                },
                getDictionary: function(value) {
                    var dictionaryValue = '';
                    if ((translator.dictionary !== []) && (translator.dictionary.length > 0)) {
                        var translation = $filter('filter')(translator.dictionary, function(element) {
                            return element.name === value;
                        })[0];
                        dictionaryValue = translation.value;
                    }
                    return dictionaryValue;
                }
            };
            translator.init();
            return translator;
        }
    ])
    .filter('translate', ['translator',
        function(translator) {
            return function(input) {
                return translator.getDictionary(input);
            }
        }
    ])