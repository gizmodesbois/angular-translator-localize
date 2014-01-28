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
                language: '',
                dictionary: [],
                dictionaryVersion: '0.0.1',
                url: undefined,
                init: function() {
                    var url = translator.url || translator.buildUrl();
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
                saveLanguage: function() {
                    sessionStorage.language = angular.toJson(translator.language);
                },
                restoreLanguage: function() {
                    translator.language = angular.fromJson(sessionStorage.language);
                },
                saveUrl: function() {
                    sessionStorage.url = 'languages/dictionary-' + translator.language + '.json';
                },
                restoreUrl: function() {
                    return sessionStorage.url;
                },
                buildUrl: function() {
                    if (!translator.language && !sessionStorage.language) {
                        var lang, aLang;
                        if ($window.navigator && $window.navigator.userAgent && (aLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                            lang = aLang[1];
                        } else {
                            lang = $window.navigator.userLanguage || $window.navigator.language;
                        }
                        translator.language = lang;
                        translator.saveLanguage();
                        translator.saveUrl();
                    } else {
                        translator.restoreLanguage();
                        translator.restoreUrl();
                    }
                    return 'languages/dictionary-' + translator.language + '.json';
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