| 🇺🇸 [English](README.md) | 🇯🇵 日本語 |
|-|-|

# SaiKanji (彩漢字)

**漢字の学習と表示に最適な、美しいカラーの筆順フォント。**

SaiKanjiは、優れた[KanjiVG](https://kanjivg.tagaini.net/)のストロークデータを、モダンで鮮やかなカラーフォントに変換します。各ストロークは滑らかなグラデーションで個別に色付けされ、筆順番号がフォントに直接埋め込まれています。教育、フラッシュカード、アプリ、デザイン作業に最適です。

![SaiKanji プレビュー](saikanji.jpg)

## なぜSaiKanjiなのか？

ほとんどの漢字フォントはモノクロか、筆順を表示するために外部ツールが必要です。SaiKanjiは**色**と**筆順**の両方をフォント自体に直接組み込むことで、ウェブサイト、ドキュメント、デザインソフト、Ankiなどで一貫して動作し、追加のプラグインは一切不要です。

## 特徴

- **各ストロークごとの色付け**（滑らかなグラデーション） — Regular、Light、Balanced、Contrast、Spectrumの各スタイル
- **内蔵の筆順番号** — ストロークと重ならないよう賢く配置
- **オプションの文字グリッド**（外枠＋十字） — 視覚的な参照に便利
- 通常のフォントとして動作 — 特別なソフトウェア不要
- **Gradient**（グラデーション）と**Solid**（単色）の両バージョン
- 幅広い互換性を実現するハイブリッドフォント技術（COLR + SVG）
- 高品質でオープンな[KanjiVG](https://kanjivg.tagaini.net/)データセットを基に作成

## 利用可能なバリエーション

SaiKanjiには多くのスタイルがあり、用途に合わせて選べます：

- **カラー スタイル**：Regular、Regular Light、Balanced、Balanced Light、Contrast、Contrast Light、Spectrum、Spectrum Light
- **Gradient** または **Solid** の塗りつぶし
- **グリッドあり** または **グリッドなし**
- シンプルなモノクローム用フォールバックとして **Black** Regular スタイル

これにより、学習用・デザイン用・アクセシビリティなど、さまざまな用途に対応できます。

## プレビュー

ライブデモはこちらでご覧いただけます：[saikanji.moore.is](https://saikanji.moore.is/)

## インストール方法

### デスクトップでの使用

#### 手動インストール
1. [Releases](https://github.com/am517/SaiKanji/releases) ページから最新リリースの `.ttf` ファイルをダウンロード
2. システムに `.ttf` ファイルをインストール

#### Homebrewを使用する場合
1. [SaiKanji Tap](https://github.com/am517/homebrew-tap) をインストール
```zsh
brew tap am517/tap
brew trust am517/tap
```
2. フォントをインストール
```bash
brew search font-saikanji
brew install font-saikanji-balanced-gradient-grid
```

### Webで使う場合
`.woff2` バージョンをダウンロードし、プロジェクトに `@font-face` で組み込みます。  
リリースファイル名はドット区切りのスタイル名になっています。例：

```css
@font-face {
  font-family: "SaiKanji Balanced Gradient Grid";
  src: url("SaiKanji.Balanced.Gradient.Grid.woff2") format("woff2");
}
```

## 開発に関する補足

このプロジェクトは、AIコーディングモデル（主に **Grok 4** と **GPT-5.5**）の多大な支援を受けて開発されました。AIがコードの大部分を生成しましたが、高レベルの方向性、アーキテクチャ上の決定、最終的な出力の品質レビューはすべて私自身が行いました。

重点は常に「最終的なフォントの品質」に置かれており、コードの美しさやエレガントさは二の次でした。そのため、コード自体は表面的なレビューしか受けておらず、リリースされたフォントの視覚的・機能的な品質は徹底的に評価されています。

## 開発者・高度なテーマ設定向け

SaiKanjiはテーマ設定を考慮して設計されています。開発中は、各ストロークとグラデーションのストップが色スロットを参照する形になっていました（当初は `--color0`、`--color1` などのCSSカスタムプロパティを使用）。

ただし、現在のリリースでは色はビルド時に解決されるため：

- CSS変数で個々のストロークの色を上書きすることはできません。
- **COLRバージョン**のフォントは、対応ブラウザで [`font-palette`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-palette) CSSプロパティをサポートしており、色パレット全体の入れ替え・カスタマイズが可能です。

細かなストロークごとの色制御をCSSで実現したい場合は、issueを開いていただければ将来的に対応を検討します。  
ほとんどの用途（Anki、ウェブサイト、ドキュメント、デザイン作業）では、付属のカラースキームで十分に対応できます。

## ライセンス

SaiKanjiは [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/) の下で提供されています。  
詳細は [LICENSE.md](LICENSE.ja.md) をご覧ください。

## 帰属表示

このフォントは **[KanjiVG](https://kanjivg.tagaini.net/)** のデータに基づく派生作品です。  
© 2009–2026 Ulrich Apel（CC BY-SA 3.0 でリリース）

**推奨される帰属表示：**  
> SaiKanji by Adam Moore is derived from KanjiVG by Ulrich Apel (CC BY-SA 3.0) and is licensed under CC BY-SA 4.0.

（日本語訳例）  
> Adam Moore による SaiKanji は、Ulrich Apel による KanjiVG（CC BY-SA 3.0）を基に作成され、CC BY-SA 4.0 でライセンスされています。

kanji-colorize（Ankiプラグイン）および Playwrite フォントファミリーからもインスピレーションを受けています。

## フィードバック・貢献

バグを発見した、機能のアイデアがある、新しいカラースキームを提案したい場合は、[issue tracker](https://github.com/am517/SaiKanji/issues) で issue を開くか、adam@moore.is までメールしてください。

## 関連プロジェクト

- **[KanjiVG](https://kanjivg.tagaini.net/)** — このプロジェクトの基盤となっている、優れたオープンな漢字筆順ベクターデータセット。
- **[kanji-colorize](https://github.com/cayennes/kanji-colorize)** — KanjiVGデータからカラーの筆順図を普及させたAnkiプラグイン。
- **[Playwrite](https://github.com/TypeTogether/Playwrite)** — 教育的な手書きモデルに着想を得たフォントファミリー（全体的なアプローチに影響）。

## 謝辞

KanjiVGを作成・維持してくださった Ulrich Apel 氏、kanji-colorize と Playwrite の作成者の皆様に心より感謝いたします。
