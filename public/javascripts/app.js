
// Main app module
var app = angular.module('myApp', ['ui.bootstrap', 'confirmDialogBoxModule']);

app.controller('empCtrl', function($scope, $http, $timeout, $uibModal, EmpService) {

 $scope.employees = [];

    function getAllEmployee() {
       EmpService.getAll().then(function(res){
             $scope.employees = res.data;
        }, function(err){
           // error
        });
     }

      $scope.selectedEmployee = {};

      $scope.editEmployee = function(emp){
            $scope.selectedEmployee = angular.copy(emp);
      };

      $scope.updateEmployee = function(){
         EmpService.updateEmployee($scope.selectedEmployee).then(function(res) {
             $('.modal').modal('hide');
             showAlertMessage(res.status, res.msg);
             getAllEmployee();
         }, function(err){
             // error
        });
      }

    $scope.newEmployee = {};

    $scope.addEmployee = function() {
        EmpService.addEmployee($scope.newEmployee).then(function(res) {
                  $('.modal').modal('hide');
                  var newId = res.data.id;
                  $scope.newEmployee["id"] = newId;
                  $scope.employees.push($scope.newEmployee);
                  $scope.newEmployee ={};
                  showAlertMessage(res.status, res.msg);
          }, function(err){
                // error
          });
    }

     $scope.deleteEmployee = function(empId) {
           EmpService.deleteEmployee(empId).then(function(res){
                       var newEmpList=[];
                       angular.forEach($scope.employees,function(emp){
                                if(emp.id != empId) {
                                        newEmpList.push(emp);
                                 }
                        });
                        $scope.employees = newEmpList;
             showAlertMessage(res.status, res.msg);
         }, function(err){
                 // error
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


/**
 * Directive for alert notification. You can also use angular ui-bootstrap for better alert notifications
 */
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



/**
 * EmpService: Provides all employee services and run asynchronously
 */
app.service("EmpService", function($http, $q) {

   var task = this;
   task.taskList = {};

   task.getAll = function() {
          var defer = $q.defer();
          $http.get('/emp/list')
          .success(function(res){
                task.taskList = res;
                defer.resolve(res);
           })
           .error(function(err, status){
              defer.reject(err);
           });

         return defer.promise;
     }

   task.deleteEmployee = function(id) {
        var defer = $q.defer();
        $http.get('/emp/delete?empId=' + id)
        .success(function(res){
               task.taskList = res;
                defer.resolve(res);
         }).error(function(err, status){
               defer.reject(err);
         });

         return defer.promise
   }

   task.updateEmployee = function(data) {
      var defer = $q.defer();
      $http.post('/emp/update', data)
      .success(function(res){
               task.taskList = res;
               defer.resolve(res);
       }).error(function(err, status){
                defer.reject(err);
       });

       return defer.promise
   }

   task.addEmployee = function(data) {
         var defer = $q.defer();
         $http.post('/emp/create', data)
         .success(function(res){
                task.taskList = res;
                defer.resolve(res);
         })
         .error(function(err, status){
                defer.reject(err);
         });;

          return defer.promise
      }

   return task;

 });


/**
 * Module for confirm dialog box
 * To use this, add this module as a dependency in app module.
 */
angular.module('confirmDialogBoxModule', ['ui.bootstrap'])
  .directive('ngConfirmClick', ['$uibModal', function($uibModal) {

      var modalInstanceCtrl = function($scope, $uibModalInstance) {
        $scope.ok = function() {
          $uibModalInstance.close();
        };

        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
      };

      return {
        restrict: 'A',
        scope:{
          ngConfirmClick:"&"
        },
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var message = attrs.ngConfirmMessage || "Are you sure ?";

            // Template for confirmation dialog box
            var modalHtml = '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-default" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $uibModal.open({
              template: modalHtml,
              controller: modalInstanceCtrl
            });

            modalInstance.result.then(function() {
              scope.ngConfirmClick();
            }, function() {
              //Modal dismissed
            });
          });

        }
      }
    }
  ]);
