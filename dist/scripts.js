/*database*/
var sousid = 
{
  name: "sousid",
  move: "BD",
  image: "#",
  basehp: 8,
  hp: 8,
  value: 0.5,
  rollResources: 
  {
    biohazard: 4,
    deadbones: 0
  }
}

var vachta = 
{
  name: "vachta",
  move: "CC",
  image: "&",
  basehp: 6,
  hp: 6,
  value: 0.75,
  rollResources: 
  {
    biohazard: 0,
    deadbones: 5
  }
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
var currentEncounter = {}; 
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
var overHP = 0;
var effects = {
  shield: 0,
  hothand: 0,
  curse: 0,
  spirit: 0
}
var score = 0;
var turnsLeft = 16;
var genesQuat = 0;

/*lists*/
var moveList = [""]
var gunList= [""]
var encounterList = [];
var possibleEncounters = [sousid, sousid, vachta];
var genesList = [];
var buildingList = ["", "HR", "REQ"];
var charList = [];
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
  BAB: ["BD", "BD", "BD", "BD", "ID"], 
  PUN: ["CB", "CB", "JB"]
}

var cookies = {};

/*char generator*/
const  characterGenerator = {
  returnRandomName() {
    let nameList = ['alisa', 'hanna', 'maksim', 'mark', 'misha', 'anna', 'sofia', 'vika', 
      'karolina', 'julia', 'kuba', 'jan', 'toma', 'matyas', 'adam', 'filip', 'vojtech', 
      'luka', 'martin', 'mati', 'mia', 'lenna', 'marta', 'oskar', 'seba', 'hugo', 'rob', 'david', 'aaron', 
      'lucija', 'nika', 'rita', 'marta', 'ana', 'dora', 'jakov', 'ivan', 'roko', 'petar', 'fran', 'josip', 
      'zoe', 'boglarka', 'lili', 'levente', 'dominik', 'noel', 'marcell', 'zlatan', 'kamile', 'gabi', 'patricija', 
      'benas', 'dom', 'herkus', 'paula', 'dari', 'karl', 'kirilo', 'nastia', 'anastasi', 'eva', 'evelina', 
      'bodia', 'bogdan', 'damian', 'artiom', 'ion', 'jana', 'mila', 'bisera', 'sara', 'jovana', 'miha', 'petar', 
      'petro', 'pit', 'stefan', 'zuza', 'pola', 'antoni', 'antek', 'aleksander', 'stanislauw', 'szimek', 
      'martin', 'riszard', 'ajda', 'lana', 'nik', 'liam', 'tim', 'lovro', 'zhan', 'ola', 'yeva', 'artem', 
      'dmytro', 'dimitri', 'dania', 'andre', 'andriy', 'nikol', 'yoana', 'dragana', 'gabriela', 'simona', 
      'simon', 'georgi', 'kaloyan', 'boris', 'teodor', 'mariami', 'nino', 'barbare', 'nutsa', 'sesili', 
      'aylin', 'medina', 'asilim', 'aysa', 'amina', 'tomyris', 'aisultan', 'nurislam', 'aldiyar', 'amir', 
      'alinur', 'ali', 'omar', 'ramazan', 'muhammed'];
    return nameList[random(0, nameList.length)];
  },

  returnGun(type) { 
    if (type == "biohazard") {
      let list = ["BAB"];
      return list[random(0, list.length)];
    }
    else if (type = "deadbones") {
      let list = ["PUN"];
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
    if (type == "biohazard") { //3 empty, 2 energetic, 1 egalite
      let list = ["empty", "empty", "energetic", 'energetic']  //rewrite like this { empty: 99, energetic: 1 } out of 100
      return list[random(0, list.length)];
    }
    else if (type == "deadbones") {
      let list = ["empty", "empty", "empty", "sanchin", 'sanchin', 'energetic', 'IME', 'IME', 'egalite'];
      return list[random(0, list.length)];
    }
  }
}


/*onload*/ //TODO cash current state
window.onload = function() {  
  encounterList = generateEncounters(12);
  encounterHPbar = document.getElementById("encounter-healthbar");
  healthbar = document.getElementById("healthbar");
  encounterHUD.image = document.getElementById("encounter-pfp");
  encounterHUD.name = document.getElementById("encounter-name");
  charlistDescription = document.getElementById("info");
  buildingHR = document.getElementById("HR-building");
  buildingREQ = document.getElementById("REQ-building");
  bigInfo = document.getElementById("biginfobox");
  rollREQbutton =  document.getElementById("roll-REQ");
  buildingItems.length = 10;
  buildingList.length = 10;
  currentEncounter = encounterList[encounterID];
  currentEncounter.hp = Math.floor(currentEncounter.basehp + diffuclty * 3);
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  encounterHUD.image.innerHTML = currentEncounter.image;
  encounterHUD.name.innerHTML = currentEncounter.name;
  currentEncounter.hp = Math.floor(currentEncounter.basehp + diffuclty / 10);
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  resourcesUI.coins = document.getElementById('coins'); resourcesUI.coins.innerHTML = "@" + resources.coins;
  rollResourcesUI.biohazard = document.getElementById("biohazard"); rollResourcesUI.biohazard.innerHTML = "biohazard: " + rollResources.biohazard;
  rollResourcesUI.deadbones = document.getElementById("deadbones"); rollResourcesUI.deadbones.innerHTML = "deadbones: " + rollResources.deadbones;
  damageDealtUI = document.getElementById("damage-dealt");
  damageReceivedUI = document.getElementById("damage-received");
  var cookie = document.cookie.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
  cookies = cookie;
  resources.coins = parseInt(cookies.coins);
  rollResources.biohazard = parseInt(cookies.roll_biohazard);
  rollResources.deadbones = parseInt(cookies.roll_deadbones);
  if (atob(cookies.char1) != 'undefined') { charList[0] = JSON.parse(atob(cookies.char1)); } else { charList[0] = ""; }
  if (atob(cookies.char2) != 'undefined') { charList[1] = JSON.parse(atob(cookies.char2)); } else { charList[1] = ""; }
  if (atob(cookies.char3) != 'undefined') { charList[2] = JSON.parse(atob(cookies.char3)); } else { charList[2] = ""; }

  if (atob(cookies.char1) != '""') { 
    charList[0] = JSON.parse(atob(cookies.char1)); 
    let itemHR = document.getElementById("character-0"); 
    itemHR.innerHTML = charList[0].name.substring(0, 1).toUpperCase();
    itemHR.title = charList[0].name;
  } 
  else { 
    charList[0] = ""; 
  }

  if (atob(cookies.char2) != '""') { 
    charList[1] = JSON.parse(atob(cookies.char2)); 
    let itemHR = document.getElementById("character-1"); 
    itemHR.innerHTML = charList[1].name.substring(0, 1).toUpperCase();
    itemHR.title = charList[1].name;
  } 
  else { 
    charList[1] = ""; 
  }

  if (atob(cookies.char3) != '""') { 
    charList[2] = JSON.parse(atob(cookies.char3)); 
    let itemHR = document.getElementById("character-2"); 
    itemHR.innerHTML = charList[2].name.substring(0, 1).toUpperCase();
    itemHR.title = charList[2].name;
  } 
  else { 
    charList[2] = ""; 
  }

  updateUI();
  releaseInfo();
  
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
   resources.coins += parseInt(Math.floor(currentEncounter.value + diffuclty));
   currentEncounter = encounterList[encounterID];
   diffuclty++;
   encounterID++
   updateUI();
   currentEncounter.hp = Math.floor(currentEncounter.basehp + diffuclty * 3);
   encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
   encounterHUD.image.innerHTML = currentEncounter.image;
   encounterHUD.name.innerHTML = currentEncounter.name;
  }
  else { win(); }
}

