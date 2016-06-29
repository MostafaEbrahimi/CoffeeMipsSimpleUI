var app=angular.module('myApp', ['ngMaterial','ngFileUpload']);


 app.controller('appctrl',function($scope,$timeout,Upload,$http,$mdToast) {
     $scope.activated=true;
     $timeout(function () {
       $scope.activated= false;
     }, 4000);
     $scope.registers=[];
     $scope.showHeads=true;
     $scope.memory=[];
     $scope.instructions=[];
     $scope.hadcode=true;
     $scope.assembled=[];

     $scope.Runbtn=function() {
       if($scope.code.length>0){
         $scope.hadcode=false;
       }
       if(!$scope.code.length > 0){
         $scope.hadcode=true;
       }

      if($scope.assembled.length>0){
       $scope.showHeads=true;
      }

     }
   var last = {
      bottom:true,
      top: false,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    $scope.showSimpleToast = function() {
      var pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
          .textContent('Code Sent To Server!')
          .position(pinTo )
          .hideDelay(3000)
      );
    };

    $scope.sendCode=function() {
      console.log("toast");
      $scope.showSimpleToast();
      console.log($scope.code);
      $http({
            method : "POST",
            url : "http://127.0.0.1:9000/execute/getcode",
            data    : $scope.code
        }).then(function mySucces(response) {
            console.log(response);
        }, function myError(response) {
            console.log(response);
        });
    }


 });
