(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelper', RouteHelperProvider);

    /* @ngInject */
    function RouteHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        this.$get = RouterHelper;
        //$locationProvider.html5Mode(true);

        /* @ngInject */
        function RouterHelper($state, $rootScope, logger) {
            var docTitle = 'myBCA';
            var handlingRouteChangeError = false;
            var hasOtherwise = false;
            var otherwisePath = 'promo';

            var service = {
                configureStates: configureStates,
                getStates: getStates
            };

            init();
            return service;
            ///////////////

            function configureStates(states) {
                states.forEach(function(state) {
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function getStates() {
                return $state.get();
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams, error) {
                        //if (handlingRouteChangeError) {
                        //    return;
                        //}
                        //handlingRouteChangeError = true;
                        var msg = 'Error routing to ' + toState + '. ' + (error || '');
                        logger.warning(msg, [fromState]);
                        //$location.path('/');
                    }
                );
            }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams) {
                        //handlingRouteChangeError = false;
                        //var title = docTitle + ' ' + (current.title || '');
                        //$rootScope.title = title; // data bind to <title>
                        logger.info('Success Changing Page');
                    }
                );
            }
        }
    }
})();