function win() {
  updateUI();
  score += 2000;
  let text = document.getElementById("big-text");
  text.classList.toggle("hidden");
  let scr = finalScore();
  text.innerHTML = `<span>you won</span> <br>
  <span class="text-lg">final score: ` + scr[0] + " " + `[` + scr[1] + `]`+ `</span>`;
  goDungeon();
}

function lost() {
  let text = document.getElementById("big-text");
  text.classList.toggle("dark");
  text.classList.toggle("hidden");
  let scr = finalScore();
  effects.hothand = 0;
  effects.curse = 0;
  effects.shield = 0;4
  if (resources.coins < 50) { resources.coins = Math.floor(resources.coins / 2); } else { resources.coins -= 40; }
  text.innerHTML = `<span>you lost</span> <br>
  <span class="text-lg">final score: ` + scr[0] + " " + `[` + scr[1] + `]`+ `</span>`;
  goDungeon();
  encounterID = 1;
  diffuculty = 1;
  char = "";
  charList[charID] = "";
  let item = document.getElementById("character-" + charID);
  item.innerHTML = ""; item.removeAttribute("title");
  charID = -1;
  if (resources.coins < 1) { resources.coins = 1; }
  turnOffMoveUI();
  updateUI();
}

function retreat() {
  let text = document.getElementById("big-text");
  text.classList.toggle("hidden");
  text.innerHTML = `you've retreated`;
  goDungeon();  
  updateUI();
  char.hp = hp;
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
  slot.style.backgroundColor = returnMoveColor(moveList[index]);
  slot.style.color = "white";
}

