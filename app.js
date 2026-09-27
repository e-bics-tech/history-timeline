"use strict";

const events = [
  { year: 1945, event: "日本がポツダム宣言を受け入れ、降伏する" },
  { year: 1945, event: "第二次世界大戦が終わる" },
  { year: 1945, event: "国際連合が成立する" },
  { year: 1945, event: "財閥解体が始まる" },
  { year: 1945, event: "女性参政権が実現する" },
  { year: 1946, event: "極東国際軍事裁判が始まる" },
  { year: 1946, event: "日本国憲法が公布される" },
  { year: 1946, event: "農地改革が始まる" },
  { year: 1947, event: "日本国憲法が施行される" },
  { year: 1947, event: "教育基本法が公布される" },
  { year: 1947, event: "冷戦が始まる" },
  { year: 1948, event: "朝鮮半島に大韓民国と北朝鮮が成立する" },
  { year: 1949, event: "ドイツが東西に分裂する" },
  { year: 1949, event: "中華人民共和国が成立する" },
  { year: 1949, event: "湯川秀樹がノーベル物理学賞を受賞する" },
  { year: 1950, event: "朝鮮戦争が始まる" },
  { year: 1950, event: "警察予備隊が創設される" },
  { year: 1951, event: "サンフランシスコ平和条約を結ぶ" },
  { year: 1951, event: "日米安全保障条約を結ぶ" },
  { year: 1952, event: "日本が独立を回復する" },
  { year: 1953, event: "テレビ放送が始まる" },
  { year: 1954, event: "自衛隊が発足する" },
  { year: 1954, event: "ベトナムが南北に分断される" },
  { year: 1955, event: "アジア・アフリカ会議が開かれる" },
  { year: 1955, event: "高度経済成長が始まる" },
  { year: 1956, event: "日ソ共同宣言に調印する" },
  { year: 1956, event: "日本が国際連合に加盟する" },
  { year: 1960, event: "日米安全保障条約を改定する" },
  { year: 1962, event: "キューバ危機が起こる" },
  { year: 1964, event: "東京オリンピックが開かれる" },
  { year: 1965, event: "日韓基本条約を結ぶ" },
  { year: 1965, event: "ベトナム戦争が激化する" },
  { year: 1967, event: "ヨーロッパ共同体（EC）が発足する" },
  { year: 1967, event: "公害対策基本法が制定される" },
  { year: 1970, event: "大阪で日本万国博覧会が開かれる" },
  { year: 1972, event: "沖縄が日本に復帰する" },
  { year: 1972, event: "日中共同声明を発表する" },
  { year: 1973, event: "第四次中東戦争が起こる" },
  { year: 1973, event: "石油危機が起こる" },
  { year: 1975, event: "第1回先進国首脳会議（サミット）が開かれる" },
  { year: 1976, event: "南北ベトナムが統一される" },
  { year: 1978, event: "日中平和友好条約を結ぶ" },
  { year: 1980, event: "アメリカとの貿易摩擦が激しくなる" },
  { year: 1989, event: "平成に改元される" },
  { year: 1989, event: "ベルリンの壁が崩壊する" },
  { year: 1990, event: "東西ドイツが統一される" },
  { year: 1991, event: "ソビエト連邦が解体される" },
  { year: 1991, event: "バブル経済が崩壊する" },
  { year: 1992, event: "PKO協力法が成立する" },
  { year: 1993, event: "55年体制が終わる" },
  { year: 1993, event: "ヨーロッパ連合（EU）が成立する" },
  { year: 1995, event: "阪神・淡路大震災が起こる" },
  { year: 2001, event: "アメリカ同時多発テロ事件が起こる" },
  { year: 2002, event: "初の日朝首脳会談が行われる" },
  { year: 2008, event: "世界金融危機が起こる" },
  { year: 2011, event: "東日本大震災が起こる" },
  { year: 2019, event: "令和に改元される" }
];

const byYear = new Map();
events.forEach((item) => {
  if (!byYear.has(item.year)) byYear.set(item.year, []);
  byYear.get(item.year).push(item);
});

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function signature(items) {
  return items.map((item) => item.event).sort().join("|");
}

