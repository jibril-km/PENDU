const WORDS = {
  dev: ["JAVASCRIPT","ALGORITHME","TERMINAL","GITHUB","PORTFOLIO","FRAMEWORK","VARIABLE"],
  sport: ["FOOTBALL","BASKET","TENNIS","ATHLETISME","KARATE","BOXE","HANDBALL"],
  food: ["TAJINE","PASTILLA","SEFFA","CHOCOLAT","PIZZA","SUSHI","PANCETTA"]
};

const wordEl = document.getElementById("word");
const kbEl = document.getElementById("kb");
const errEl = document.getElementById("err");
const maxErrEl = document.getElementById("maxErr");
const goodEl = document.getElementById("good");
const badEl = document.getElementById("bad");
const toast = document.getElementById("toast");

const catEl = document.getElementById("cat");
const lvlEl = document.getElementById("lvl");
const newBtn = document.getElementById("new");

let secret = "";
let maxErr = 6;
let err = 0;
let good = new Set();
let bad = new Set();

function show(msg){ toast.textContent = msg; }

function pickWord(){
  const cat = catEl.value;
  const list = WORDS[cat];
  return list[Math.floor(Math.random()*list.length)];
}

function renderWord(){
  const out = secret.split("").map(ch => (good.has(ch) ? ch : "•")).join(" ");
  wordEl.textContent = out;
}

function renderSets(){
  goodEl.textContent = good.size ? [...good].sort().join(", ") : "—";
  badEl.textContent = bad.size ? [...bad].sort().join(", ") : "—";
}

function renderHang(){
  for (let i=1;i<=6;i++){
    const part = document.getElementById("p"+i);
    part.style.opacity = err >= i ? "1" : "0";
  }
}

function endCheck(){
  const won = secret.split("").every(ch => good.has(ch));
  if (won){
    show("🎉 Gagné ! Nouveau mot ?");
    disableKeys();
    return true;
  }
  if (err >= maxErr){
    show(`💀 Perdu… Mot : ${secret}`);
    disableKeys();
    wordEl.textContent = secret.split("").join(" ");
    return true;
  }
  return false;
}

function disableKeys(){
  [...kbEl.children].forEach(k=>k.classList.add("used"));
}

function onGuess(letter){
  if (good.has(letter) || bad.has(letter)) return;

  if (secret.includes(letter)){
    good.add(letter);
    show("✅ Bien !");
  } else {
    bad.add(letter);
    err++;
    errEl.textContent = String(err);
    show("❌ Raté !");
  }
  renderWord();
  renderSets();
  renderHang();
  endCheck();
}

function buildKeyboard(){
  kbEl.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  letters.forEach(l=>{
    const b = document.createElement("div");
    b.className = "key";
    b.textContent = l;
    b.addEventListener("click", ()=>{
      if (b.classList.contains("used")) return;
      b.classList.add("used");
      onGuess(l);
    });
    kbEl.appendChild(b);
  });
}

function reset(){
  secret = pickWord();
  maxErr = Number(lvlEl.value);
  maxErrEl.textContent = String(maxErr);
  err = 0;
  good = new Set();
  bad = new Set();
  errEl.textContent = "0";
  renderHang();
  buildKeyboard();
  renderWord();
  renderSets();
  show("Choisis une lettre 🙂");
}

newBtn.addEventListener("click", reset);
catEl.addEventListener("change", reset);
lvlEl.addEventListener("change", reset);

document.addEventListener("keydown", (e)=>{
  const k = e.key.toUpperCase();
  if (!/^[A-Z]$/.test(k)) return;
  const keyEl = [...kbEl.children].find(el=>el.textContent===k);
  if (keyEl && !keyEl.classList.contains("used")){
    keyEl.classList.add("used");
    onGuess(k);
  }
});

reset();