function removeMove(id) {
  if (moves[id] != null) {
    moves[id] = null;
    let slot = document.getElementById("move-" + id);
    slot.style.backgroundColor = "white";
    slot.style.color = "#4B5563";
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
  effect("pre");
  encounterMove(); //TODO await/async implementation
  turnEnd();
  diceRoller();

  for (i = 1; i < genesQuat; i++) {
    genetics(genes[i], "pre");
    console.log(i);
  }
}

function diceRoller() {
  for (i = 1; i < diceValues.length; i++) {
    diceValues[i] = diceRoll();
    moveSlots[i].innerHTML = diceValues[i];
  }
}

function diceRoll() {  // 21 = 6; 19,20 = 5; 16,17,18 = 4; 12,13,14,15 = 3; 7,8,9,10,11 = 2; 1,2,3,4,5,6 = 1
  var seed = random(1, 21);

  if (seed <= 7) {
    return 1;
  }
  
  if (seed >= 8 && seed < 12) {
    return 2;
  }

  if (seed >= 12 && seed < 16) {
    return 3;
  }

  if (seed >= 16 && seed < 19) {
    return 4;
  }

  if (seed >= 19 && seed < 21) {
    return 5;
  }

  if (seed == 21) {
    return 6;
  }
}

function characterChoose(Char, mode, id) {
    if (!inDungeon && mode != "preview" && charList[id] != undefined && charList[id] != "" && char != Char) {
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
          else if (genes[i] == "empty" || genes[i] == null) {
            charlistGenes[i].innerHTML = "";
          }
        }

        for (i = 1; i < genes.length; i++) {
          if (geneIcons(genes[i]) != charlistGenes[i].innerHTML && charlistGenes[i].innerHTML != undefined) {
            charlistGenes[i].innerHTML = "";
            charlistGenes[i].removeAttribute("title");
          }
        }

        for (i = 0; i < genes.length; i++) {  
          if (genes[i] != "empty" && genes[i] != null && genes[i] != "") {
            genesQuat++;
          }
        }

        genesQuat++;

        let hpPreview = document.getElementById("hp-preview");
        let namePreview = document.getElementById("name-preview");
        hp = char.hp;
        if (namePreview.classList.contains('hidden')) {
          hpPreview.classList.toggle("hidden");
          namePreview.classList.toggle("hidden");
        }
        namePreview.innerHTML = `<span class="text-purple-400 font-semibold">your name:</span> ` + char.name + ``;
        hpPreview.innerHTML = `<span class="text-red-400 font-semibold">your hp:</span> ` + hp + ``;
      }

      if (mode == "preview") {
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

        for (i = 1; i < genesQuat; i++) {
          if (geneIcons(rolledChar.genes[i]) != charlistGenes[i].innerHTML && charlistGenes[i].innerHTML != undefined) {
            charlistGenes[i].innerHTML = "";
            charlistGenes[i].removeAttribute("title");
          }
        }

        document.getElementById("blocker-REQ").classList.toggle("hidden");
        rollREQbutton.classList.toggle("hidden");
        let hpPreview = document.getElementById("hp-preview");
        let namePreview = document.getElementById("name-preview");
        namePreview.innerHTML = `<span class="text-purple-400 font-semibold">your name:</span> ` + rolledChar.name + ``;
        hpPreview.innerHTML = `<span class="text-red-400 font-semibold">your hp:</span> ` + rolledChar.hp + ``;
        if (hpPreview.classList.contains("hidden")) {
          hpPreview.classList.toggle("hidden");
          namePreview.classList.toggle("hidden");
        }
        document.getElementById("delete-REQ").classList.toggle("hidden");
        document.getElementById("save-REQ").classList.toggle("hidden");
      }
}

