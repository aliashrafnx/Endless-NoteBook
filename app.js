// app.js
// Cute Persian→English/French dictionary web app
// Uses MyMemory API for translation and LocalStorage for offline storage.
// Author: generated for your gift

// ----- Helpers -----
const $ = id => document.getElementById(id);
const status = txt => { $('status').textContent = txt; };

// ----- Elements -----
const persianInput = $('persianInput');
const translateBtn = $('translateBtn');
const saveBtn = $('saveBtn');
const wordListEl = $('wordList');
const clearAllBtn = $('clearAll');

const detailModal = $('detailModal');
const closeModal = $('closeModal');
const detailPersian = $('detailPersian');
const detailEnglish = $('detailEnglish');
const detailFrench = $('detailFrench');
const playEn = $('playEn');
const playFr = $('playFr');
const deleteWordBtn = $('deleteWord');

let currentTranslate = null;   // { persian, english, french }
let selectedIndex = null;      // index in saved array

// ----- LocalStorage keys -----
const STORAGE_KEY = 'fa_vocab_words_v1';

// ----- Load saved words -----
function loadWords(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function saveWords(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ----- Render list -----
function renderList(){
  const list = loadWords();
  wordListEl.innerHTML = '';
  if(list.length === 0){
    wordListEl.innerHTML = `<li class="smallmuted">هنوز کلمه‌ای ذخیره نشده — اولین کلمه را اضافه کن 💛</li>`;
    return;
  }
  list.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="word-left">
        <div class="persian">${escapeHtml(item.persian)}</div>
        <div class="smallmuted">${escapeHtml(item.english)} · ${escapeHtml(item.french)}</div>
      </div>
      <div class="word-right">
        <button class="open-detail" data-idx="${idx}">جزئیات</button>
      </div>
    `;
    wordListEl.appendChild(li);
  });
  // attach click
  document.querySelectorAll('.open-detail').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = Number(btn.dataset.idx);
      openDetail(idx);
    });
  });
}

// simple escape to avoid injection
function escapeHtml(s){
  if(!s) return '';
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// ----- Translation (MyMemory) -----
async function translateFaTo(lang, word){
  // lang: 'en' or 'fr'
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=fa|${lang}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('شبکه در دسترس نیست');
  const json = await res.json();
  // safety: try responseData.translatedText else fallback to response
  const text = json?.responseData?.translatedText || '';
  return text;
}

// ----- UI Actions -----
translateBtn.addEventListener('click', async () => {
  const w = persianInput.value.trim();
  if(!w){ status('لطفا کلمه‌ای وارد کن'); return; }
  status('دریافت ترجمه... (نیاز به اینترنت)');
  translateBtn.disabled = true;
  saveBtn.disabled = true;
  try{
    const en = await translateFaTo('en', w);
    const fr = await translateFaTo('fr', w);
    currentTranslate = { persian: w, english: en || '(ترجمه یافت نشد)', french: fr || '(ترجمه یافت نشد)' };
    status('ترجمه آماده شد — می‌تونی ذخیره کنی ✔');
    saveBtn.disabled = false;
  }catch(err){
    console.error(err);
    status('خطا هنگام ترجمه — اتصال اینترنت را بررسی کنید');
  }finally{
    translateBtn.disabled = false;
  }
});

saveBtn.addEventListener('click', () => {
  if(!currentTranslate){ status('هیچ ترجمه‌ای برای ذخیره وجود ندارد'); return; }
  const arr = loadWords();
  // prevent duplicate persian words (replace if exists)
  const found = arr.findIndex(x => x.persian === currentTranslate.persian);
  if(found >= 0){
    arr[found] = currentTranslate;
  }else{
    arr.push(currentTranslate);
  }
  saveWords(arr);
  renderList();
  status('ذخیره شد 💾');
  persianInput.value = '';
  saveBtn.disabled = true;
  currentTranslate = null;
});

clearAllBtn.addEventListener('click', () => {
  if(!confirm('همهٔ واژگان حذف شوند؟ این عمل قابل بازگشت نیست.')) return;
  saveWords([]);
  renderList();
  status('همهٔ واژگان پاک شدند');
});

// ----- Detail modal -----
function openDetail(idx){
  const arr = loadWords();
  const item = arr[idx];
  if(!item) return;
  selectedIndex = idx;
  detailPersian.textContent = item.persian;
  detailEnglish.textContent = item.english;
  detailFrench.textContent = item.french;
  detailModal.classList.remove('hidden');
  detailModal.setAttribute('aria-hidden','false');
}

closeModal.addEventListener('click', () => {
  detailModal.classList.add('hidden');
  detailModal.setAttribute('aria-hidden','true');
  selectedIndex = null;
});

deleteWordBtn.addEventListener('click', () => {
  if(selectedIndex === null) return;
  if(!confirm('این کلمه حذف شود؟')) return;
  const arr = loadWords();
  arr.splice(selectedIndex,1);
  saveWords(arr);
  renderList();
  closeModal.click();
  status('کلمه حذف شد');
});

// ----- Text-to-Speech -----
function speak(text, lang){
  if(!('speechSynthesis' in window)){
    alert('متأسفم، مرورگر شما از TTS پشتیبانی نمی‌کند.');
    return;
  }
  const ut = new SpeechSynthesisUtterance(text);
  ut.lang = lang;
  // choose a voice if available matching the lang
  const voices = speechSynthesis.getVoices();
  if(voices && voices.length){
    const v = voices.find(v => (v.lang || '').startsWith(lang));
    if(v) ut.voice = v;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(ut);
}

playEn.addEventListener('click', () => speak(detailEnglish.textContent || '', 'en'));
playFr.addEventListener('click', () => speak(detailFrench.textContent || '', 'fr'));

// open on enter key
persianInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') translateBtn.click();
});

// initial
renderList();
status('آماده — اولین کلمه را اضافه کن 💛');

// show a sweet welcome message in console (for fun)
console.log('%cبرای تو: امیدوارم این هدیه لبخند بیاره 💛', 'font-size:14px;color:#ff6b9e;');
