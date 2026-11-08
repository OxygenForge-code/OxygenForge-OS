#!/usr/bin/env bash
# OxygenForgeOS ISO build entry point.
#
# Usage:
#   sudo ./build.sh desktop
#   sudo ./build.sh server
#   sudo ARCH=arm64 ./build.sh desktop
#
# live-build needs root because it creates filesystems and chroots. The script
# refuses to elevate itself; run it through sudo deliberately.
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# Git checkouts made on Windows may lose the executable bit; live-build needs
# the hooks and auto/config to stay executable.
chmod +x build.sh auto/config scripts/*.sh \
  config/hooks/normal/*.hook.chroot config/hooks/binary/*.hook.binary \
  config/includes.chroot/usr/local/bin/* config/includes.chroot/usr/libexec/*

EDITION="${1:-desktop}"
case "$EDITION" in
  desktop|server) ;;
  *)
    echo "Kullanım: sudo ./build.sh <desktop|server>" >&2
    exit 2
    ;;
esac

# Normalise the host architecture to Debian's names, and keep the website's
# x86_64/arm64 naming for the output filename.
HOST_ARCH="$(uname -m)"
ARCH="${ARCH:-$HOST_ARCH}"
case "$ARCH" in
  x86_64|amd64)
    ARCH=amd64
    SITE_ARCH=x86_64
    ;;
  aarch64|arm64)
    ARCH=arm64
    SITE_ARCH=arm64
    ;;
  *)
    echo "Desteklenmeyen mimari: $ARCH" >&2
    exit 2
    ;;
esac

VERSION="$(tr -d '[:space:]' < VERSION)"
[ -n "$VERSION" ] || { echo "VERSION dosyası boş." >&2; exit 1; }

if [ "$(id -u)" -ne 0 ]; then
  echo "Bu betik root ister. Şu şekilde çalıştır:" >&2
  echo "  sudo ./build.sh $EDITION" >&2
  exit 1
fi

for cmd in lb debootstrap mksquashfs xorriso; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Eksik araç: $cmd" >&2
    echo "docs/BUILDING.md içindeki paket listesine bak." >&2
    exit 1
  fi
done

if [ "$ARCH" != "amd64" ] && [ "$HOST_ARCH" != "aarch64" ] && [ "$HOST_ARCH" != "arm64" ]; then
  echo "UYARI: $ARCH hedefi, $HOST_ARCH ana makinede çapraz derleniyor." >&2
  echo "       live-build arm64 için arm64 çalışma zamanı ve uygun önyükleyici ister." >&2
fi

# live-build + apt cache + squashfs need a comfortable amount of free space.
AVAIL_KB="$(df -Pk "$ROOT" | awk 'NR==2 {print $4}')"
if [ "${AVAIL_KB:-0}" -lt 20971520 ]; then
  echo "En az 20 GB boş disk alanı gerekli (mevcut: $((AVAIL_KB / 1024)) MB)." >&2
  exit 1
fi

echo "==> OxygenForgeOS $VERSION / $EDITION / $ARCH"

# Package lists are assembled per build. Keeping the selected lists out of the
# tracked config tree makes the edition switch explicit and reproducible.
rm -rf config/package-lists
mkdir -p config/package-lists
cp profiles/base/package-lists/*.list.chroot config/package-lists/
cp profiles/"$EDITION"/package-lists/*.list.chroot config/package-lists/
cp profiles/"$ARCH"/package-lists/*.list.chroot config/package-lists/
touch config/package-lists/.gitkeep

export OF_EDITION="$EDITION"
export OF_ARCH="$ARCH"
export OF_SITE_ARCH="$SITE_ARCH"
export OF_VERSION="$VERSION"
# Pin the timestamp when you need to reproduce a build; otherwise use now.
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$(date +%s)}"

mkdir -p out
echo "==> Önceki derleme artıkları temizleniyor"
lb clean --purge >/dev/null 2>&1 || true

echo "==> lb config"
lb config

LOG="out/build-${EDITION}-${ARCH}.log"
echo "==> lb build (günlük: $LOG)"
lb build 2>&1 | tee "$LOG"

ISO_SRC="live-image-${ARCH}.hybrid.iso"
if [ ! -f "$ISO_SRC" ]; then
  ISO_SRC="$(find . -maxdepth 1 -name '*.hybrid.iso' -print -quit)"
fi
if [ -z "$ISO_SRC" ] || [ ! -f "$ISO_SRC" ]; then
  echo "ISO üretilemedi; günlüğü incele: $LOG" >&2
  exit 1
fi

ISO_NAME="OxygenForgeOS-${EDITION}-${SITE_ARCH}.iso"
mv -- "$ISO_SRC" "out/$ISO_NAME"

(
  cd out
  sha256sum "$ISO_NAME" > "$ISO_NAME.sha256"
)

ISO_SHA="$(cut -d' ' -f1 "out/$ISO_NAME.sha256")"
ISO_BYTES="$(wc -c < "out/$ISO_NAME" | tr -d '[:space:]')"
ISO_SIZE="$(du -h "out/$ISO_NAME" | cut -f1 | tr -d '[:space:]')"

cat > "out/${ISO_NAME%.iso}.json" <<EOF
{
  "edition": "$EDITION",
  "arch": "$SITE_ARCH",
  "version": "$VERSION",
  "file": "$ISO_NAME",
  "size": "$ISO_SIZE",
  "bytes": $ISO_BYTES,
  "sha256": "$ISO_SHA",
  "built_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo
echo "ISO hazır:"
echo "  out/$ISO_NAME"
echo "  Boyut : $ISO_SIZE"
echo "  SHA256: $ISO_SHA"
echo
echo "Sonraki adım: docs/RELEASE.md ve site config.js güncellemesi."
