const RELEASES = SITE.releases; // bağlantılar, boyutlar ve SHA-256 değerleri config.js içinde
const $ = s => document.querySelector(s);
const ed = $("#edition"), ar = $("#arch"), fn = $("#fname"), typed = $("#typed"), toast = $("#toast");
const fileName = () => `OxygenForgeOS-${ed.value}-${ar.value}.iso`;
const sync = () => { const r = RELEASES[ed.value][ar.value]; fn.textContent = fileName() + (r.size ? " · " + r.size : ""); };
ed.onchange = ar.onchange = sync; sync();

let tm;
function show(msg) {
  toast.textContent = msg; toast.classList.add("on");
  clearTimeout(tm); tm = setTimeout(() => toast.classList.remove("on"), 4200);
}
$("#dl").onsubmit = e => {
  e.preventDefault();
  const url = RELEASES[ed.value][ar.value].url;
  if (!url) return show("Bu sürüm için indirme bağlantısı henüz eklenmedi. config.js içindeki url alanına ekle.");
  const a = document.createElement("a");
  a.href = url; a.download = fileName();
  document.body.append(a); a.click(); a.remove();
  show(fileName() + " indiriliyor. Dosyayı Doğrulama bölümündeki komutla kontrol et.");
};

// Arama alanındaki yazı döngüsü (Figma animasyonu: harf harf giriş, sağdan sola çıkış)
const PHRASES = ["OxygenForgeOS Desktop", "OxygenForgeOS Server", "OxygenForgeOS ARM64"];
let n = 0;
function nextPhrase() {
  const txt = PHRASES[n++ % PHRASES.length];
  typed.className = ""; typed.textContent = "";
  [...txt].forEach((c, i) => {
    const s = document.createElement("span");
    s.textContent = c; s.style.setProperty("--i", i); s.style.setProperty("--n", txt.length);
    typed.append(s);
  });
  setTimeout(() => typed.classList.add("out"), 1950);
  setTimeout(nextPhrase, 2900);
}
setTimeout(nextPhrase, 1550);

// Cihaz mimarisini tahmin et (destekleyen tarayıcılarda)
(navigator.userAgentData?.getHighEntropyValues ? navigator.userAgentData.getHighEntropyValues(["architecture"]).then(v => v.architecture) : Promise.resolve(/aarch64|arm/i.test(navigator.userAgent) ? "arm" : ""))
  .then(a => { if (/arm/i.test(a)) { ar.value = "arm64"; ar.dispatchEvent(new Event("change")); } }).catch(() => {});
