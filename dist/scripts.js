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
  hp: 0,
  value: 2
}

var sus = 
{
  name: "sus",
  move: "AA",
  image: "$",
  hpmodifier: 1,
  hp: 0,
  value: 1
}

//generate characters 
var alex = 
{
  name: "alex",
  moveList: ["", "AA", "CA+", ""],
  gunList: ["", "CAR", "AAR"],
  genes: ["", "energetic"],
  resources: { biohazard: 0, deadbones: 3}
}

var carlos = 
{
  name: "carlos",
  moveList: ["", "AA", ""],
  gunList: ["", "CAR", ""],
  genes: ["", "empty"],
  resources: { biohazard: 3, deadbones: 1}
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
var buildingHR;
var buildingREQ;
var buildingItems = [];
var bigInfo;
var rollREQbutton;
var attackButtons = [];

/*current state*/
var diffuclty = 10;
var encounterID = 0;
var currentEncounter;
var moves = [];
var diceValues = [];
var inDungeon = false;
var char = "";
let rolledChar = {};
var isSavingREQ = false;
var isPreviewingREQ = false;

/*lists*/
var moveList = [""]
var gunList= ["", "CAR", "AAR"]
var encounterList = [sousid, sus, sousid];
var genesList = [];
var buildingList = ["", "HR", "REQ"];
var charList = [alex, carlos];
var possibleChars = {
  biohazard: [alex],
  deadbones: [carlos]
}
var resources = {
  coins: 3
};
var rollResources = {
  biohazard: 40,
  deadbones: 30
}
var rollResourcesUI = {
  biohazard: {},
  deadbones: {}
}
var resourcesUI = {
  coins: {}
}
var characters = [""];
const possibleGuns = {
  CAR: ["AA"],
  AAR: ["CA+", "CA"]
}

/*char generator*/
const  characterGenerator = {
  returnRandomName() {
    let nameList = ["aliona", "sasha", "sanìa", "nastia", "dimon", "kirucha", "yasya", "andruha", "tioma", "dasha", "hanya", "inga", "olia"]
    return nameList[random(0, nameList.length)];
  },

  returnGun(type) { 
    if (type == "biohazard") {
      let list = ["CAR"];
      return list[random(0, list.length)];
    }
    else if (type = "deadbones") {
      let list = ["AAR"];
      return list[random(0, list.length)];
    }
  },

  returnAttack(gun) {
    let returnval;

    Object.keys(possibleGuns).forEach(key => {
      if (key == gun) {
        key = key.toString();
        let gun = possibleGuns[key];
        let ran1 = random(0, gun.length); let ran2 = random(0, gun.length);
        returnval = [gun[ran1], gun[ran2]];
      }
    })

    return returnval;
  }
}


/*onload*/ //TODO cash current state
window.onload = function() {  
  encounterHPbar = document.getElementById("encounter-healthbar");
  healthbar = document.getElementById("healthbar");
  encounterHUD.image = document.getElementById("encounter-pfp");
  encounterHUD.name = document.getElementById("encounter-name");
  charlistDescription = document.getElementById("info");
  buildingHR = document.getElementById("HR-building");
  buildingREQ = document.getElementById("REQ-building");
  bigInfo = document.getElementById("biginfobox");
  currentEncounter = encounterList[encounterID];
  rollREQbutton =  document.getElementById("roll-REQ");
  buildingItems.length = 10;
  buildingList.length = 10;
  encounterID += 1;
  currentEncounter.hp = currentEncounter.hpmodifier * diffuclty;
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + player.hp;
  resourcesUI.coins = document.getElementById('coins'); resourcesUI.coins.innerHTML = "@" + resources.coins;
  rollResourcesUI.biohazard = document.getElementById("biohazard"); rollResourcesUI.biohazard.innerHTML = "biohazard: " + rollResources.biohazard;
  rollResourcesUI.deadbones = document.getElementById("deadbones"); rollResourcesUI.deadbones.innerHTML = "deadbones: " + rollResources.deadbones;
  
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
      buildingItems[i].setAttribute('title', buildingItems[i].innerHTML);
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
   resources.coins += currentEncounter.value;
   updateUI();
   console.log(resources.coins);
   currentEncounter = encounterList[encounterID];
   encounterID += 1;
   currentEncounter.hp = currentEncounter.hpmodifier * diffuclty;
   encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
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
  var index = moveList.indexOf(move);
  switch(index) {
    case 1:
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

function characterChoose(title, mode) {
  if (!inDungeon) {
    for (i = 0; i < charList.length; i++) {
      if (title == charList[i].name) {
        char = charList[i];
      }
    }

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
          charlistGenes[i].innerHTML = geneIcons(genes[i]);
          charlistGenes[i].setAttribute('title', genes[i]);
        }
        else if (genes[i] == "empty") {
          charlistGenes[i].innerHTML = "";
        }

        if (mode == "preview" || rolledChar != char) {
          rolledChar = char;
          document.getElementById("blocker-REQ").classList.toggle("hidden");
          rollREQbutton.classList.toggle("hidden");
          document.getElementById("delete-REQ").classList.toggle("hidden");
          document.getElementById("save-REQ").classList.toggle("hidden");
        }
      }
    }
    }

function deleteREQ() {
  rollResources.biohazard += rolledChar.resources.biohazard;
  rollResources.deadbones += rolledChar.resources.deadbones;
  updateUI();
  rolledChar = {};
  document.getElementById("REQ-preview").innerHTML = "";
  document.getElementById("blocker-REQ").classList.toggle("hidden");
  rollREQbutton.classList.toggle("hidden");
  document.getElementById("delete-REQ").classList.toggle("hidden");
  document.getElementById("save-REQ").classList.toggle("hidden");
  isPreviewingREQ = false;
}

function saveREQ() {  //develop better way!!
  isSavingREQ = true;
  document.getElementById("chooseSlotText").classList.toggle("hidden");
  document.getElementById("delete-REQ").classList.toggle("hidden");
  document.getElementById("save-REQ").classList.toggle("hidden");
}

function reqSlot(id) {
  if (isSavingREQ && isSavingREQ != undefined) {
    if (charList[id] != undefined) {
      console.log("krya");
      rollResources.biohazard += charList[id].resources.biohazard;
      rollResources.deadbones += charList[id].resources.deadbones;
      updateUI();
    }

    charList[id] = rolledChar;
    document.getElementById("blocker-REQ").classList.toggle("hidden");
    let item = document.getElementById("REQcharacter-" + id);
    item.innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    item.title = rolledChar.name;
    let itemHR = document.getElementById("character-" + id);
    itemHR.innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    itemHR.title = rolledChar.name;
    rolledChar = {};
    isSavingREQ = false;
    document.getElementById("chooseSlotText").classList.toggle("hidden");
    rollREQbutton.classList.toggle("hidden");
    document.getElementById("REQ-preview").innerHTML = "";
    isPreviewingREQ = false;
  }
}

function rollREQ() {
  if (resources.coins > 0) {
    rolledChar = calcRoll();
    resources.coins--;
    document.getElementById("roll-REQ")
    updateUI();
    document.getElementById("REQ-preview").innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    document.getElementById("REQ-preview").title = rolledChar.name.charAt(0).toLowerCase() + rolledChar.name.slice(1);  
    characterChoose(rolledChar.name, 'preview');
    isPreviewingREQ = true;
  }
}

function calcRoll() {
  let biohazard = Math.round(rollResources.biohazard / 10);
  let deadbones = Math.round(rollResources.deadbones / 10); 
  let ran = random(0, 10);
  let chart = [];
  
  for (i = 0; i < 10; i++) {
    if (biohazard > i) {
      chart[i] = "biohazard";
    }
    else if (biohazard + deadbones > i) {
      chart[i] = "deadbones";
    }
    else {
      chart[i] = "random";
    }
  }

  if (chart[ran] == "biohazard") {  //optimize
    return possibleChars.biohazard[random(0, possibleChars.biohazard.length)];
  } else if (chart[ran] == "deadbones") {
    return possibleChars.deadbones[random(0, possibleChars.deadbones.length)];
  } else {
    let randomInt = random(0, 1); //add automatic types counter
    if (randomInt == 0 ) {
      return possibleChars.biohazard[random(0, possibleChars.biohazard.length)];
    } else if (randomInt == 1) {
      return possibleChars.deadbones[random(0, possibleChars.deadbones.length)];
  }
}
}

//add save? button function + add to rollREQ() this shi

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
    
    for (i = 1; i < moveList.length - 1; i++) {
      console.log(moveList[i]);
      let item = document.getElementById(moveList[i]);
      item.id = moveList[i];
      item.id.innerHTML = i + " " + moveList[i].name;
      item.classList.toggle("hidden");
    }

    button.classList.toggle("hidden")
    inDungeon = true;
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

function HR() { //optimize
  buildingHR.classList.toggle("hidden");

  for (i = 1; i < buildingItems.length; i++) {
    buildingItems[i].classList.toggle("hidden");
  }

  if (!inDungeon) {
    document.getElementById("blocker-HR").classList.toggle("hidden");
  }
}

function REQ() {
  if (!isPreviewingREQ) {
    buildingREQ.classList.toggle("hidden");
    rollREQbutton.classList.toggle("hidden");

    for (i = 1; i < buildingItems.length; i++) {
      buildingItems[i].classList.toggle("hidden");
    }
  }
}

function building(id) {
  switch (id) {
    case "HR":
      HR();
      break;
    case "REQ":
      REQ();
  }
}
function toggleBigInfo() {
  bigInfo.classList.toggle("hidden");
}

function updateUI() {
  resourcesUI.coins.innerHTML = "@" + resources.coins;
  rollResourcesUI.biohazard.innerHTML = "biohazard: " + rollResources.biohazard;
  rollResourcesUI.deadbones = document.getElementById("deadbones"); rollResourcesUI.deadbones.innerHTML = "deadbones: " + rollResources.deadbones;
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