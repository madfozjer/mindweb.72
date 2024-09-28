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
var charlistDescription;
var charlistItems = [];
var moveSlots = [];

/*current state*/
var encounterList = [sousid, sus, sousid];
var diffuclty = 10;
var encounterID = 0;
var currentEncounter;
var moves = [];
var diceValues = [];
var moveList = ["", "AA", "CA+", "CA+"]

/*onload*/
window.onload = function() {
  encounterHPbar = document.getElementById("encounter-healthbar");
  healthbar = document.getElementById("healthbar");
  encounterHUD.image = document.getElementById("encounter-pfp");
  encounterHUD.name = document.getElementById("encounter-name");
  charlistDescription = document.getElementById("info");
  currentEncounter = encounterList[encounterID];
  encounterID += 1;
  currentEncounter.hp = currentEncounter.hpmodifier * diffuclty;
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + player.hp;
  
  for (i = 1; i < moveList.length; i++) {
    charlistItems[i] = document.getElementById("item-" + i);

    if (moveList[i] != undefined)
      charlistItems[i].innerHTML = moveList[i];
      charlistItems[i].setAttribute('title', moveList[i]);
  }

  moveSlots.length = 4;
  for (i = 1; i <= 4; i++) {
    moveSlots[i] = document.getElementById("move-" + i);
  }

  diceValues.length = 5; diceRoller(); 
}

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
  ev.dataTransfer.clearData();
  ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
  ev.preventDefault();
  var id = ev.target.id.toString().substring(5);
  var data = ev.dataTransfer.getData("text");
  //ev.target.innerHTML = data;
  moves[id - 1] = data;
  setSlotColor(data, ev.target);
}

function setSlotColor(move, slot) {
  var index = moves.indexOf(move) + 1;
  switch(index) {
    case 1:
      console.log("case 1");
      slot.style.color = "purple";
      break;
    case 2:
      slot.style.color = "blue";
      break;
  }
}

function sendMoves() {
  for (var i = 0; i < moves.length; i++)
  {
    console.log(moves[i]);
    moveReceiver(moves[i], currentEncounter);
  }

  encounterMove(); //TODO await/async implementation
  turnEnd();
  diceRoller();
}

function diceRoller() {
  for (i = 1; i < diceValues.length; i++) {
    diceValues[i] = diceRoll();
    moveSlots[i].innerHTML = diceValues[i];
  }
}

function diceRoll() {  // 21 = 6; 19,20 = 5; 16,17,18 = 4; 12,13,14,15 = 3; 7,8,9,10,11 = 2; 1,2,3,4,5,6 = 1
  var seed = random(1, 21);

  if (seed < 7) {
    return 1;
  }
  
  if (seed > 6 && seed < 12) {
    return 2;
  }

  if (seed > 11 && seed < 16) {
    return 3;
  }

  if (seed > 15 && seed < 19) {
    return 4;
  }

  if (seed > 18 && seed < 21) {
    return 5;
  }

  if (seed == 21) {
    return 6;
  }
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

function description(id) {
  switch (id) {
      case "AA":
        charlistDescription.innerHTML = "really powerfull move";
        selectAnimation("AA", "mouseEnter");
        break;
      case "CA+":
        charlistDescription.innerHTML = "less powerfull move";
        selectAnimation("CA+", "mouseEnter");
        break;
    case "standart":
      selectAnimation("", "mouseLeave");
      charlistDescription.innerHTML = "";
      break;
    default:
      charlistDescription.innerHTML = "";  
  }
}

function selectAnimation(item, action) {  /*optimize + animation*/
  if (moveList.includes(item) && action == "mouseEnter") {
    for (i = 0; i < moveList.length; i++) {
      var index = moveList.indexOf(item, i);
      if (charlistItems[index] != undefined)
        charlistItems[index].style.fontWeight = 400;
    }
  }

  if (action == "mouseLeave") {
    for (i = 1; i < moveList.length; i++) {
      if (charlistItems[i] != undefined)
        charlistItems[i].style.fontWeight = 100;
    }
  }
}

/*misc*/
function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}