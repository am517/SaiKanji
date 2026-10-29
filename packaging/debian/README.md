# Debian packages

`build-debs.sh` builds one `.deb` per SaiKanji Homebrew cask in [am517/homebrew-tap](https://github.com/am517/homebrew-tap)
(`fonts-saikanji-<variant>_<version>_all.deb`, Architecture `all`, so amd64 and arm64 alike). Each font is
downloaded from this repo's GitHub release, checked against the cask's sha256, and installed to
`/usr/share/fonts/truetype/saikanji/`.

```sh
git clone https://github.com/am517/homebrew-tap /tmp/tap
packaging/debian/build-debs.sh /tmp/tap out        # VERSION=0.021 for a release the casks don't name yet
sudo apt install ./out/fonts-saikanji-black-grid_0.020_all.deb
```

The `debs` workflow runs this on release tags and attaches the `.deb`s and `SHA256SUMS-deb.txt` to the release.
