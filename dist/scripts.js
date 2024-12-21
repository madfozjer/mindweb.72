/*database*/
var sousid = 
{
  name: "sousid",
  move: "CA+",
  image: "#",
  basehp: 8,
  hp: 8,
  value: 2
}

var sus = 
{
  name: "sus",
  move: "CA+",
  image: "$",
  basehp: 10,
  hp: 10,
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
var damageDealtUI;
var damageReceivedUI;

/*current state*/
var diffuclty = 1;
var encounterID = 1;
var currentEncounter; 
var moves = [];
var diceValues = [];
var inDungeon = false;
var char;
let rolledChar = {};
var isSavingREQ = false;
var isPreviewingREQ = false;
var damageDealt = 0;
var damageReceived = 0;
var charID = 0;
var backup;
var hp = 0;

/*lists*/
var moveList = [""]
var gunList= [""]
var encounterList = [];
var possibleEncounters = [sousid, sus, sus];
var genesList = [];
var buildingList = ["", "HR", "REQ"];
var charList = [];
var possibleChars = {
  biohazard: [alex],
  deadbones: [carlos]
}
var resources = {
  coins: 3
};
var rollResources = {
  biohazard: 50,
  deadbones: 50
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
  },

  returnGene(type) {
    if (type == "biohazard") {
      let list = ["empty", "empty", "energetic"]  //rewrite like this { empty: 99, energetic: 1 } out of 100
      return list[random(0, list.length)];
    }
    else if (type == "deadbones") {
      let list = ["empty", "empty", "empty", "sanchin"];
      return list[random(0, list.length)];
    }
  }
}


/*onload*/ //TODO cash current state
window.onload = function() {  
  encounterList = generateEncounters(5);
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
  currentEncounter.hp = Math.floor(currentEncounter.basehp + diffuclty / 10);
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  resourcesUI.coins = document.getElementById('coins'); resourcesUI.coins.innerHTML = "@" + resources.coins;
  rollResourcesUI.biohazard = document.getElementById("biohazard"); rollResourcesUI.biohazard.innerHTML = "biohazard: " + rollResources.biohazard;
  rollResourcesUI.deadbones = document.getElementById("deadbones"); rollResourcesUI.deadbones.innerHTML = "deadbones: " + rollResources.deadbones;
  damageDealtUI = document.getElementById("damage-dealt");
  damageReceivedUI = document.getElementById("damage-received");
  
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

  diceValues.length = 5; 
}

/*game master*/
function nextEncounter() {
  if (encounterID <= encounterList.length - 1) {
   resources.coins += currentEncounter.value;
   currentEncounter = encounterList[encounterID - 1];
   diffuclty++;
   encounterID++
   updateUI();
   currentEncounter.hp = Math.floor(currentEncounter.basehp + (diffuclty / 10));
   encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
   encounterHUD.image.innerHTML = currentEncounter.image;
   encounterHUD.name.innerHTML = currentEncounter.name;
  }
  else { win(); }
}

function win() {
  updateUI();
  resources.coins += diffuclty;
  let text;
  text = document.getElementById("big-text");
  text.innerHTML = "you won";
  text.classList.toggle("hidden");
  goDungeon();
}

function lost() {
  let text;
  text = document.getElementById("big-text");
  text.innerHTML = "you lost";
  text.classList.toggle("hidden");
  text.classList.toggle("dark");
  goDungeon();
  encounterID = 1;
  diffuculty = 1;
  char = "";
  charList[charID] = "";
  let item = document.getElementById("character-" + charID);
  item.innerHTML = ""; item.removeAttribute("title");
  charID = -1;
  turnOffMoveUI();
  updateUI();
}

function retreat() {
  goDungeon();
  player.hp = hp;
  encounterID = 1;
  diffuclty = 1;
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
  moves[id] = data;
  setSlotColor(data, ev.target);
}

function setSlotColor(move, slot) {
  var index = moveList.indexOf(move.substr(0, move.length - 5));
  slot.style.color = returnMoveColor(moveList[index]);
}

function removeMove(id) {
  if (moves[id] != null) {
    moves[id] = null;
    let slot = document.getElementById("move-" + id);
    slot.style.color = "#0c0c0c";
  }
}

function sendMoves() {
  damageDealt = 0;
  damageReceived = 0;

  for (var i = 1; i < moves.length; i++)
  {
    if (moves[i] != undefined) {
      moveReceiver(moves[i], currentEncounter, i);
    }
  }

  for (i = 1; i < genes.length; i++) {
    genetics(genes[i], "post");
  }

  damageDealtUI.innerHTML = "-" + damageDealt;
  encounterMove(); //TODO await/async implementation
  turnEnd();
  diceRoller();
}

