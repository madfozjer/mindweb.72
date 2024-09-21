/*database*/
var player = 
{
  hp: 10,
  moveList: []
}

var sousid = 
{
  name: "sousid",
  move: "AA",
  image: "#",
  hpmodifier: 1,
  hp: 0
}

var sus = 
{
  name: "sus",
  move: "AA",
  image: "$",
  hpmodifier: 1,
  hp: 0
}

/*ui*/
var encounterHPbar;
var healthbar;
var encounterHUD = {
  image: "",
  name: ""
}

/*current state*/
var encounterList = [sousid, sus, sousid];
var diffuclty = 10;
var encounterID = 0;
var currentEncounter;
var moves = [];

/*onload*/
window.onload = function() {
  encounterHPbar = document.getElementById("encounter-healthbar");
  healthbar = document.getElementById("healthbar");
  encounterHUD.image = document.getElementById("encounter-pfp");
  encounterHUD.name = document.getElementById("encounter-name");
  currentEncounter = encounterList[encounterID];
  encounterID += 1;
  currentEncounter.hp = currentEncounter.hpmodifier * diffuclty;
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + player.hp;
};

/*game master*/
function nextEncounter() {
  if (encounterID <= encounterList.length - 1) {
   currentEncounter = encounterList[encounterID];
    encounterID += 1;
    currentEncounter.hp = currentEncounter.hpmodifier * diffuclty;
   encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
   console.log(encounterHUD.image);
    encounterHUD.image.innerHTML = currentEncounter.image;
    encounterHUD.name.innerHTML = currentEncounter.name;
    console.log("new encounter = " + currentEncounter.name);
  }
  else { win(); }
}

function win() {
  let text;
  text = document.getElementById("big-text");
  text.innerHTML = "you won";
  text.classList.toggle("hidden");
}

function lost() {
  let text;
  text = document.getElementById("big-text");
  text.innerHTML = "you lost";
  text.classList.toggle("hidden");
  text.classList.toggle("dark");
}

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
      moveReceiver(moves[i], currentEncounter);
    }

    encounterMove(); //TODO await/async implementation
    turnEnd();
  }

/*encounter side*/
function moveReceiver(move, receiver) {
  switch (move) {
    case "AA":
      receiver.hp -= 3;
      break;
    case "CA+":
      receiver.hp -= 2;
      break;
    default:
      console.log("move receiver error");
  } 
}

function turnEnd() {
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + player.hp;

  if (currentEncounter.hp <= 0) 
    endEncounter();
}

function endEncounter() {
  nextEncounter();
}

function encounterMove() {
  moveReceiver(currentEncounter.move, player);

  if (player.hp <= 0)
    lost();
}

/*ui manipulation*/
function hideMe(item) {
  item.classList.toggle("hidden");
}