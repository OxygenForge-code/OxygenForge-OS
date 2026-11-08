(() => {
  const S = SITE, E = { desktop: "Desktop", server: "Server" }, A = { x86_64: "x86_64 (Intel / AMD)", arm64: "ARM64" };
  const sec = (id, t, sub, body) => `<section class="sec" id="${id}"><div class="sh"><h2>${t}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${body}</section>`;
  const det = (q, a, open) => `<details${open ? " open" : ""}><summary>${q}</summary>${a}</details>`;
  const cmd = (l, id) => `<div class="cmd"><span>${l}</span><code id="${id}"></code><button type="button" class="cp">Kopyala</button></div>`;
  const cards = Object.keys(S.releases).map(e => `<article class="rc"><h3>${E[e]}</h3><p>${S.editions[e]}</p>` +
    Object.keys(S.releases[e]).map(a => `<div class="rr"><div><b>${A[a]}</b><span>${S.releases[e][a].size || "Boyut eklenmedi"}</span></div><button type="button" data-e="${e}" data-a="${a}">İndir</button></div>`).join("") + `</article>`).join("");
  $("#sections").innerHTML =
    sec("releases", "Tüm sürümler", `Sürüm ${S.version}. Kullanım amacına ve işlemcine uygun dosyayı seç.`, `<div class="rg">${cards}</div>`) +
    sec("verify", "İndirdiğin dosyayı doğrula", "ISO dosyasının eksiksiz ve değişmemiş olduğunu SHA-256 değeriyle kontrol et.",
      `<div class="glass"><p class="hl">Seçili dosya: <b id="vf"></b></p>${cmd("Beklenen SHA-256", "vh")}${cmd("Linux / macOS", "vl")}${cmd("Windows (PowerShell)", "vw")}<p class="note">Komutun çıktısı beklenen değerle aynı olmalı. Farklıysa dosyayı yeniden indir.</p></div>`) +
    sec("reqs", "Sistem gereksinimleri", "", `<div class="glass tw"><table><tr><th></th><th>Minimum</th><th>Önerilen</th></tr>${S.requirements.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table></div>`) +
    sec("install", "Kurulum", "", `<ol class="st">${S.steps.map(s => `<li class="glass"><b>${s[0]}</b><p>${s[1]}</p></li>`).join("")}</ol>`) +
    sec("privacy", "Gizlilik", "OxygenForgeOS hesap istemez, telemetri göndermez; bu site de çerez ve analitik kullanmaz.",
      `<div class="glass">
        <div class="pgrid">
          <div class="pitem"><b>Telemetri yok</b><span>Kurulum ve kullanım verisi hiçbir sunucuya gönderilmez.</span></div>
          <div class="pitem"><b>Çerez yok</b><span>Site analitik, reklam ve üçüncü taraf betiği kullanmaz.</span></div>
          <div class="pitem"><b>Veri satışı yok</b><span>Hiçbir veri satılmaz, reklam profili oluşturulmaz.</span></div>
          <div class="pitem"><b>Kontrol sende</b><span>DNS, güvenlik duvarı, MAC ve çökme dökümleri Gizlilik Merkezi'nde.</span></div>
        </div>
        <a class="plink" href="gizlilik.html">Gizlilik Politikası’nın tamamını oku <span aria-hidden="true">→</span></a>
      </div>`) +
    sec("changelog", "Sürüm notları", "", `<div class="glass">${S.changelog.map((c, i) => det(`${c.v}<span>${c.date || ""}</span>`, `<ul>${c.items.map(x => `<li>${x}</li>`).join("")}</ul>`, !i)).join("")}</div>`) +
    sec("faq", "Sık sorulan sorular", "", `<div class="glass">${S.faq.map(f => det(f[0], `<p>${f[1]}</p>`)).join("")}</div>`);

  const refresh = () => {
    const f = fileName(), r = RELEASES[ed.value][ar.value];
    $("#vf").textContent = f;
    $("#vh").textContent = r.sha256 || "Henüz eklenmedi (config.js)";
    $("#vl").textContent = "sha256sum " + f;
    $("#vw").textContent = "Get-FileHash " + f + " -Algorithm SHA256";
  };
  ed.addEventListener("change", refresh); ar.addEventListener("change", refresh); refresh();
  document.querySelectorAll(".rr button").forEach(b => b.onclick = () => {
    ed.value = b.dataset.e; ar.value = b.dataset.a; sync(); refresh(); $("#dl").requestSubmit();
  });
  document.querySelectorAll(".cp").forEach(b => b.onclick = () => {
    (navigator.clipboard?.writeText(b.previousElementSibling.textContent) ?? Promise.reject())
      .then(() => { b.textContent = "Kopyalandı"; setTimeout(() => b.textContent = "Kopyala", 1500); })
      .catch(() => show("Kopyalanamadı, metni elle seç."));
  });
})();
