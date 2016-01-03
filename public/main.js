angular.module('connectfour', []);

function mainController($scope, $http, $window, $location) {

  $scope.select_player = function (player) {
    window.location.replace("/games/" + player);
  };

  $scope.new_game = function () {
    $http.post("/reset_matrix").success(function (data) {
      //$scope.winner = data.winner;
      //update_matrix($scope, $http);
      $scope.new_game = data.ok;
    }).error(function (data) {
      console.log(data);
    });
  };



}