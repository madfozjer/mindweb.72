var moves = [];
var encounterHP = 10;
var encounterHPbar;
var encounterList = [pasha];

var pasha = 
{
  hp: "10", /*make dynamic*/
  attack: "AA"
}

window.onload = function() {
  encounterHPbar = document.getElementById("encounter-healthbar");
};

/*move manipulation*/
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var id = ev.target.id.toString().substring(5);
    var data = ev.dataTransfer.getData("text");
    ev.target.innerHTML = data;
    moves[id - 1] = ev.target.innerHTML;
  }

  function sendMoves() {
    for (var i = 0; i < moves.length; i++)
    {
      console.log(moves[i]);
      moveReceiver(moves[i]);
    }
  }

  /*encounter side*/
function moveReceiver(move) {
  switch (move) {
    case "AA":
      encounterHP -= 3;
      turnEnd();
      break;
    case "CA+":
      encounterHP -= 2;
      turnEnd();
      break;
  }

  function turnEnd() {
    encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + encounterHP;
  }
}
