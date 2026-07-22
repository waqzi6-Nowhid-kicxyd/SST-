const PLAYER_COLORS = [
  {name:"あか", value:"#ef6b63"},
  {name:"あお", value:"#4b9bdd"},
  {name:"きいろ", value:"#e7ad23"},
  {name:"みどり", value:"#68b46f"},
  {name:"むらさき", value:"#9a74d5"}
];

const TILE_TYPES = [
  "start",
  "intro","sst","move","event",
  "sst","intro","move","sst","event",
  "intro","move","sst","event","intro",
  "sst","move","event","sst","goal"
];

const TILE_ICONS = {
  start:"START", intro:"👋", sst:"💭", move:"🏃", event:"⭐", goal:"GOAL"
};

let state = {
  playerCount: 3,
  players: [],
  current: 0,
  busy: false,
  pendingTask: null,
  extraTurn: false,
  gameEnded: false,
  pendingRoll: null
};

const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const playerInputs = document.getElementById("playerInputs");
const board = document.getElementById("board");
const playerList = document.getElementById("playerList");
const turnBadge = document.getElementById("turnBadge");
const statusText = document.getElementById("statusText");
const diceBtn = document.getElementById("diceBtn");
const diceCube = document.getElementById("diceCube");
const diceLabel = document.getElementById("diceLabel");
const diceResultOverlay = document.getElementById("diceResultOverlay");
const diceResultCube = document.getElementById("diceResultCube");
const diceResultNumber = document.getElementById("diceResultNumber");
const moveBtn = document.getElementById("moveBtn");
const shuffleOverlay = document.getElementById("shuffleOverlay");
const shuffleTitle = document.getElementById("shuffleTitle");
const shuffleCards = [...document.querySelectorAll(".shuffle-card")];
const taskOverlay = document.getElementById("taskOverlay");
const taskGenre = document.getElementById("taskGenre");
const taskImage = document.getElementById("taskImage");
const taskEmoji = document.getElementById("taskEmoji");
const taskTitle = document.getElementById("taskTitle");
const taskText = document.getElementById("taskText");
const goalOverlay = document.getElementById("goalOverlay");
const goalTitle = document.getElementById("goalTitle");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function renderPlayerInputs(){
  playerInputs.innerHTML = "";
  for(let i=0;i<state.playerCount;i++){
    const row = document.createElement("div");
    row.className = "player-input-row";
    row.innerHTML = `
      <div class="player-color" style="background:${PLAYER_COLORS[i].value}">
        ${PLAYER_COLORS[i].name}
      </div>
      <input maxlength="8" value="${PLAYER_COLORS[i].name}" aria-label="${i+1}人目の愛称">
    `;
    playerInputs.appendChild(row);
  }
}

document.querySelectorAll(".count-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".count-btn").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    state.playerCount = Number(btn.dataset.count);
    renderPlayerInputs();
  });
});

document.getElementById("startBtn").addEventListener("click",()=>{
  const inputs = [...playerInputs.querySelectorAll("input")];
  state.players = inputs.map((input,i)=>({
    name: input.value.trim() || PLAYER_COLORS[i].name,
    color: PLAYER_COLORS[i].value,
    position: 0,
    skip: false,
    finished: false
  }));
  state.current = 0;
  state.gameEnded = false;
  state.pendingRoll = null;
  setupScreen.classList.remove("active");
  gameScreen.classList.add("active");
  renderAll();
});

function getPathGridIndex(step){
  // 5列×4行を蛇行するように配置
  const row = Math.floor(step / 5);
  const colInRow = step % 5;
  const col = row % 2 === 0 ? colInRow : 4 - colInRow;
  return row * 5 + col;
}

function renderBoard(){
  board.innerHTML = "";
  const cells = new Array(20);
  TILE_TYPES.forEach((type, step)=>{
    const tile = document.createElement("div");
    tile.className = `tile ${type}`;
    tile.dataset.step = String(step);
    tile.innerHTML = `
      <span class="tile-number">${step===0?"":step}</span>
      <span>${TILE_ICONS[type]}</span>
      <div class="pawns"></div>
    `;
    cells[getPathGridIndex(step)] = tile;
  });
  cells.forEach(cell=>board.appendChild(cell));

  state.players.forEach((player,index)=>{
    const target = board.querySelector(`[data-step="${player.position}"] .pawns`);
    const pawn = document.createElement("div");
    pawn.className = "pawn" + (index===state.current ? " active":"");
    pawn.style.background = player.color;
    pawn.textContent = player.name.slice(0,1);
    pawn.title = player.name;
    target.appendChild(pawn);
  });
}

