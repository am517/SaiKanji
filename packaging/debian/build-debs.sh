#!/bin/sh
# Build one Architecture: all .deb per SaiKanji Homebrew cask in am517/homebrew-tap (same names).
# Usage: build-debs.sh TAP_DIR [OUT_DIR]   (VERSION=x.yyy builds another release's fonts)
# The cask sha256 is checked when the cask's version is the one being built.
set -eu
TAP=${1:?usage: build-debs.sh TAP_DIR [OUT_DIR]}; OUT=${2:-$PWD/out}; mkdir -p "$OUT"
for c in "$TAP"/Casks/font-saikanji-*.rb; do
  name=$(basename "$c" .rb); pkg="fonts-${name#font-}"
  cver=$(sed -n 's/^ *version "\(.*\)"/\1/p' "$c"); ver=${VERSION:-$cver}; sha=$(sed -n 's/^ *sha256 "\(.*\)"/\1/p' "$c")
  file=$(sed -n 's/^ *font "\(.*\)"/\1/p' "$c"); desc=$(sed -n 's/^ *desc "\(.*\)"/\1/p' "$c")
  url=$(sed -n 's/^ *url "\(.*\)"/\1/p' "$c" | sed "s/#{version}/$ver/")
  mkdir -p "dl/$ver"; [ -f "dl/$ver/$file" ] || curl -fsSL -o "dl/$ver/$file" "$url"
  if [ "$ver" = "$cver" ]; then echo "$sha  dl/$ver/$file" | sha256sum -c --quiet; fi
  root=$(mktemp -d); mkdir -p "$root/DEBIAN" "$root/usr/share/fonts/truetype/saikanji" "$root/usr/share/doc/$pkg"
  install -m644 "dl/$ver/$file" "$root/usr/share/fonts/truetype/saikanji/"
  printf 'SaiKanji font %s, from %s\nhttps://saikanji.moore.is/\n' "$name" "$url" > "$root/usr/share/doc/$pkg/README"
  cat > "$root/DEBIAN/control" <<CTL
Package: $pkg
Version: $ver
Architecture: all
Maintainer: Adam Moore <am517@users.noreply.github.com>
Section: fonts
Priority: optional
Homepage: https://saikanji.moore.is/
Description: $desc
 SaiKanji (彩漢字): a colorful, stroke-order-aware font based on KanjiVG.
CTL
  printf '#!/bin/sh\nset -e\ncommand -v fc-cache >/dev/null && fc-cache -f /usr/share/fonts/truetype/saikanji || true\n' > "$root/DEBIAN/postinst"
  cp "$root/DEBIAN/postinst" "$root/DEBIAN/postrm"; chmod 755 "$root/DEBIAN/postinst" "$root/DEBIAN/postrm"
  dpkg-deb --root-owner-group -Zxz -b "$root" "$OUT/${pkg}_${ver}_all.deb" >/dev/null; rm -rf "$root"
done
ls "$OUT" | wc -l
