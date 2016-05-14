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

     $scope.alert = {};
     $scope.showAlert = false;

     function showAlertMessage(status, message) {
          $scope.showAlert = true;
          if(status == "success") {
                $scope.alert = {type: "alert-success", msg: message};
          } else if(status == "error") {
                 $scope.alert = {type: "alert-danger", msg: message};
          }
          //$timeout(function () { $scope.showAlert = false; }, 3000);
       };

     $scope.closeAlert = function(index) {
         $scope.showAlert = false;
         $scope.alert = {};
      };
});