function generateQuestion(previous) {
  const years = shuffle([...byYear.keys()]).slice(0, 6);
  const selected = years.map((year) => {
    const group = byYear.get(year);
    return group[Math.floor(Math.random() * group.length)];
  });
  // 完全一致した場合は未選択の年から1件を補充し、再抽選ループを避ける。
  if (signature(selected) === signature(previous)) {
    const alternatives = events.filter((item) => !years.includes(item.year));
    if (alternatives.length) {
      selected[0] = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
  }
  return shuffle(selected);
}

const cards = document.getElementById("cards");
const answer = document.getElementById("answer");
const result = document.getElementById("result");
const correctOrder = document.getElementById("correct-order");
const announcement = document.getElementById("announcement");
let current = [];
let correct = [];
let answered = false;
let selected = null;
const moveUp = document.getElementById("move-up");
const moveDown = document.getElementById("move-down");
const selectionStatus = document.getElementById("selection-status");

function updateSelection() {
  const index = current.indexOf(selected);
  cards.querySelectorAll(".card").forEach((card, i) => {
    const active = !answered && current[i] === selected;
    card.classList.toggle("selected", active);
    const button = card.querySelector("button");
    if (button) button.setAttribute("aria-pressed", String(active));
  });
  moveUp.disabled = answered || index <= 0;
  moveDown.disabled = answered || index < 0 || index === current.length - 1;
  selectionStatus.textContent = answered ? "回答済み" : index < 0 ? "項目をタップして選択" : (index + 1) + "番目を選択中";
}

moveUp.addEventListener("click", () => move(-1));
moveDown.addEventListener("click", () => move(1));

function renderCards() {
  cards.replaceChildren();
  current.forEach((item, index) => {
    const card = document.createElement("li");
    card.className = answered ? "card" : "card selectable";
    const position = document.createElement("span");
    if (answered) {
      const matches = item === correct[index];
      card.classList.add(matches ? "correct" : "incorrect");
      position.className = "mark";
      position.textContent = matches ? "○" : "×";
      position.setAttribute("aria-label", matches ? "正解" : "不正解");
    } else {
      position.className = "position";
      position.textContent = String(index + 1);
    }
    const label = document.createElement("span");
    label.className = "event";
    label.textContent = item.event;
    if (answered) {
      card.append(position, label);
    } else {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "select-card";
      button.append(position, label);
      button.addEventListener("click", () => {
        if (answered) return;
        selected = selected === item ? null : item;
        updateSelection();
      });
      card.append(button);
    }
    cards.append(card);
  });
  updateSelection();
}

function move(direction) {
  const index = current.indexOf(selected);
  const target = index + direction;
  if (answered || index < 0 || target < 0 || target >= current.length) return;
  [current[index], current[target]] = [current[target], current[index]];
  renderCards();
  const card = cards.children[target];
  card.scrollIntoView({ block: "nearest" });
  const control = direction === -1 ? moveUp : moveDown;
  if (control.disabled) card.querySelector("button").focus({ preventScroll: true });
  announcement.textContent = current[target].event + "を" + (target + 1) + "番目に移動しました。";
}

function startQuestion() {
  current = generateQuestion(current);
  correct = [...current].sort((a, b) => a.year - b.year);
  answered = false;
  selected = null;
  result.hidden = true;
  correctOrder.replaceChildren();
  document.getElementById("score").textContent = "";
  announcement.textContent = "";
  answer.disabled = false;
  answer.textContent = "回答する";
  renderCards();
}

answer.addEventListener("click", () => {
  if (answered) return;
  answered = true;
  selected = null;
  renderCards();
  answer.disabled = true;
  answer.textContent = "回答済み";
  const count = current.filter((item, index) => item === correct[index]).length;
  document.getElementById("score").textContent = "6件中 " + count + "件の位置が正解です";
  correct.forEach((item) => {
    const li = document.createElement("li");
    const year = document.createElement("span");
    year.className = "year";
    year.textContent = item.year + "年";
    li.append(year, document.createTextNode(item.event));
    correctOrder.append(li);
  });
  result.hidden = false;
  document.getElementById("result-title").focus({ preventScroll: true });
});

document.getElementById("next").addEventListener("click", () => {
  startQuestion();
  cards.querySelector("button:not(:disabled)").focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

startQuestion();
