# Gizlilik tasarımı

Bu belge OxygenForgeOS'un **teknik** gizlilik davranışını açıklar. Kullanıcıya
gösterilen hukuki metin sitedeki `gizlilik.html` sayfasıdır; ikisi aynı
varsayılanları anlatır. Bir davranış değişirse iki belge birlikte güncellenir.

## İlkeler

1. **Veri minimizasyonu:** Varsayılan olarak hiçbir kullanım verisi toplanmaz.
2. **Hesapsızlık:** Kurulum, güncelleme veya ayarlar için OxygenForge hesabı
   gerekmez.
3. **Yerellik:** Dosyalar, günlükler ve tarayıcı verisi cihazda kalır.
4. **Şeffaflık:** Hangi servisin hangi veriyi gördüğü aşağıda listelenir.
5. **Kullanıcı kontrolü:** Gizlilik Merkezi'ndeki her koruma kapatılabilir;
   kapatmanın sonucu arayüzde açıkça yazılır.

## Varsayılanlar

| Konu | Varsayılan | Nasıl değiştirilir |
| --- | --- | --- |
| Telemetri / analitik | Yok | Kaldırılamaz; hiçbir bileşen göndermez |
| Reklam kimliği | Yok | — |
| Çökme dökümleri | Kapalı (`Storage=none`) | Gizlilik Merkezi |
| DNS | Quad9, DNS-over-TLS, zorunlu tüm alan adları | Gizlilik Merkezi veya `resolved.conf` |
| Güvenlik duvarı | Gelen bağlantılar reddedilir | Gizlilik Merkezi / `nftables.conf` |
| Wi-Fi MAC | Her ağda rastgele | Gizlilik Merkezi / NetworkManager |
| mDNS / LLMNR | Kapalı, avahi maskeli | Elle |
| Otomatik güncelleme | Kapalı | `docs/SERVER.md` |
| Firefox telemetrisi | Kapalı | Firefox politikaları |
| Firefox sponsorlu içerik / Pocket | Kapalı | Firefox politikaları |
| Makine kimliği | Kurulumda rastgele | Calamares `machineid` |
| SSH | Kapalı | Sunucu yöneticisi açar |

## Ağ uç noktaları

Hiçbir OxygenForge sunucusuna otomatik bağlantı yoktur. Ağa çıkan bileşenler:

| Bileşen | Hedef | Ne görünür | Ne zaman |
| --- | --- | --- | --- |
| systemd-resolved | Quad9 `9.9.9.9`, `2620:fe::fe` (`dns.quad9.net`) | IP adresin, sorgulanan alan adı, TLS oturumu | DNS çözümlemesi sırasında |
| APT | Debian yansıları (`deb.debian.org`, `security.debian.org`) | IP adresin, `OxygenForgeOS/1.0` user-agent, istenen paketler | Yalnızca sen `apt update` / güncelleme çalıştırınca |
| systemd-timesyncd | NTP havuzu (Debian varsayılanı) | IP adresin, saat istemi | Önyükleme ve periyodik eşitleme |
| Firefox ESR | Mozilla güvenlik listeleri, uzantı/blok listesi güncellemeleri, algılama | IP adresin, tarayıcı sürümü | Tarayıcı açıkken |
| Firefox arama | Seçtiğin arama motoru | Arama terimin | Sen arama yapınca |
| Web sitesi | Statik barındırma | Standart erişim günlükleri | Siteyi ziyaret edince |

Quad9 bağımsız bir kuruluştur ve sorguları OxygenForge'a vermez. Yine de DNS
sağlayıcısı sorguları görebilir; mutlak anonimlik için VPN/Tor gerekir, bu
dağıtım bunu sağlamaz.

## Yerelde ne saklanır?

- `/var/log/journal`: en fazla 200 MB, 30 gün; yalnızca yerel.
- Tarayıcı profili: geçmiş, çerezler, oturumlar (sen silene kadar).
- `/etc/machine-id`: kurulumda rastgele üretilir; sunucuya gönderilmez.
- SSH ana makine anahtarları: ilk açılışta üretilir; ISO'da taşınmaz.
- Çökme dökümü: varsayılan olarak **yok**. Açarsan yalnızca journal'da tutulur.
- Kullanıcı dosyaları: yalnızca diskte; şifreleme için kurulumda LUKS seç.

## Doğrulama

Kurulu bir sistemde:

```bash
# Güvenlik duvarı
sudo nft list ruleset

# DNS / DoT
resolvectl status
cat /etc/systemd/resolved.conf.d/90-oxygenforge.conf

# MAC rastgeleleştirme
cat /etc/NetworkManager/conf.d/90-oxygenforge-privacy.conf

# Çökme dökümleri
cat /etc/systemd/coredump.conf.d/90-oxygenforge.conf
coredumpctl list

# Firefox politikaları
cat /etc/firefox/policies/policies.json

# Makine kimliği ve SSH anahtarları
cat /etc/machine-id
ls -l /etc/ssh/ssh_host_*
```

## Web sitesi

`OxygenForgeOS-site/` statik HTML/CSS/JS'den oluşur:

- Çerez, analitik, reklam ve üçüncü taraf gömme yoktur.
- Harici font/CDN isteği yoktur; yazı tipleri sistemden gelir.
- `navigator.userAgentData` yalnızca doğru ISO mimarisini seçmek için
  **cihazda** okunur; ağa gönderilmez.
- İndirme bağlantılarında izleme parametresi yoktur.
- Barındırma sağlayıcısı standart erişim günlükleri tutabilir; bunlar
  pazarlama/profilleme için kullanılmaz.

## Sınırlar

- Üçüncü taraf uygulamalar (Firefox, KeePassXC) kendi politikalarına tabidir.
- Üretici yazılımı (Wi-Fi, GPU) cihaz donanımında çalışır; bazı sürücüler
  donanıma telemetri gönderebilir.
- ISS ve ağ yöneticisi bağlantı üst verisini görebilir.
- Güncelleme ve DNS gibi hizmetlerde IP adresi zorunlu olarak görünür.

## İletişim

Gizlilik soruları: `privacy@oxygenforge.example` (yayından önce gerçek adresle
değiştir). Güvenlik bildirimleri için `SECURITY.md`.
