const $ = (id) => document.getElementById(id);
const status = (txt) => {
  $("status").innerHTML = txt;
};

const persianInput = $("persianInput");
const translateBtn = $("translateBtn");
const wordListEl = $("wordList");

const detailModal = $("detailModal");
const closeModal = $("closeModal");
const detailPersian = $("detailPersian");
const detailEnglish = $("detailEnglish");
const detailFrench = $("detailFrench");
const playEn = $("playEn");
const playFr = $("playFr");
const deleteWordBtn = $("deleteWord");

let selectedIndex = null;
const STORAGE_KEY = "fa_vocab_words_v2";

// ----- LocalStorage -----
function loadWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveWords(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ----- Render List -----
function renderList() {
  const list = loadWords();
  wordListEl.innerHTML = "";
  if (list.length === 0) {
    wordListEl.innerHTML = `<li class="smallmuted">هنوز کلمه‌ای ذخیره نکردی — اولین کلمت رو اضافه کن </li>`;
    return;
  }
  list.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="word-left">
        <div class="persian">${escapeHtml(item.persian)}</div>
        <div class="smallmuted">${escapeHtml(item.english)} · ${escapeHtml(
      item.french
    )}</div>
      </div>
      <div class="word-right">
        <button class="open-detail" data-idx="${idx}">جزئیات</button>
      </div>
    `;
    wordListEl.appendChild(li);
  });
  document.querySelectorAll(".open-detail").forEach((btn) => {
    btn.addEventListener("click", () => openDetail(Number(btn.dataset.idx)));
  });
}
function escapeHtml(s) {
  if (!s) return "";
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ----- Translation -----
async function translateFaTo(lang, word) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    word
  )}&langpair=fa|${lang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("شبکه در دسترس نیست");
  const json = await res.json();
  return json?.responseData?.translatedText || "";
}

// ----- Button Click (translate & save) -----
translateBtn.addEventListener("click", async () => {
  const w = persianInput.value.trim();
  if (!w) {
    status("یه چیزی بنویس اول");
    return;
  }

  // Add spinning heart animation while loading
  status('دریافت ترجمه... <span class="spin">🤔</span>');
  translateBtn.disabled = true;

  try {
    const en = await translateFaTo("en", w);
    const fr = await translateFaTo("fr", w);

    const wordObj = {
      persian: w,
      english: en || "(ترجمه یافت نشد)",
      french: fr || "(ترجمه یافت نشد)",
    };

    const arr = loadWords();
    const found = arr.findIndex((x) => x.persian === w);
    if (found >= 0) arr[found] = wordObj;
    else arr.push(wordObj);
    saveWords(arr);

    renderList();
    status("ترجمت اضافه شد 💾");
    persianInput.value = "";

    // show ready after short delay
    setTimeout(() => {
      status("کلمه جدید رو اضافه کن");
    }, 1200);
  } catch (err) {
    console.error(err);
    status("اینترنتت وصله؟🤨");
  } finally {
    translateBtn.disabled = false;
  }
});

// ----- Detail modal -----
function openDetail(idx) {
  const arr = loadWords();
  const item = arr[idx];
  if (!item) return;
  selectedIndex = idx;
  detailPersian.textContent = item.persian;
  detailEnglish.textContent = item.english;
  detailFrench.textContent = item.french;
  detailModal.classList.remove("hidden");
  detailModal.classList.add("animate-pop");
  detailModal.setAttribute("aria-hidden", "false");
}

closeModal.addEventListener("click", () => {
  detailModal.classList.add("hidden");
  detailModal.setAttribute("aria-hidden", "true");
  selectedIndex = null;
});

deleteWordBtn.addEventListener("click", () => {
  if (selectedIndex === null) return;
  if (!confirm("این کلمه حذف شود؟")) return;
  const arr = loadWords();
  arr.splice(selectedIndex, 1);
  saveWords(arr);
  renderList();
  closeModal.click();
  status("کلمه حذف شد");
});

// ----- Text-to-Speech -----
function speak(text, lang) {
  if (!("speechSynthesis" in window)) {
    alert("متأسفم.. این صدا نمتونه پخش بشه😔");
    return;
  }
  const ut = new SpeechSynthesisUtterance(text);
  ut.lang = lang;
  const voices = speechSynthesis.getVoices();
  if (voices && voices.length) {
    const v = voices.find((v) => (v.lang || "").startsWith(lang));
    if (v) ut.voice = v;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(ut);
}
playEn.addEventListener("click", () => speak(detailEnglish.textContent, "en"));
playFr.addEventListener("click", () => speak(detailFrench.textContent, "fr"));

// enter key
persianInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") translateBtn.click();
});
function spawnKisses(num = 7) {
  for (let i = 0; i < num; i++) {
    const kiss = document.createElement("span");
    kiss.className = "kiss";
    kiss.textContent = "❤";

    // random horizontal start
    kiss.style.left = Math.random() * window.innerWidth + "px";
    kiss.style.bottom = "-20px";

    // random size (20–50px)
    kiss.style.fontSize = 20 + Math.random() * 30 + "px";

    // random offset in x direction
    kiss.style.setProperty("--xOffset", Math.random() * 200 - 100 + "px");

    // random duration (1.8–4s)
    const duration = 1.8 + Math.random() * 2.2;
    kiss.style.animationDuration = duration + "s";

    // random delay (0–0.8s)
    kiss.style.animationDelay = Math.random() * 0.8 + "s";

    // Set animation name
    kiss.style.animationName = "floatKissRandom";

    document.body.appendChild(kiss);

    // remove after animation ends
    setTimeout(() => kiss.remove(), duration * 1000 + 1000);
  }
}

window.addEventListener("load", () => {
  spawnKisses(12); // more kisses = more love 💋
});
// init
renderList();
status("کلمه رو اضافه کن");
console.log(
  "%cبرای تو: امیدوارم این هدیه لبخند بیاره 💛",
  "font-size:14px;color:#ff6b9e;"
);
