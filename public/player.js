angular.module('connectfour', []);

function playerController($scope, $http, $window, $location, $timeout) {

  update_matrix($scope, $http);
  wait_turn($scope, $http, 1);

  $scope.select_box = function (row, col) {
    select_box($scope, $http, 1, row, col);
    update_turn($scope, $http, 1);
    wait_turn($scope, $http, 1);
  };

  $scope.$watch('turn', function () {
    update_matrix($scope, $http);
  });

}

function player2Controller($scope, $http, $window, $location, $timeout) {

  update_matrix($scope, $http);
  wait_turn($scope, $http, 2);

  $scope.select_box = function (row, col) {
    select_box($scope, $http, 2, row, col);
    update_turn($scope, $http, 2);
    wait_turn($scope, $http, 2);
  };

  $scope.$watch('turn', function () {
    update_matrix($scope, $http);
  });


}

function wait_turn($scope, $http, player) {

  var refresh_time = 500;

  (function () {
    action = function () {
      if (!$scope.turn) {
        update_turn($scope, $http, player);
        setTimeout(action, refresh_time);
      }
    };

    setTimeout(action, refresh_time);
  })();

}

function update_matrix($scope, $http) {
  $http.get("/matrix").success(function (data) {
    $scope.matrix = data.matrix;
  });
}

function update_turn($scope, $http, player) {
  console.log("updating turn...");
  $http.get("/turn").success(function (data) {
    $scope.turn = data.turn == player;
    $scope.winner = data.winner == player;
    $scope.loser = (data.winner != 0 && data.winner != player);
  });
}

function select_box($scope, $http, player, row, col) {
  //Fast workaround to avoid fast double-click
  $scope.turn = 0;

  $http.post("/matrix/select/" + player + "/" + row + "/" + col).success(function (data) {
    //console.log(data);
    //$scope.winner = data.winner;
    update_matrix($scope, $http);
  }).error(function (data) {
    console.log(data);
  });
}