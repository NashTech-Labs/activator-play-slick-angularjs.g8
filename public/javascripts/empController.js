var app = angular.module('myApp', []);

app.controller('empCtrl', function($scope, $http, $timeout) {

 $scope.employees = [];

 $scope.newEmployee = {};

 function getAllEmployee() {
     $http({
            method: 'GET',
            url: '/emp/list'
        }).success(function(data, status) {
            if(data.status == "success"){
              $scope.employees = data.data;
            }
        });
  }

      $scope.selectedEmployee = {};

      $scope.editEmployee = function(emp){
            $scope.selectedEmployee = angular.copy(emp);
      };

      $scope.updateEmployee = function(){
          $http({
                  method: 'POST',
                  url: '/emp/update',
                  data: $scope.selectedEmployee,  // pass in form data as Json
              }).success(function(data, status) {
                     $('.modal').modal('hide');
                     showAlertMessage(data.status, data.msg);
                     getAllEmployee();
              });
         };

        $scope.removeEmployee = function(empId){
        	        $http({
                      method: 'GET',
                      url: '/emp/delete',
                      params: {empId: empId}
                  }).success(function(data, status) {
                      if(data.status == "success"){
                        var newEmpList=[];
                        angular.forEach($scope.employees,function(emp){
                        if(emp.id != empId) {
                                  newEmpList.push(emp);
                             }
                       });
                       $scope.employees = newEmpList;
                     }
                     showAlertMessage(data.status, data.msg);
                });
          }

    $scope.addEmployee = function() {
                  $http({
                      method: 'POST',
                      url: '/emp/create',
                      data: $scope.newEmployee,  // pass in form data as Json
                   }).success(function(data, status) {
                          $('.modal').modal('hide');
                         if(data.status == "success") {
                            var newId = data.data.id;
                            $scope.newEmployee["id"] = newId;
                            $scope.employees.push($scope.newEmployee);
                            $scope.newEmployee ={};
                         }
                         showAlertMessage(data.status, data.msg);
                   });
        }

    getAllEmployee();

    $scope.alerts = [];

    function showAlertMessage(status, message) {
              if(status == "success") {
                    $scope.alerts.push({type: "alert-success", title: "SUCCESS", content: message});
              } else if(status == "error") {
                     $scope.alerts.push({type: "alert-danger", title: "ERROR", content: message});
              }
    };

});

// Directive for alert notification. You can also use angular bootstrap-ui for better alert notifications
app.directive('notification', function($timeout){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ngModel: '='
    },
    template: '<div ng-class="ngModel.type" class="alert alert-box">{{ngModel.content}}</div>',
     link: function(scope, element, attrs) {
          $timeout(function(){
            element.hide();
          }, 3000);
      }
  }
});
