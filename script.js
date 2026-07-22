const DEFAULT_NAMES=['あか','あお','きいろ','みどり','むらさき'];
const COLORS=['red','blue','yellow','green','purple'];
const CATEGORY_META={intro:{label:'じこしょうかい',icon:'😊'},challenge:{label:'チャレンジ',icon:'⭐'},sst:{label:'SST',icon:'💬'},event:{label:'イベント',icon:'🎁'}};
const categoryPattern=['intro','challenge','sst','intro','event','challenge','sst','intro','challenge','sst','event','intro','challenge','sst','intro','challenge','event','sst','challenge','event'];
const SPACE_POINTS=[
  [27,21],[39,21],[51,21],[64,21],[76,21],
  [82,39],[70,39],[59,39],[47,39],[35,39],
  [22,57],[34,57],[46,57],[57,57],[69,57],
  [77,75],[65,75],[52,75],[40,75],[27,75]
];
const MOVE_DELAY=430;
const SHUFFLE_DELAY=3500;

let players=[];
let current=0;
let pendingRoll=0;
let pendingEvent=null;
let questionOpen=false;
let shuffleTimer=null;
let isMoving=false;

const board=document.getElementById('board');
const playersList=document.getElementById('playersList');
const turnLabel=document.getElementById('turnLabel');
const remainingLabel=document.getElementById('remainingLabel');
const diceScreen=document.getElementById('diceScreen');
const questionScreen=document.getElementById('questionScreen');
const rollBtn=document.getElementById('rollBtn');
const nextTurnBtn=document.getElementById('nextTurnBtn');

function normalizeName(value){
  return value.replace(/[ァ-ヶ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0x60)).replace(/[^ぁ-ゖー]/g,'').slice(0,8);
}

function sleep(ms){
  return new Promise(resolve=>setTimeout(resolve,ms));
}

function newPlayers(count=3,names=[]){
  players=Array.from({length:count},(_,i)=>({name:names[i]||DEFAULT_NAMES[i],color:COLORS[i],pos:0,skip:false}));
  current=0;
  renderAll();
  setTurnControls(true,false);
}

function renderBoard(){
  board.innerHTML='';
  SPACE_POINTS.forEach(([x,y],index)=>{
    const num=index+1;
    const category=categoryPattern[num-1];
    const cell=document.createElement('div');
    cell.className=`space ${category}${num%5===0?' milestone':''}${num===20?' goal-space':''}`;
    cell.textContent=num;
    cell.style.left=`${x}%`;
    cell.style.top=`${y}%`;
    cell.dataset.space=num;
    board.appendChild(cell);
  });
  renderPawns();
}

function createPawn(p,i){
  const pawn=document.createElement('div');
  pawn.className=`pawn ${p.color}`;
  pawn.textContent=i+1;
  pawn.title=p.name;
  return pawn;
}

function renderPawns(){
  document.querySelectorAll('.pawn-stack,.start-stack').forEach(el=>el.remove());
  const groups={};
  players.forEach((p,i)=>{
    const key=p.pos;
    groups[key]??=[];
    groups[key].push({p,i});
  });

  Object.entries(groups).forEach(([pos,list])=>{
    const numericPos=Number(pos);
    const stack=document.createElement('div');

    if(numericPos===0){
      stack.className='start-stack';
      list.forEach(({p,i})=>stack.appendChild(createPawn(p,i)));
      board.appendChild(stack);
      return;
    }

    const anchor=document.querySelector(`[data-space="${numericPos}"]`);
    if(!anchor)return;
    stack.className='pawn-stack';
    list.forEach(({p,i})=>stack.appendChild(createPawn(p,i)));
    anchor.appendChild(stack);
  });
}

function renderPlayers(){
  playersList.innerHTML='';
  players.forEach((p,i)=>{
    const row=document.createElement('div');
    row.className=`player-row${i===current?' current':''}`;
    row.innerHTML=`<span class="player-dot" style="background:${colorValue(p.color)}"></span><span>${p.name}${p.skip?' <span class="skip-mark">（おやすみ）</span>':''}</span><span class="player-pos">${p.pos===20?'ゴール！':p.pos+'マス'}</span>`;
    playersList.appendChild(row);
  });
  const p=players[current];
  turnLabel.textContent=`${p.name}さんの ばん`;
  remainingLabel.textContent=Math.max(0,20-p.pos);
}

function colorValue(c){
  return {red:'#e25e5e',blue:'#5797dc',yellow:'#dcae39',green:'#60a96b',purple:'#8c70bd'}[c];
}

function renderAll(){
  renderBoard();
  renderPlayers();
}

function setTurnControls(canRoll,canNext){
  rollBtn.disabled=!canRoll;
  nextTurnBtn.disabled=!canNext;
}

function showOverlay(el){
  el.classList.add('show');
  el.setAttribute('aria-hidden','false');
}

function hideOverlay(el){
  el.classList.remove('show');
  el.setAttribute('aria-hidden','true');
}

function face(n){
  document.querySelectorAll('.face').forEach((f,i)=>f.classList.toggle('active',i===n-1));
}