function renderPlayers(){
  playerList.innerHTML = "";
  state.players.forEach((p,i)=>{
    const row = document.createElement("div");
    row.className = "player-row" + (i===state.current ? " active":"");
    row.innerHTML = `
      <div class="player-row-top">
        <span class="dot" style="background:${p.color}"></span>
        <span>${p.name}</span>
      </div>
      <div class="player-meta">${p.position===19 ? "ゴール！" : `${p.position}マス`} ${p.skip ? "・つぎはおやすみ" : ""}</div>
    `;
    playerList.appendChild(row);
  });
}

function renderTurn(){
  const p = state.players[state.current];
  turnBadge.textContent = `▶ ${p.name}さん`;
  turnBadge.style.background = p.color;
}

function renderAll(){
  renderBoard();
  renderPlayers();
  renderTurn();
  diceBtn.disabled = state.busy || state.gameEnded;
}

async function rollDice(){
  if(state.busy || state.gameEnded) return;
  state.busy = true;
  diceBtn.disabled = true;
  statusText.textContent = "サイコロを ふっているよ…";
  diceLabel.textContent = "ころころ…";

  diceCube.classList.remove("show-1","show-2","show-3","show-4","show-5","show-6");
  diceCube.classList.remove("rolling");
  void diceCube.offsetWidth;
  diceCube.classList.add("rolling");

  const roll = Math.floor(Math.random()*6)+1;
  state.pendingRoll = roll;

  await sleep(1350);

  diceCube.classList.remove("rolling");
  diceCube.classList.add(`show-${roll}`);
  diceLabel.textContent = `${roll}！`;
  statusText.textContent = "いくつ出たか かんがえてみよう";

  diceResultCube.classList.remove("show-1","show-2","show-3","show-4","show-5","show-6");
  diceResultCube.classList.add(`show-${roll}`);
  diceResultNumber.textContent = roll;

  diceResultOverlay.classList.add("show");
  diceResultOverlay.setAttribute("aria-hidden","false");
}
async function confirmMove(){
  if(!state.pendingRoll) return;

  const roll = state.pendingRoll;
  state.pendingRoll = null;
  moveBtn.disabled = true;
  diceResultOverlay.classList.remove("show");
  diceResultOverlay.setAttribute("aria-hidden","true");

  statusText.textContent = `${roll}マス すすむよ`;
  await moveCurrentPlayer(roll);

  const p = state.players[state.current];
  if(p.position >= 19){
    p.position = 19;
    p.finished = true;
    renderAll();
    await sleep(350);
    goalTitle.textContent = `${p.name}さん ゴール！`;
    goalOverlay.classList.add("show");
    goalOverlay.setAttribute("aria-hidden","false");
    state.busy = false;
    moveBtn.disabled = false;
    return;
  }

  const type = TILE_TYPES[p.position];
  await showShuffle(type);
  showTask(type);
  moveBtn.disabled = false;
}

async function moveCurrentPlayer(steps){
  const p = state.players[state.current];
  for(let i=0;i<steps;i++){
    if(p.position >= 19) break;
    p.position++;
    renderBoard();
    renderPlayers();
    await sleep(330);
  }
}

async function showShuffle(type){
  const labels = {intro:"じこしょうかい",sst:"SSTもんだい",move:"うんどう",event:"イベント"};
  shuffleTitle.textContent = `${labels[type]}カードを えらんでいるよ…`;
  shuffleOverlay.classList.add("show");
  shuffleOverlay.setAttribute("aria-hidden","false");

  for(let round=0;round<5;round++){
    shuffleCards.forEach((card,i)=>{
      card.classList.remove("shuffle-a","shuffle-b");
      void card.offsetWidth;
      card.classList.add((round+i)%2===0 ? "shuffle-a":"shuffle-b");
    });
    await sleep(360);
  }
  await sleep(220);
  shuffleOverlay.classList.remove("show");
  shuffleOverlay.setAttribute("aria-hidden","true");
}

function randomTask(type){
  const fallback = {
    intro: { title:"じこしょうかい", text:"すきなものを ひとつ おしえてね。", emoji:"👋", image:"" },
    sst: { title:"こんなとき どうする？", text:"せんせいと いっしょに かんがえよう。", emoji:"💭", image:"" },
    move: { title:"そのばで ジャンプ！", text:"3かい ジャンプしよう。", emoji:"🦘", image:"" },
    event: { title:"みんなで はくしゅ", text:"みんなで はくしゅしよう。", emoji:"👏", image:"", effect:"none" }
  };

  const source = window.SST_TASKS;
  if(!source || !Array.isArray(source[type]) || source[type].length === 0){
    console.warn("questions.js が読み込めていないか、問題が空です:", type);
    return fallback[type];
  }

  const list = source[type];
  return list[Math.floor(Math.random()*list.length)];
}

