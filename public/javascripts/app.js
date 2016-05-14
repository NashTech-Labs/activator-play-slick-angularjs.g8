var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to '/home'
    $urlRouterProvider.otherwise('/list');

     // Now set up the matched url
     $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'index.html'
           /* controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }*/
        })

});