function rollDice(){
  if(isMoving)return;
  const p=players[current];
  setTurnControls(false,false);

  if(p.skip){
    p.skip=false;
    openQuestion('event',{text:'1かい おやすみでした',hint:'つぎのひとへ すすみます',effect:'skipDone'});
    return;
  }

  showOverlay(diceScreen);
  document.getElementById('moveBtn').hidden=true;
  document.getElementById('diceResult').textContent='';
  const cube=document.getElementById('diceCube');
  cube.classList.add('rolling');

  let ticks=0;
  const timer=setInterval(()=>{
    face(1+Math.floor(Math.random()*6));
    ticks++;
    if(ticks>14){
      clearInterval(timer);
      pendingRoll=1+Math.floor(Math.random()*6);
      face(pendingRoll);
      cube.classList.remove('rolling');
      document.getElementById('diceResult').textContent='すすめる かずが きまったよ！';
      document.getElementById('moveBtn').hidden=false;
    }
  },100);
}

async function animateTo(player,target){
  isMoving=true;
  setTurnControls(false,false);

  while(player.pos<target){
    player.pos++;
    renderAll();
    await sleep(MOVE_DELAY);
  }

  while(player.pos>target){
    player.pos--;
    renderAll();
    await sleep(MOVE_DELAY);
  }

  isMoving=false;
}

async function moveCurrent(){
  if(isMoving)return;
  hideOverlay(diceScreen);
  const p=players[current];
  const target=Math.min(20,p.pos+pendingRoll);
  await animateTo(p,target);

  if(p.pos>=20){
    openQuestion('event',{text:'ゴール！ おめでとう！',hint:'みんなで はくしゅを しよう',effect:'goal'});
    return;
  }

  const cat=categoryPattern[p.pos-1];
  const list=QUESTIONS[cat];
  let item=list[Math.floor(Math.random()*list.length)];
  if(typeof item==='string')item={text:item};
  openQuestion(cat,item);
}

function openQuestion(cat,item){
  questionOpen=true;
  pendingEvent=item.effect||null;
  const meta=CATEGORY_META[cat];
  const shuffleStage=document.getElementById('shuffleStage');
  const questionCard=document.getElementById('questionCard');

  shuffleStage.hidden=false;
  questionCard.hidden=true;
  showOverlay(questionScreen);
  clearTimeout(shuffleTimer);

  shuffleTimer=setTimeout(()=>{
    document.getElementById('questionCategory').textContent=meta.label;
    document.getElementById('questionCategory').style.background={intro:'#cfe7f7',challenge:'#dcefd7',sst:'#f5d6df',event:'#f8e6a8'}[cat];
    document.getElementById('questionIcon').textContent=meta.icon;
    document.getElementById('questionText').textContent=item.text;
    document.getElementById('questionHint').textContent=item.hint||'いろいろな こたえで OK！';
    shuffleStage.hidden=true;
    questionCard.hidden=false;
  },SHUFFLE_DELAY);
}

async function finishQuestion(){
  if(isMoving)return;
  const p=players[current];
  const event=pendingEvent;

  hideOverlay(questionScreen);
  pendingEvent=null;
  questionOpen=false;
  setTurnControls(false,false);

  if(event==='back2'){
    await animateTo(p,Math.max(0,p.pos-2));
  }else if(event==='forward1'){
    await animateTo(p,Math.min(20,p.pos+1));
  }else if(event==='skip'){
    p.skip=true;
  }

  renderAll();

  if(event==='again'){
    setTurnControls(true,false);
  }else{
    setTurnControls(false,true);
  }

  if(event==='skipDone'){
    setTimeout(nextTurn,100);
  }
}

function nextTurn(){
  if(isMoving||players.every(p=>p.pos>=20))return;
  do{
    current=(current+1)%players.length;
  }while(players[current].pos>=20&&players.some(p=>p.pos<20));
  renderAll();
  setTurnControls(true,false);
}

function buildNameInputs(){
  const count=+document.getElementById('playerCount').value;
  const wrap=document.getElementById('nameInputs');
  wrap.innerHTML='';

  for(let i=0;i<count;i++){
    const label=document.createElement('label');
    label.textContent=`${i+1}にんめ`;
    const input=document.createElement('input');
    input.maxLength=8;
    input.placeholder=DEFAULT_NAMES[i];
    input.value=players[i]?.name&&!DEFAULT_NAMES.includes(players[i].name)?players[i].name:'';
    input.addEventListener('input',()=>{input.value=normalizeName(input.value)});
    label.appendChild(input);
    wrap.appendChild(label);
  }
}

rollBtn.addEventListener('click',rollDice);
document.getElementById('moveBtn').addEventListener('click',moveCurrent);
document.getElementById('questionDoneBtn').addEventListener('click',finishQuestion);
nextTurnBtn.addEventListener('click',nextTurn);

document.getElementById('settingsBtn').addEventListener('click',()=>{
  if(isMoving)return;
  buildNameInputs();
  showOverlay(document.getElementById('settingsScreen'));
});

document.getElementById('playerCount').addEventListener('change',buildNameInputs);
document.getElementById('cancelSettingsBtn').addEventListener('click',()=>hideOverlay(document.getElementById('settingsScreen')));
document.getElementById('applySettingsBtn').addEventListener('click',()=>{
  const names=[...document.querySelectorAll('#nameInputs input')].map((el,i)=>normalizeName(el.value)||DEFAULT_NAMES[i]);
  newPlayers(names.length,names);
  hideOverlay(document.getElementById('settingsScreen'));
});

document.getElementById('fullscreenBtn').addEventListener('click',async()=>{
  try{
    if(!document.fullscreenElement)await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(e){}
});

newPlayers(3);