function showTask(type){
  try{
    const task = randomTask(type);
    state.pendingTask = {type, task};

  const genreInfo = {
    intro:["自己紹介","#aadaf6","👋"],
    sst:["SST問題","#f7b7c8","💭"],
    move:["運動","#bfe39b","🏃"],
    event:["イベント","#ffd67a","⭐"]
  };
  const [label,color,icon] = genreInfo[type];
  taskGenre.textContent = `${icon} ${label}`;
  taskGenre.style.background = color;
  taskTitle.textContent = task.title;
  taskText.textContent = task.text;

  if(task.image){
    taskImage.src = task.image;
    taskImage.hidden = false;
    taskEmoji.hidden = true;
  }else{
    taskImage.hidden = true;
    taskEmoji.hidden = false;
    taskEmoji.textContent = task.emoji || icon;
  }

    taskOverlay.classList.add("show");
    taskOverlay.setAttribute("aria-hidden","false");
    statusText.textContent = "おだいに ちょうせん！";
  }catch(error){
    console.error(error);
    state.pendingTask = {
      type:"event",
      task:{title:"みんなで はくしゅ", text:"みんなで はくしゅしよう。", emoji:"👏", image:"", effect:"none"}
    };
    taskGenre.textContent = "⭐ イベント";
    taskGenre.style.background = "#ffd67a";
    taskImage.hidden = true;
    taskEmoji.hidden = false;
    taskEmoji.textContent = "👏";
    taskTitle.textContent = "みんなで はくしゅ";
    taskText.textContent = "みんなで はくしゅしよう。";
    taskOverlay.classList.add("show");
    taskOverlay.setAttribute("aria-hidden","false");
    statusText.textContent = "おだいに ちょうせん！";
  }
}

async function applyTaskEffect(){
  const pending = state.pendingTask;
  if(!pending || pending.type !== "event") return;
  const effect = pending.task.effect;
  const p = state.players[state.current];

  if(effect === "skip") p.skip = true;
  if(effect === "back2"){
    p.position = Math.max(0,p.position-2);
    renderAll();
    await sleep(350);
  }
  if(effect === "forward1"){
    p.position = Math.min(19,p.position+1);
    renderAll();
    await sleep(350);
    if(p.position===19){
      p.finished = true;
      goalTitle.textContent = `${p.name}さん ゴール！`;
      goalOverlay.classList.add("show");
      goalOverlay.setAttribute("aria-hidden","false");
    }
  }
  if(effect === "again") state.extraTurn = true;
}

async function closeTask(){
  taskOverlay.classList.remove("show");
  taskOverlay.setAttribute("aria-hidden","true");
  await applyTaskEffect();

  if(goalOverlay.classList.contains("show")){
    state.busy = false;
    return;
  }

  if(state.extraTurn){
    state.extraTurn = false;
    state.busy = false;
    diceLabel.textContent = "もういちど ふる";
    statusText.textContent = "もういちど サイコロ！";
    renderAll();
    return;
  }

  goToNextPlayer();
}

function goToNextPlayer(){
  let tries = 0;
  do{
    state.current = (state.current + 1) % state.players.length;
    tries++;
    const p = state.players[state.current];
    if(p.skip){
      p.skip = false;
      statusText.textContent = `${p.name}さんは 1かい おやすみ`;
      renderAll();
      continue;
    }
    break;
  }while(tries <= state.players.length);

  state.pendingTask = null;
  state.busy = false;
  diceLabel.textContent = "サイコロをふる";
  diceCube.classList.remove("show-1","show-2","show-3","show-4","show-5","show-6");
  diceCube.classList.add("show-5");
  statusText.textContent = "サイコロをふってね";
  renderAll();
}

diceBtn.addEventListener("click",rollDice);
moveBtn.addEventListener("click",confirmMove);
document.getElementById("closeTaskBtn").addEventListener("click",closeTask);

document.getElementById("goalCloseBtn").addEventListener("click",()=>{
  goalOverlay.classList.remove("show");
  goalOverlay.setAttribute("aria-hidden","true");
  goToNextPlayer();
});

document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("最初の画面にもどりますか？")){
    location.reload();
  }
});

document.getElementById("fullscreenBtn").addEventListener("click",async()=>{
  try{
    if(!document.fullscreenElement){
      await document.documentElement.requestFullscreen();
    }else{
      await document.exitFullscreen();
    }
  }catch(e){}
});

renderPlayerInputs();
