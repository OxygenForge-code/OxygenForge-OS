(() => {
  const S = SITE, E = { desktop: "Desktop", server: "Server" }, A = { x86_64: "x86_64 (Intel / AMD)", arm64: "ARM64" };
  const sec = (id, t, sub, body) => `<section class="sec" id="${id}"><div class="sh"><h2>${t}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${body}</section>`;
  const det = (q, a, open) => `<details${open ? " open" : ""}><summary>${q}</summary>${a}</details>`;
  const cmd = (l, id) => `<div class="cmd"><span>${l}</span><code id="${id}"></code><button type="button" class="cp">Kopyala</button></div>`;

  const features = S.features.map((f, i) => `<article class="bento-card bc-${i}" style="--d:${i}">
    <span class="bento-icon"><svg width="21" height="21"><use href="#i-${f[0]}"/></svg></span>
    <span class="tag">${f[3]}</span>
    <h3>${f[1]}</h3><p>${f[2]}</p>
  </article>`).join("");

  const cards = Object.keys(S.releases).map(e => `<article class="rc"><h3>${E[e]}</h3><p>${S.editions[e]}</p>` +
    Object.keys(S.releases[e]).map(a => `<div class="rr"><div><b>${A[a]}</b><span>${S.releases[e][a].size || "Boyut eklenmedi"}</span></div><button type="button" data-e="${e}" data-a="${a}">İndir</button></div>`).join("") + (e === "server" ? `<a class="guide-link" href="sunucu.html">Sunucu kurulum rehberi →</a>` : "") + `</article>`).join("");

  const compare = `<div class="glass cmp"><div class="cmp-row cmp-head"><b>Özellik</b><b>Desktop</b><b>Server</b></div>` +
    S.compare.map(r => `<div class="cmp-row"><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span></div>`).join("") + `</div>`;

  const pipeline = `<div class="pipe">${S.pipeline.map((p, i) => `<article class="pipe-step"><span class="pipe-n">${p.n}</span><h3>${p.t}</h3><p>${p.d}</p>${i < S.pipeline.length - 1 ? `<i class="pipe-arrow" aria-hidden="true">→</i>` : ""}</article>`).join("")}</div><div class="pipe-code"><span>Tek komut</span><code>sudo ./build.sh desktop</code><em>çıktı: out/OxygenForgeOS-desktop-x86_64.iso + .sha256</em></div>`;

  const roadmap = `<div class="road">${S.roadmap.map((r, i) => `<article class="stop ${r.state}" style="--d:${i}">
    <div class="stop-top"><span class="dot"></span><span class="v">${r.v}</span><span class="state">${r.state === "done" ? "Yayında" : r.date}</span></div>
    <h3>${r.name}</h3>
    <ul>${r.items.map(x => `<li>${x}</li>`).join("")}</ul>
  </article>`).join("")}</div>`;

  $("#sections").innerHTML =
    sec("features", "Neden OxygenForgeOS?", "Gizlilik sonradan eklenen bir katman değil; temel tasarım kararı.", `<div class="bento">${features}</div>`) +
    sec("desktop", "Cam gibi bir masaüstü", "Liquid glass; blur, ışık ve yarı saydam yüzeylerle gelen sakin bir çalışma alanı.", `<div class="desk-wrap">
      <div class="desk" role="img" aria-label="OxygenForgeOS masaüstü ve Gizlilik Merkezi temsili">
        <div class="desk-top"><span class="df-brand"><i></i>OxygenForgeOS</span><span class="df-works">1</span><span class="df-clock">12:40</span></div>
        <div class="desk-body">
          <div class="desk-icons"><span class="di"></span><span class="di"></span><span class="di"></span></div>
          <div class="desk-window">
            <div class="dw-bar"><span class="dw-dots"><i></i><i></i><i></i></span><b>Gizlilik Merkezi</b><span class="dw-x">×</span></div>
            <div class="dw-body">
              <div class="dw-ring"><div><strong>Korunuyor</strong><span>4 / 4 etkin</span></div></div>
              <div class="dw-list">
                <div><span class="on"></span><b>Şifreli DNS</b><em>Quad9 · DoT</em></div>
                <div><span class="on"></span><b>Güvenlik duvarı</b><em>nftables · reddet</em></div>
                <div><span class="on"></span><b>MAC rastgeleleştirme</b><em>Wi-Fi · açık</em></div>
                <div><span class="on"></span><b>Çökme dökümleri</b><em>Kapalı</em></div>
              </div>
            </div>
          </div>
          <div class="desk-dock"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </div>
      <p class="desk-note"><span>Liquid glass</span> picom dual-kawase blur · GTK3/GTK4 · XFCE panel · Calamares</p>
    </div>`) +
    sec("wizard", "Sana uygun imajı bul", "Üç kısa soru; doğru sürüm, mimari ve indirme bağlantısı.", `<div id="wizard" class="wiz-root"></div>`) +
    sec("demo", "Gizlilik Merkezi’ni dene", "Gerçek OxygenForgeOS ayarlarının tarayıcıda çalışan bir temsili.", `<div id="privacy-demo" class="pdemo-root"></div>`) +
    sec("architecture", "Debian’dan ISO’ya", "Aynı kaynak ağacı; tekrarlanabilir bir derleme hattı.", pipeline) +
    sec("releases", "Tüm sürümler", `Sürüm ${S.version} “${S.codename}”. Kullanım amacına ve işlemcine uygun dosyayı seç.`, `<div class="rg">${cards}</div>`) +
    sec("verify", "İndirdiğin dosyayı doğrula", "ISO dosyasının eksiksiz ve değişmemiş olduğunu SHA-256 değeriyle kontrol et.",
      `<div class="glass"><p class="hl">Seçili dosya: <b id="vf"></b></p>${cmd("Beklenen SHA-256", "vh")}${cmd("Linux / macOS", "vl")}${cmd("Windows (PowerShell)", "vw")}<p class="note">Komutun çıktısı beklenen değerle aynı olmalı. Farklıysa dosyayı yeniden indir. Tüm sürümler: <a href="${S.repo}/releases" target="_blank" rel="noopener">GitHub Releases</a>.</p></div>`) +
    sec("reqs", "Sistem gereksinimleri", "", `<div class="glass tw"><table><tr><th></th><th>Minimum</th><th>Önerilen</th></tr>${S.requirements.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table></div>`) +
    sec("install", "Kurulum", "Üç adımda canlı oturumdan kurulu sisteme.", `<ol class="st">${S.steps.map(s => `<li class="glass"><b>${s[0]}</b><p>${s[1]}</p></li>`).join("")}</ol>`) +
    sec("compare", "Hangi sürüm sana uygun?", "Aynı gizlilik temeli; farklı kullanım senaryoları.", compare) +
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
    sec("changelog", "Sürüm notları", "Her sürümde ne değişti?", `<div class="glass">${S.changelog.map((c, i) => det(`${c.v}<span>${c.date || ""}</span>`, `<ul>${c.items.map(x => `<li>${x}</li>`).join("")}</ul>`, !i)).join("")}</div>`) +
    sec("roadmap", "Yol haritası", "Şeffaf bir plan; tarihler değişebilir.", roadmap) +
    sec("open", "Kaynak açık. Gelecek toplulukta.", "Kodu oku, derle, çevir veya bir hata bildir. OxygenForgeOS kapalı bir kutu değil.", `<div class="glass cta">
      <div class="cta-copy"><span class="eyebrow">GitHub</span><h3>Projeyi incele ve katkıda bulun</h3><p>Kaynak ağacı, derleme belgeleri, sürümler ve sorun takibi tek yerde.</p></div>
      <div class="cta-actions"><a class="btn primary" href="${S.repo}" target="_blank" rel="noopener"><svg width="16" height="16"><use href="#i-github"/></svg>Depoyu aç</a><a class="btn" href="${S.repo}/blob/main/OxygenForgeOS/docs/BUILDING.md" target="_blank" rel="noopener">Derleme rehberi <svg width="15" height="15"><use href="#i-arrow"/></svg></a></div>
    </div>`) +
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
