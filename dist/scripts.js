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

var alex =
{
  name: "alex",
  moveList: ["", "AA","CA+", ""],
  gunList: ["", "CAR", "AAR"],
  genes: ["", "energetic"]
}

var carlos = 
{
  name: "carlos",
  moveList: ["", "AA", ""],
  gunList: ["", "CAR", ""],
  genes: ["", "empty"]
}

/*ui*/
var encounterHPbar;
var healthbar;
var encounterHUD = {
  image: "",
  name: ""
}
var charlistDescription;
var charlistItems = []; charlistItems.length = 4;
var charlistGuns = []; charlistGuns.length = 3;
var charlistGenes = []; charlistGenes.length = 12; //automatic?
var moveSlots = [];
var bazeInfobox;
var buildingItems = [];
var bigInfo;

/*current state*/
var diffuclty = 10;
var encounterID = 0;
var currentEncounter;
var moves = [];
var diceValues = [];
var inDungeon = false;
var char = "";

/*lists*/
var moveList = [""]
var gunList= ["", "CAR", "AAR"]
var encounterList = [sousid, sus, sousid];
var genesList = [];
var buildingList = ["", "HR"];
var charList = [alex,carlos];
var resources = {
  "@": 3
}
var characters = [""];

/*onload*/ //TODO cash current state
window.onload = function() {  
  encounterHPbar = document.getElementById("encounter-healthbar");
  healthbar = document.getElementById("healthbar");
  encounterHUD.image = document.getElementById("encounter-pfp");
  encounterHUD.name = document.getElementById("encounter-name");
  charlistDescription = document.getElementById("info");
  bazeInfobox = document.getElementById("baze-infobox");
  bigInfo = document.getElementById("biginfobox");
  currentEncounter = encounterList[encounterID];
  buildingItems.length = 10;
  buildingList.length = 10;
  encounterID += 1;
  currentEncounter.hp = currentEncounter.hpmodifier * diffuclty;
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + player.hp;
  
  for (i = 1; i < charlistItems.length; i++) {
    charlistItems[i] = document.getElementById("item-" + i);
  }

  for (i = 1; i < charlistGuns.length; i++) {
    charlistGuns[i] = document.getElementById("gun-" + i);
  }

  for (i = 1; i < charlistGenes.length; i++) {
    charlistGenes[i] = document.getElementById("gen-" + i);
  }

  for (i = 1; i < buildingList.length; i++) {
    buildingItems[i] = document.getElementById("building-" + i);
    if (buildingList[i] != undefined) {
      buildingItems[i].innerHTML = buildingList[i];
      buildingItems[i].setAttribute('title', buildingItems[i]);
    } else { buildingItems[i].innerHTML = ""; }
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
  console.log(data);
  setSlotColor(data, ev.target);
}

function setSlotColor(move, slot) {
  var index = moveList.indexOf(move);
  switch(index) {
    case 1:
      console.log("case 1");
      slot.style.color = "purple";
      break;
    case 2:
      console.log("case 2");
      slot.style.color = "blue";
      break;
  }
}

function sendMoves() {
  for (var i = 0; i < moves.length; i++)
  {
    console.log(moves[i]);
    moveReceiver(moves[i], currentEncounter, i);
  }

  for (i = 0; i < genesList.length; i++) {
    genetics(genesList[i], "post");
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

  for (i = 0; i < genesList.length; i++) {
    genetics(genesList[i], "pre");
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

function characterChoose(title) {
  if (!inDungeon) {
    for (i = 0; i < charList.length; i++) {
      if (title == charList[i].name) {
        char = charList[i];
      }
    }

    if (char != undefined) {
      moveList = char.moveList;
      gunList = char.gunList;
      genes = char.genes;

      for (i = 1; i < moveList.length; i++) { 
        if (moveList[i] != undefined || moveList[i] != "") {
          charlistItems[i].innerHTML = moveList[i];
          charlistItems[i].setAttribute('title', moveList[i]);
      }
    }

      for (i = 1; i < gunList.length; i++) {
        if (moveList[i] != undefined || moveList[i] != "") {
          charlistGuns[i].innerHTML = gunList[i];
          charlistGuns[i].setAttribute('title', gunList[i]);
        }
      }

      for (i = 1; i < genes.length; i++) {
        if (genes[i] != undefined && genes[i] != "empty") {
          console.log(genes[i]);
          charlistGenes[i].innerHTML = geneIcons(genes[i]);
          charlistGenes[i].setAttribute('title', genes[i]);
        }
        else if (genes[i] == "empty") {
          console.log("empty");
          charlistGenes[i].innerHTML = "";
        }
      }
    }
    }
}

/*encounter side*/
function moveReceiver(move, receiver, index) { //automatic moves code
  if (receiver == currentEncounter) {
    switch (move) {
      case "AA":
        receiver.hp -= diceValues[index + 1];
        break;
      case "CA+":
        receiver.hp -= 2;
        break;
      default:
        console.log("move receiver error");
    } 
  }
  else if (receiver == player) {
    switch (move) {
      case "AA":
        receiver.hp -= 4;
        break;
      case "CA+":
        receiver.hp -= 6;
        break;
      default:
        console.log("move receiver error");
    } 
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
function goDungeon(button) {
  if (char != "") {
    var dungen = document.getElementById("dungeon-wrapper");
    button.classList.toggle("hidden")
    inDungeon = true;
    document.getElementById("blocker").classList.toggle("hidden");
    dungen.classList.toggle("hidden");
  }
  else {
    bigInfo.innerHTML = "choose character!";
    bigInfo.classList.toggle("hidden");
  }
}

function hideMe(item) {
  item.classList.toggle("hidden");
}

function description(id) { //automatic descriptions
  switch (id) {
      case "AA":
        charlistDescription.innerHTML = "really powerfull move";
        selectAnimation("AA", "mouseEnter");
        break;
      case "CA+":
        charlistDescription.innerHTML = "less powerfull move";
        selectAnimation("CA+", "mouseEnter");
        break;
      case "CAR":
        charlistDescription.innerHTML = "lightsaber like knife";
        selectAnimation("CAR", "mouseEnter");
        selectAnimation("CA+", "mouseEnter");
        break;
      case "AAR":
        charlistDescription.innerHTML = "short gun for xptional marksmans, u know";
        selectAnimation("AAR", "mouseEnter");
        selectAnimation("AA", "mouseEnter");
        break;
      case "energetic":
        charlistDescription.innerHTML = "a lot of energy in this legs and mind. and above legs also.";
        break;
    case "standart":
      selectAnimation("", "mouseLeave");
      charlistDescription.innerHTML = "";
      break;
    default:
      charlistDescription.innerHTML = "";  
  }
}

function selectAnimation(item, action) {  //optimize + more select animations
  if (moveList.includes(item) && action == "mouseEnter") {
    for (i = 0; i < moveList.length; i++) {
      var index = moveList.indexOf(item, i);
      if (charlistItems[index] != undefined)
        charlistItems[index].style.fontWeight = 400;
    }
  }

  if (moveList.includes(item) && action == "mouseLeave") {
    for (i = 1; i < moveList.length; i++) {
      if (charlistItems[i] != undefined)
        charlistItems[i].style.fontWeight = 100;
    }
  }

  if (gunList.includes(item) && action == "mouseEnter") {
    for (i = 0; i < gunList.length; i++) {
      var index = gunList.indexOf(item, i);
      if (charlistGuns[index] != undefined)
        charlistGuns[index].style.fontWeight = 400;
    }
  }

  if (gunList.includes(item) && action == "mouseLeave") {
    for (i = 1; i < gunList.length; i++) {
      if (charlistGuns[i] != undefined)
        charlistGuns[i].style.fontWeight = 100;
    }
  }
}

function bazeInfo() { //optimize
  bazeInfobox.classList.toggle("hidden");

  for (i = 1; i < buildingItems.length; i++) {
    buildingItems[i].classList.toggle("hidden");
  }

  if (!inDungeon) {
    document.getElementById("blocker").classList.toggle("hidden");
  }
}

function toggleBigInfo() {
  bigInfo.classList.toggle("hidden");
}

/*genes*/
function genetics(gene, stage) { //automatic genes
  if (stage == "pre") {
    switch(gene) {
      case "energetic":
        diceValues[1] += 1;
        moveSlots[1].innerHTML = diceValues[1];
        moveSlots[1].style.color = "red";
    }
  }
  else if (stage == "post") {
    switch(gene) {
    }
  }
}

function geneIcons(gene) {
  switch(gene) {
    case "energetic":
      return "⚡";
  }
}

/*misc*/
function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}