function deleteREQ() {
  rollResources.biohazard += rolledChar.resources.biohazard;
  rollResources.deadbones += rolledChar.resources.deadbones;
  if (rollResources.biohazard < 0) { rollResources.biohazard = 0; } 
  else if (rollResources.deadbones < 0) { rollResources.deadbones = 0; }
  updateUI();
  rolledChar = {};
  document.getElementById("REQ-preview").innerHTML = "";
  document.getElementById("blocker-REQ").classList.toggle("hidden");
  rollREQbutton.classList.toggle("hidden");
  document.getElementById("delete-REQ").classList.toggle("hidden");
  document.getElementById("save-REQ").classList.toggle("hidden");
  isPreviewingREQ = false;
  turnOffMoveUI();
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
    rollResources.biohazard -= rolledChar.resources.biohazard * 10;
    rollResources.deadbones -= rolledChar.resources.deadbones * 10;
    if (rollResources.biohazard < 0) { rollResources.biohazard = 0; } 
    else if (rollResources.deadbones < 0) { rollResources.deadbones = 0; }
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
    updateUI();
}
}

function turnOffMoveUI() { //fix character choose when rolling
  document.getElementById("name-preview").classList.toggle("hidden");
  document.getElementById("hp-preview").classList.toggle("hidden");
  
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
  if (resources.coins > 0 && !inDungeon) {
    rolledChar = generateCharacter();
    resources.coins--;
    document.getElementById("roll-REQ");
    updateUI();
    document.getElementById("REQ-preview").innerHTML = rolledChar.name.substring(0, 1).toUpperCase();
    document.getElementById("REQ-preview").title = rolledChar.name.charAt(0).toLowerCase() + rolledChar.name.slice(1);  
    characterChoose(rolledChar, 'preview');
    if (document.getElementById("name-preview").classList.contains("hidden")) { //rewrite it
      document.getElementById("name-preview").classList.toggle("hidden");
      document.getElementById("hp-preview").classList.toggle("hidden");
    }
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
  let ran = random(0, 10);

  let n = chance(2, 5); gunlist.length = n;
  for (i = 1; i < n; i++) {
    let type = (ran > biohazard) ? "biohazard" : "deadbones";
    gunlist[i] = characterGenerator.returnGun(type);
  }

  for (i = 0; i < gunlist.length; i++) {
    for (a = 0; a < gunlist.length; a++) {
      if (gunlist[i] == gunlist[a] && a != i) {
        gunlist.splice(a, 1);
      }
    }
  }

  let type = (ran < biohazard) ? "biohazard" : "deadbones";
  if (type == "biohazard") { Resources.biohazard += gunlist.length - 1; }
  else if (type == "deadbones") { Resources.deadbones += gunlist.length - 1; }

  n = chance(2, 4);
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

  n = chance(2, 12); genelist.length = n;
  for (i = 1; i < n; i++) {
    let type = (ran < biohazard) ? "biohazard" : "deadbones";
    genelist[i] = characterGenerator.returnGene(type);
    if (type == "biohazard") { Resources.biohazard += 1; }
    else if (type == "deadbones") { Resources.deadbones += 1; }

    if (genelist[i] == "empty") {
      genelist.splice(a, 1);
      break;
    }
  }


  for (i = 1; i < 12; i++) {
    if (genelist[i] == null) {
      genelist[i] = "empty";
    }
  }

  Resources.biohazard = Math.floor(Resources.biohazard);
  Resources.deadbones = Math.floor(Resources.deadbones);
  console.log(Resources);

  let Hp = chance(7, 25);

  return { name: Name, moveList: movelist, gunList: gunlist, genes: genelist, resources: Resources, hp: Hp };
}

/*encounter side*/
function moveReceiver(move, receiver, index) { //automatic moves code
  if (receiver == currentEncounter) {
    let random;
    let counter;
    switch (move) {
      case "BD-move":
        random = diceValues[index] + effects.spirit;
        receiver.hp -= random;
        damageDealt += random;
        break;
      case "ID-move":
        effects.shield += genesQuat * 3;
        break;
      case "CB-move":
        effects.shield += diceValues[index];
        break;
      case "JB-move":
        let dmg = 1 + effects.hothand;
        if (diceValues[index] > 4 && diceValues[index] < 7) { effects.hothand++; }
        receiver.hp -= dmg;
        damageDealt += dmg;
        break;
      default:
        console.log("move receiver error");
    } 
  }
  else if (receiver == "player") { //change it
    let dmg = 0;
    switch (move) {
      case "BD":
        let ran = diceValues[random(2,5)];
        dmg = ran - overHP; 
        if (dmg < 0) { dmg = 0; }
        hp -= dmg;
        damageReceived += dmg;
        break;
      case "CC":
        dmg = (1 + effects.curse) - overHP; 
        if (dmg < 0) { dmg = 0; }
        hp -= dmg;
        damageReceived += dmg; 
        effects.curse += damageDealt;
        if (effects.curse > 0) { document.getElementById("player-effects").innerHTML += `<span title="curse" class="hover:cursor-help" onmouseover="description(event.target.title)" onmouseleave="description('standart'")>` + effects.curse + `👁️‍🗨️` + `<span>`}
        break;
      default:
        console.log("move receiver error");
    } 
  }
}

function reverse(n) {
  if (n == 6) { return 1 }
  else if (n == 5) { return 1; }
  else if (n == 4) { return 2; }
  else if (n == 3) { return 2; }
  else if (n == 2) { return 3; }
  else if (n == 1) { return 3; }
  else if (n >= 7) { return 0; }
}

function turnEnd() {
  encounterHPbar.innerHTML = "<span class='text-green-500'>enemie's hp: </span>" + currentEncounter.hp;
  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + hp;

  if (currentEncounter.hp <= 0) {
    rollResources.biohazard += currentEncounter.rollResources.biohazard;
    rollResources.deadbones += currentEncounter.rollResources.deadbones;
    updateUI();
    endEncounter();
  }

  score -= damageReceived * 20;
}

function endEncounter() {
  score += diffuclty * 100;
  effects.curse = 0;
  nextEncounter();
  effect("post");
}

function encounterMove() {
  moveReceiver(currentEncounter.move, "player");
  damageReceivedUI.innerHTML = "-" + damageReceived;
  effects.curse += damageReceived;
  turnsLeft--;
  document.getElementById("turns-left").innerHTML = turnsLeft;

  if (hp <= 0) 
    lost();

  if (turnsLeft < 0) 
    lost();
}

/*ui manipulation*/
function goDungeon(button) {
  score = 0;
  turnsLeft = 16;
  diffuclty = 1;
  effects.spirit = 0;
  effects.curse = 0;
  effects.shield = 0;
  effects.hothand = 0;
  damageReceived = 0; damageDealt = 0;
  damageReceivedUI.innerHTML = "-" + damageReceived;

  if (char != "" && char != undefined) {
    document.getElementById("player-effects").innerHTML = "";
    encounterID = 1;
    removeMove(1); removeMove(2); removeMove(3); removeMove(4);
    document.getElementById("blocker-REQ").classList.toggle("hidden");
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
    document.getElementById("blocker-HR").classList.toggle("hidden");

    if (!inDungeon) {
      encounterList = generateEncounters(12);
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
    
    hp = char.hp;
    diceRoller();

    for (let a = 1; a < genesQuat; a++) {
      genetics(genes[a], "pre");
    }

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

function description(id) { //automatic descriptions + enemie descriptions
  switch (id) {
      case "BD-move":
        charlistDescription.innerHTML = "<b>Bat Drive!</b><br> ultimate head smashing move <br>dmg: d6 + damage received.";
        break;
      case "JB-move":
        charlistDescription.innerHTML = "<b>JawBreak</b><br>straight jawbreak and out. <br>dmg: 1 + <span class='text-orange-400 font-bold'>hothand</span>.<br>receive +1🔥 for every 5 and 6";
        break;
      case "ID-move":
        charlistDescription.innerHTML = "<b>Iternal Drive</b><br> pull back and relax <br>+3 shield for every gene🧬 you have";
        break;
      case "CB-move":
        charlistDescription.innerHTML = "<b>Counter Block</b><br> push enemies back and thrive <br>effect: shield <d6>";
        break;
      case "BAB":
        charlistDescription.innerHTML = "<b>BASKETBALL BAT</b><br>bone crushing bonk stick <br> possible moves: BD";
        break;
      case "PUN":
        charlistDescription.innerHTML = "<b>BLOODY FISTS</b><br> bandaged fingers flying into monsters chests <br> possible moves: JawBreak, Counter Block";
        break;
      case "energetic":
        charlistDescription.innerHTML = "<b>energetic</b><br>a lot of energy in this legs and mind. and between legs also.";
        break;
      case "spirit":
        charlistDescription.innerHTML = "<b>spirit</b><br>if you believe enough, your damage becomes bigger.";
        break;
      case "egalite":
        charlistDescription.innerHTML = "<b>egalite</b><br>equality is the road to peace, right? <br> +1🎲 (including first) for every dice value";
        break;
      case "IME":
        charlistDescription.innerHTML = "<b>IME</b><br>can someone destroy a person in despair? <br> +1🧿 for every 1 point of damage received";
        break;
      case "sanchin":
        charlistDescription.innerHTML = "<b>sanchin</b><br>ancient samurai breathing technique, that heals your lungs.";
        break;
      case "sousid":
        charlistDescription.innerHTML = "<b>sousid</b><br>spider-like guy next door.<br>possible moves: Bat Drive!.";
        break;
      case "vachta":
        charlistDescription.innerHTML = "<b>vachta</b><br>old fat flying granny.<br>possible moves: Cussing Curse.";
        break;
      case "shield":
        charlistDescription.innerHTML = "<b>shield</b><br>pretty self-explanatory.";
        break;
      case "hothand":
        charlistDescription.innerHTML = "<b>hothand</b><br>additional damage for some moves, like JawBreak";
        break;  
      case "curse":
        charlistDescription.innerHTML = "<b>curse</b><br>gonna hurt when someone OLD attacks you";
        break;    
      case "coins":
        charlistDescription.innerHTML = "this is your coins, you can splash them";
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
  if (document.getElementById("blocker-HR").classList.contains("hidden")) { document.getElementById("blocker-HR").classList.toggle("hidden"); }

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
  if (rollResources.biohazard >= 100) { rollResources.biohazard = 99; }
  else if (rollResources.deadbones >= 100) { rollResources.deadbones = 90; }

  if (rollResources.biohazard < 0) { rollResources.biohazard = 0; } 
  else if (rollResources.deadbones < 0) { rollResources.deadbones = 0; }

  healthbar.innerHTML = "<span class='text-red-500'>your hp:</span> " + hp;
  document.getElementById("turns-left").innerHTML = turnsLeft;
  resourcesUI.coins.innerHTML = "@" + resources.coins;
  document.cookie = "coins=" + resources.coins;
  rollResourcesUI.biohazard.innerHTML = "biohazard: " + rollResources.biohazard;
  rollResourcesUI.deadbones = document.getElementById("deadbones"); rollResourcesUI.deadbones.innerHTML = "deadbones: " + rollResources.deadbones;
  document.cookie = "roll_biohazard=" + rollResources.biohazard;
  document.cookie = "roll_deadbones=" + rollResources.deadbones;
  document.getElementById("progress-bar").innerHTML = encounterID + "/" + encounterList.length;
  document.cookie = "char1=" + btoa(JSON.stringify(charList[0])); 
  document.cookie = "char2=" + btoa(JSON.stringify(charList[1])); 
  document.cookie = "char3=" + btoa(JSON.stringify(charList[2])); 

  for (i = 0; i < 3; i++) {
    document.getElementById("REQcharacter-" + i).innerHTML = document.getElementById("character-" + i).innerHTML;
  }
}

function returnMoveColor(move) {
  switch (move) {
    case "BD":
      return "purple";
    case "CA":
      return "red";
    case "CA+":
      return "darkred"
    case "ID":
      return "HotPink";
    case "CB":
      return "DarkSlateBlue";
    case "JB":
      return "ForestGreen";
  }
}

/*genes*/
function genetics(gene, stage) { //oop genes
  if (stage == "pre") {
    let ran = 1;
    let reserve = 0;

    switch(gene) {
      case "energetic":
        diceValues[1] += 1;
        moveSlots[1].innerHTML = diceValues[1] + "*";
        break;
      case 'egalite':
        ran = random(1, 4); 
        reserve = diceValues[ran] + 1;
        updateUI();

        a = 1;
        while (a <= 4) {
          diceValues[a] = reserve;
          moveSlots[a].innerHTML = diceValues[a];
          a++;
        }

        break;
      case 'IME':
        effects.spirit = damageReceived;
        console.log("IME");
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

function effect(mode) {
  if ("pre") {
    let div = document.getElementById("player-effects");
    overHP = 0;
    div.innerHTML = "";
    if (effects.hothand > 0) { div.innerHTML += `<span title="hothand" class="hover:cursor-help" onmouseover="description(event.target.title)" onmouseleave="description('standart'")>` + effects.hothand + `🔥` + `<span>`}
  }

  if ("post") {
    let div = document.getElementById("player-effects");
    overHP += effects.shield;
    if (effects.shield > 0) { div.innerHTML += `<span title="shield" class="hover:cursor-help" onmouseover="description(event.target.title)" onmouseleave="description('standart')">` + effects.shield + `🔰` + `<span>`; }
    if (genes.toString().includes("IME")) { console.log("spirit!"); div.innerHTML += `<span title="spirit" class="hover:cursor-help" onmouseover="description(event.target.title)" onmouseleave="description('standart'")>` + `🧿` + `<span>`}
    if (effects.shield > 0) { effects.shield -= 6; }
    if (effects.shield < 0) { effects.shield = 0; }
  }
}

function geneIcons(gene) {
  switch(gene) {
    case "energetic":
      return "⚡";
    case "sanchin":
      return "🀀";
    case 'egalite':
      return '🔗';
    case 'IME':
      return '🐙';
  }
}

/*misc*/
function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function frandom(min, max, pt) {
  return (Math.random() * (max - min) + min).toFixed(pt);
}

function chance(min, max) { //weird distribution
  let check = max;
  let ran = frandom(((1 / check) * 1000).toFixed(2) - 1, 100);

  while (true) {
    if (((1 / check) * 100).toFixed(2) >= ran) {
      if (check < min) {
        check = min;
      }
      
      return check;
    }
    else {
      check--;
    }
  }
}

function finalScore() {
  let idealScore = 0;
  let simDifficulty = 1;

  for (i = 1; i < encounterList.length; i++) {
    simDifficulty++; 
    idealScore += 100 * simDifficulty; 
  }

  idealScore += 4 * 150;
  score += turnsLeft * 150;
  idealScore += 2000;
  let percentage = Math.floor((score / idealScore) * 100);
  if (turnsLeft == 16) { percentage = 0; }
  console.log(percentage + "%" + " " + score + "/" + idealScore);

  if (percentage > 100) {
    return ["GOAT", score];
  }
  else if (percentage > 95) {
    return ["SS", score];
  }
  else if (percentage > 85) {
    return ["S", score];
  }
  else if (percentage > 75) {
    return ["A", score];
  }
  else if (percentage > 50) {
    return ["B", score];
  }
  else if (percentage >= 25) {
    return ["C", score];
  }
  else if (percentage < 25) {
    return ["F", score];
  }
}

function newSave(content) {
  var a = document.createElement("a");  
  a.href = window.URL.createObjectURL(new Blob([content], {type: "text/plain"}));
  let date = new Date();
  a.download = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + ".mw72";
  a.click(); 
}

function loadSave() {
  bigInfo.removeAttribute("onclick");
  bigInfo.innerHTML = "<input type='file' id='load-file' onchange='readSave(event)'>";
  bigInfo.classList.toggle("hidden");
}

function readSave(e) {
  const input = e.target;
  const reader = new FileReader();
  reader.onload = function(){
    let data = reader.result;
    data = data.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
    resources.coins = parseInt(data.coins);
    rollResources.biohazard = data.roll_biohazard;
    rollResources.deadbones = data.roll_deadbones;

    if (atob(data.char1) != '""') { 
      charList[0] = JSON.parse(atob(data.char1)); 
      let itemHR = document.getElementById("character-0"); 
      itemHR.innerHTML = charList[0].name.substring(0, 1).toUpperCase();
      itemHR.title = charList[0].name;
    } 
    else { 
      charList[0] = ""; 
      let itemHR = document.getElementById("character-0"); 
      itemHR.innerHTML = "";
      itemHR.title = ""; 
    }

    if (atob(data.char2) != '""') { 
      charList[1] = JSON.parse(atob(data.char2)); 
      let itemHR = document.getElementById("character-1"); 
      itemHR.innerHTML = charList[1].name.substring(0, 1).toUpperCase();
      itemHR.title = charList[1].name;
    } 
    else { 
      charList[1] = ""; 
      let itemHR = document.getElementById("character-1"); 
      itemHR.innerHTML = "";
      itemHR.title = ""; 
    }

    if (atob(data.char3) != '""') { 
      charList[2] = JSON.parse(atob(data.char3)); 
      let itemHR = document.getElementById("character-2"); 
      itemHR.innerHTML = charList[2].name.substring(0, 1).toUpperCase();
      itemHR.title = charList[2].name;
    } 
    else { 
      charList[2] = "";
      let itemHR = document.getElementById("character-2"); 
      itemHR.innerHTML = "";
      itemHR.title = ""; 
    }

    updateUI();
    bigInfo.setAttribute("onclick","hideMe(event.target)");
  };

  if (input.files[0]) {
    reader.readAsText(input.files[0]);
  }
}

function manual() {
  bigInfo.innerHTML = 
  `<video width="480" height="360" controls>
    <source src="public/tutor.mp4" type="video/mp4">
    <source src="public/tutor.webm" type="video/webm">
    unvalid format. checkout my yt: .
    </video>
    this's short manual to checkout before starting your journey. it will teach you to roll characters, start game and make moves.`;
  bigInfo.classList.toggle('hidden');
}

function releaseInfo() {
  if (cookies.patch_notes_checked != 1) {
    bigInfo.innerHTML = 
    `patch notes: <br>` +
    `v1. demo release!`;
    document.cookie = 'patch_notes_checked=1';
    bigInfo.classList.toggle('hidden');
  } 
}