function diceRoller() {
  for (i = 1; i < diceValues.length; i++) {
    diceValues[i] = diceRoll();
    moveSlots[i].innerHTML = diceValues[i];
  }

  for (i = 1; i < genes.length; i++) {
    genetics(genes[i], "pre");
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

function characterChoose(Char, mode, id) {
    if (!inDungeon && mode != "preview" && charList[id] != undefined && charList[id] != "") {
      char = Char;
      moveList = char.moveList;
      gunList = char.gunList;
      genes = char.genes;
      charID = id;

      for (i = 1; i < moveList.length; i++) { 
        if (moveList[i] != undefined || moveList[i] != "") {
          charlistItems[i].innerHTML = moveList[i];
          charlistItems[i].setAttribute('title', moveList[i]);
        }
      }

      for (i = 1; i < charlistItems.length; i++) {
        if (moveList[i] != charlistItems[i].innerHTML && charlistItems[i].innerHTML != undefined) {
          charlistItems[i].innerHTML = "";
          charlistItems[i].removeAttribute("title");
        }
      }
  
        for (i = 1; i < gunList.length; i++) {
          if (gunList[i] != undefined || gunList[i] != "") {
            charlistGuns[i].innerHTML = gunList[i];
            charlistGuns[i].setAttribute('title', gunList[i]);
          }
        }

        for (i = 1; i < charlistGuns.length; i++) {
          if (gunList[i] != charlistGuns[i].innerHTML && charlistGuns[i].innerHTML != undefined) {
            charlistGuns[i].innerHTML = "";
            charlistGuns[i].removeAttribute("title");
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
        }

        for (i = 1; i < genes.length; i++) {
          if (geneIcons(genes[i]) != charlistGenes[i].innerHTML && charlistGenes[i].innerHTML != undefined) {
            charlistGenes[i].innerHTML = "";
            charlistGenes[i].removeAttribute("title");
          }
        }
      }

      if (mode == "preview") { //rewrite preview to be only visual
        for (i = 1; i < rolledChar.moveList.length; i++) { 
          if (rolledChar.moveList[i] != undefined || rolledChar.moveList[i] != "") {
            charlistItems[i].innerHTML = rolledChar.moveList[i];
            charlistItems[i].setAttribute('title', rolledChar.moveList[i]);
          }
        }

        for (i = 1; i < rolledChar.gunList.length; i++) {
          if (rolledChar.gunList[i] != undefined || rolledChar.gunList[i] != "") {
            charlistGuns[i].innerHTML = rolledChar.gunList[i];
            charlistGuns[i].setAttribute('title', rolledChar.gunList[i]);
          }
        }

        for (i = 1; i < rolledChar.genes.length; i++) {
          if (rolledChar.genes[i] != undefined && rolledChar.genes[i] != "empty") {
            charlistGenes[i].innerHTML = geneIcons(rolledChar.genes[i]);
            charlistGenes[i].setAttribute('title', rolledChar.genes[i]);
          }
          else if (rolledChar.genes[i] == "empty") {
            charlistGenes[i].innerHTML = "";
          }
        }

        document.getElementById("blocker-REQ").classList.toggle("hidden");
        rollREQbutton.classList.toggle("hidden");
        document.getElementById("delete-REQ").classList.toggle("hidden");
        document.getElementById("save-REQ").classList.toggle("hidden");
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
  turnOffMoveUI()
}

function saveREQ() {  //develop better way!!
  isSavingREQ = true;
  document.getElementById("chooseSlotText").classList.toggle("hidden");
  document.getElementById("delete-REQ").classList.toggle("hidden");
  document.getElementById("save-REQ").classList.toggle("hidden");
}

function reqSlot(id) {
  if (isSavingREQ && isSavingREQ != undefined) {
    char = rolledChar;
    rollResources.biohazard -= char.resources.biohazard * 10;
    rollResources.deadbones -= char.resources.deadbones * 10;
    charList[id] = rolledChar;
    document.getElementById("blocker-REQ").classList.toggle("hidden");
    let item = document.getElementById("REQcharacter-" + id);
    item.innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    item.title = rolledChar.name;
    let itemHR = document.getElementById("character-" + id);
    itemHR.innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    itemHR.title = rolledChar.name;
    document.getElementById("chooseSlotText").classList.toggle("hidden");
    rolledChar = {};
    isSavingREQ = false;
    rollREQbutton.classList.toggle("hidden");
    document.getElementById("REQ-preview").innerHTML = "";
    isPreviewingREQ = false;
    char = "";
    turnOffMoveUI();
}
}

function turnOffMoveUI() { //fix character choose when rolling
  for (i = 1; i < charlistItems.length; i++) { 
    charlistItems[i].innerHTML = "";
  }

  for (i = 1; i < charlistGuns.length; i++) { 
    charlistGuns[i].innerHTML = "";
  }

  for (i = 1; i < charlistGenes.length; i++) { 
    charlistGenes[i].innerHTML = "";
  }
}

function rollREQ() {
  console.log(chance(0, 100));
  if (resources.coins > 0) {
    rolledChar = generateCharacter();
    resources.coins--;
    document.getElementById("roll-REQ");
    updateUI();
    document.getElementById("REQ-preview").innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    document.getElementById("REQ-preview").title = rolledChar.name.charAt(0).toLowerCase() + rolledChar.name.slice(1);  
    characterChoose(rolledChar, 'preview');
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

function generateCharacter() {
  let biohazard = Math.round(rollResources.biohazard / 10);
  let deadbones = Math.round(rollResources.deadbones / 10); 
  let Name = characterGenerator.returnRandomName();
  let gunlist = [""];
  let genelist = [""];
  let Resources = {biohazard: 0, deadbones: 0 };
  let ran = random(1, 10);
  
  let n = random(2, 4); gunlist.length = n;
  for (i = 1; i < n; i++) {
    let type = (ran > biohazard) ? "biohazard" : "deadbones";
    gunlist[i] = characterGenerator.returnGun(type);

    if (type == "biohazard") { resources.biohazard++; }
    else if (type == "deadbones") { resources.deadbones++; }
  }

  for (i = 0; i < gunlist.length; i++) {
    for (a = 0; a < gunlist.length; a++) {
      if (gunlist[i] == gunlist[a] && a != i) {
        gunlist.splice(a, 1);
      }
    }
  }

  n = random(2, 5);
  movelist = []; movelist.length = n;
  for (i = 1; i < gunlist.length; i++) {
    for (a = 1; a < n; a++) {
      let moves = characterGenerator.returnAttack(gunlist[i]);
      let ran = random(0, moves.length);
      movelist[a] = moves[ran];
    }
  }

  for (i = 0; i < movelist.length; i++) {
    for (a = 0; a < movelist.length; a++) {
      if (movelist[i] == movelist[a] && a != i) {
        movelist.splice(a, 1);
      }
    }
  }

  n = random(2, 4); genelist.length = n;
  for (i = 1; i < n; i++) {
    let type = (ran > biohazard) ? "biohazard" : "deadbones";
    genelist[i] = characterGenerator.returnGene(type);

    if (genelist[i] == "empty") {
      genelist.splice(a, 1);
      break;
    }

    if (type == "biohazard") { Resources.biohazard++; }
    else if (type == "deadbones") { Resources.deadbones++; }
  }

  let Hp = random(3, 25);

  return { name: Name, moveList: movelist, gunList: gunlist, genes: genelist, resources: Resources, hp: Hp };
}

/*encounter side*/
function moveReceiver(move, receiver, index) { //automatic moves code
  if (receiver == currentEncounter) {
    switch (move) {
      case "AA-move":
        let random = diceValues[index];
        receiver.hp -= random;
        damageDealt += random;
        break;
      case "CA+-move":
        receiver.hp -= 2;
        damageDealt += 2;
        break;
      case "CA-move":
        receiver.hp--;
        damageDealt++;
        break;
      default:
        console.log("move receiver error");
    } 
  }
  else if (receiver == player) {
    switch (move) {
      case "AA":
        let random = random(1, 3)
        receiver.hp -= random;
        damageReceived += random;
        break;
      case "CA+":
        receiver.hp -= 2;
        damageReceived += 2;
        break;
      default:
        console.log("move receiver error");
    } 
  }
}

function turnEnd() {
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + hp;

  if (currentEncounter.hp <= 0) 
    endEncounter();
}

function endEncounter() {
  nextEncounter();
}

function encounterMove() {
  moveReceiver(currentEncounter.move, player);
  damageReceivedUI.innerHTML = "-" + damageReceived;

  if (hp <= 0)
    lost();
}

/*ui manipulation*/
function goDungeon(button) {
  if (char != "") {
    hp = char.hp;
    for (i = 1; i < moveList.length - 1; i++) {
      let item = document.getElementById(moveList[i].toString() + "-move");
      if (item != null) {
        item.id = moveList[i].toString();
        item.id.innerHTML = i + " " + moveList[i].name;
        item.classList.toggle("hidden");
      }
    }

    var dungen = document.getElementById("dungeon-wrapper");
    
    if (button != undefined) { button.classList.toggle("hidden"); } else { document.getElementById("start-button").classList.toggle("hidden"); }
    inDungeon = !inDungeon;
    dungen.classList.toggle("hidden");

    if (!inDungeon) {
      encounterList = generateEncounters(5);
      encounterID = 1;
      currentEncounter.hp = Math.floor(currentEncounter.basehp + diffuclty / 10);
      encounterHPbar.innerHT = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
    }

    let div = document.getElementById("move-list");
    div.innerHTML = "";
    for (i = 1; i < moveList.length; i++) {
      if (moveList[i] != "" && moveList[i] != undefined) {
        div.innerHTML += `<div id="` + moveList[i].toString() + `-move" class="font-semibold hover:cursor-pointer hover:font-bold" draggable="true" ondragstart="drag(event)" onmouseover="description(event.target.id)" onmouseleave="description('standart')" style="color: ` + returnMoveColor(moveList[i]) + `">` + i + `. ` + moveList[i].toString() + `</div>`;
      }  
    } 

    /*for (i = 1; i < 5; i++) { ! MAKE COLORS TURN OFF
      document.getElementById("move-" + i).classList.toggle(returnMoveColor(moveList[i]));
    }*/

    diceRoller(); 
    updateUI();
  }
  else {
    bigInfo.innerHTML = "choose character!";
    bigInfo.classList.toggle("hidden");
  }
}

function generateEncounters(n) {
  let list = []; list.length = possibleEncounters.length;

  for (i = 0; i < n; i++) {
    list[i] = possibleEncounters[random(0, possibleEncounters.length)];
  }

  return list;
}

function hideMe(item) {
  item.classList.toggle("hidden");
}

function description(id) { //automatic descriptions
  switch (id) {
      case "AA-move":
        charlistDescription.innerHTML = "really powerful move. <br>dmg: d6";
        selectAnimation("AA", "mouseEnter");
        break;
      case "CA+-move":
        charlistDescription.innerHTML = "less powerful move. <br>dmg: 2";
        selectAnimation("CA+", "mouseEnter");
        break;
      case "CA-move":
        charlistDescription.innerHTML = "less less powerful move. <br>dmg: 1";
        selectAnimation("CA", "mouseEnter");
        break;
      case "CAR":
        charlistDescription.innerHTML = "lightsaber like knife";
        selectAnimation("CAR", "mouseEnter");
        selectAnimation("AA", "mouseEnter");
        break;
      case "AAR":
        charlistDescription.innerHTML = "short gun for xptional marksmans, u know";
        selectAnimation("AAR", "mouseEnter");
        selectAnimation("CA+", "mouseEnter");
        selectAnimation("CA", "mouseEnter");
        break;
      case "energetic":
        charlistDescription.innerHTML = "a lot of energy in this legs and mind. and above legs also.";
        break;
      case "sanchin":
        charlistDescription.innerHTML = "ancient samurai breathing technique, that heals your mental health (smoking doesn't by the way).";
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

  if (action == "mouseLeave") {
    for (i = 1; i < moveList.length; i++) {
      if (charlistItems[i] != undefined) {
        charlistItems[i].style.fontWeight = 100;
      }
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
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + hp;
  resourcesUI.coins.innerHTML = "@" + resources.coins;
  rollResourcesUI.biohazard.innerHTML = "biohazard: " + rollResources.biohazard;
  rollResourcesUI.deadbones = document.getElementById("deadbones"); rollResourcesUI.deadbones.innerHTML = "deadbones: " + rollResources.deadbones;
  document.getElementById("progress-bar").innerHTML = encounterID + "/" + encounterList.length;

  for (i = 0; i < 3; i++) {
    document.getElementById("REQcharacter-" + i).innerHTML = document.getElementById("character-" + i).innerHTML;
  }
}

function returnMoveColor(move) {
  switch (move) {
    case "AA":
      return "purple";
    case "CA":
      return "red";
    case "CA+":
      return "darkred";
  }
}

/*genes*/
function genetics(gene, stage) { //oop genes
  if (stage == "pre") {
    switch(gene) {
      case "energetic":
        diceValues[1] += 1;
        moveSlots[1].innerHTML = diceValues[1] + "*";
        break;
    }
  }
  else if (stage == "post") {
    switch(gene) {
      case "sanchin":
        hp += 1;
        break;
    }
  }
}

function geneIcons(gene) {
  switch(gene) {
    case "energetic":
      return "⚡";
      break;
    case "sanchin":
      return "🀀";
      break;
  }
}

/*misc*/
function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function chance(min, max) {
  let ran = random(0, 100);
  console.log(ran + " - seed");
  let check = max;

  while (true) {
  console.log ((1 / check) * 100 + " for number " + check);
    if ((1 / check) * 100 >= ran) {
      return check;
    }
    else {
      check--;
    }
  }
}
