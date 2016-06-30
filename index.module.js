var app=angular.module('myApp', ['ngMaterial','ngFileUpload']);


 app.controller('appctrl',function($scope,$timeout,Upload,$http,$mdToast,$mdDialog) {

     $scope.activated=true;
     $scope.codeSent=true;
     $scope.hascode=true;
     $scope.showHeads=true;
     $scope.showassembled=true;
     $scope.clickassembled=false;
     $scope.code="";
     $scope.registers=[];
     $scope.memory=[];
     $scope.instructions=[];
     $scope.assembled=[];
     $scope.contentMem=[];

     $timeout(function () {
       $scope.activated= false;
     }, 4000);

     $scope.Runbtn=function() {
       if($scope.code.length>0){
         $scope.hascode=false;

       }
       if($scope.code.length>0 && $scope.clickassembled){
         $scope.codeSent=false;
       }
       if(!$scope.code.length > 0){
         $scope.hascode=true;
       }
      if($scope.assembled.length>0){
        $scope.showassembled=false;
      }
      if($scope.registers.length>0){
       $scope.showHeads=false;
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

    $scope.showSimpleToast = function(msg) {
      var pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position(pinTo )
          .hideDelay(3000)
      );
    };

    $scope.sendCode=function() {
      if(!$scope.code.length>0){
          $scope.showSimpleToast('No code to send');
      }
      else {
        $scope.showSimpleToast('request is sending...');

        var obj={"code":$scope.code};
        $http({
              method : "POST",
              url : "http://127.0.0.1:9000/execute/getcode",
              data    : obj
          }).then(function mySucces(response) {
              $scope.showSimpleToast('Response Recieved');
              $scope.assembled=response.data;
              $scope.clickassembled=true;
              $scope.Runbtn();

          }, function myError(error) {
              $scope.showSimpleToast('Error On Response');
              console.error(error);
          });
      }
    }

    $scope.sendRun=function() {
      $http({
        method:"GET",
        url:"http://127.0.0.1:9000/execute/run"
      }).then(function(res) {
          console.log(res.data);
      },function(err) {
          console.log(err);
      });
    }

    $scope.filterMem=function() {
        $scope.contentMem=[];
        for(i=0;i<$scope.memory.length;i++){
          var mem=$scope.memory[i];
          console.log(mem);
          if(mem.hasOwnProperty('content')){
            $scope.contentMem.push(mem);
          }
        }
    }

    $scope.resetServer=function() {
      $scope.registers=[];
      $scope.showHeads=true;
      $scope.memory=[];
      $scope.instructions=[];
      $scope.assembled=[];
      $scope.Runbtn();
      $http({
        method:"GET",
        url:"http://127.0.0.1:9000/execute/reset"
      }).then(function(response) {
        $scope.showSimpleToast('Server Was Reset');
      },function(error) {
        $scope.showSimpleToast('Error Was Occured On Reset Server');
      });
    }


    $scope.showConfirm = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Are you sure to reset?')
            .textContent('After reset all af your data will be lost!')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        $scope.resetServer();
      }, function() {
        console.log("test");
      });
    }


//in this section must handle cookie
    $scope.getMemory=function() {
      if($scope.assembled.length>0){
        $http({
            method:"GET",
            url:"http://127.0.0.1:9000/execute/getmemory"
        }).then(function(res) {
            $scope.memory=res.data;
            $scope.showHeads=false;
            $scope.filterMem();
            $scope.Runbtn();
            console.log($scope.memory);
            $scope.showSimpleToast("Memory Was Get From Server")
        },function(err) {
            console.log(err);
            $scope.showSimpleToast("Cannot Get Memory From Server");
        });
      }
    }

    $scope.getRegisters=function() {
      if($scope.assembled.length>0){
        $http({
            method:"GET",
            url:"http://127.0.0.1:9000/execute/getregisterfile"
        }).then(function(res) {
            $scope.registers=res.data;
            $scope.showHeads=false;
            $scope.Runbtn();
            console.log($scope.registers);
            $scope.showSimpleToast("Memory Was Get From Server")
        },function(err) {
            console.log(err);
            $scope.showSimpleToast("Cannot Get Memory From Server");
        });
      }
    }

 });
