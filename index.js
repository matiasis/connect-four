var express = require('express');
var app = express();
var matrix = null;
var game_winner = 0;
var turn = 1;

//APP
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

//VIEWS
app.get('/', function (request, response) {
  response.sendfile('./views/pages/index.html');
});

app.get('/games/1', function (request, response) {
  response.sendfile('./views/pages/player_1.html');
});

app.get('/games/2', function (request, response) {
  response.sendfile('./views/pages/player_2.html');
});

//SERVICES
app.get('/matrix', function (req, res) {
  if (matrix == null) {
    init_matrix();
  }
  res.json({matrix: matrix});
});

app.post('/reset_matrix', function (req, res) {
  matrix = null;
  turn = 1;
  game_winner = 0;
  res.json({ok: true});
});

app.get('/turn', function (req, res) {
  res.json({turn: turn, winner: game_winner});
});

app.post('/matrix/select/:player/:row/:col', function (req, res) {
  try {
    var player = req.params.player;
    var row = req.params.row;
    var col = req.params.col;
    select_box(row, col, player);
    update_turn();
    var winner = evaluate_winner();
    res.json({ok: true, winner: winner});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: err});
  }

});

function evaluate_winner() {
  evaluate_horizontal();
  evaluate_vertical();
  evaluate_diagonal();
}

function evaluate_horizontal() {
  var count = 0;
  for (i = 0; i < 6; i++) {
    count = 0;
    for (j = 0; j < 7; j++) {
      if (matrix[i][j].used) {
        if (j == 0) {
          count++;
        } else {
          var act = matrix[i][j];
          var ant = matrix[i][j - 1];
          if (act.player == ant.player) {
            count++;
          } else {
            count = 1;
          }
          if (count == 4) {
            game_winner = act.player;
            console.log("winner");
          }
        }
      }
    }
  }
}

function evaluate_vertical() {
//Not completed due to time
  //  Just iterate the matrix searching for matches vertically.
  //var count = 0;
  //for (i = 0; i < 7; i++) {
  //  count = 0;
  //  for (j = 0; j < 6; j++) {
  //    console.log("evaluating");
  //    if (matrix[j][i].used) {
  //
  //      if (j == 0) {
  //        count++;
  //      } else {
  //        var act = matrix[j][i];
  //        var ant = matrix[j][i - 1];
  //        if (act.player == ant.player) {
  //          count++;
  //        } else {
  //          count = 1;
  //        }
  //        if (count == 4) {
  //          game_winner = act.player;
  //          console.log("winner");
  //        }
  //      }
  //    }
  //  }
  //}
}

function evaluate_diagonal() {
//  Missing due to time.
//  Just iterate the matrix searching for matches diagonally.

}

function select_box(row, col, player) {
  var box = matrix[row][col];
  //Minimum validation
  if (!box.used) {
    var last_not_used = get_last_not_used(row, col);
    if (last_not_used != null) {
      last_not_used.used = true;
      last_not_used.player = player;
    }
  }
}

function get_last_not_used(row, col) {
  var last_not_used = null;
  for (i = row; i < 6; i++) {
    box = matrix[i][col];
    if (!box.used) {
      last_not_used = box;
    }
  }
  return last_not_used;
}

function update_turn() {
  if (turn == 1) {
    turn = 2;
  } else {
    turn = 1;
  }
}

function init_matrix() {
  //6 Rows
  matrix = [
    create_row(),
    create_row(),
    create_row(),
    create_row(),
    create_row(),
    create_row()
  ];
}

function create_row() {
  //7 Cols each row
  var row = [];
  for (i = 0; i <= 6; i++)
    row.push(create_box());
  return row;
}

function create_box() {
  return {used: false, player: 0};
}
