# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

同人音声制作向けの台本作成支援Webツール集。サーバーサイドロジックは持たず、PHPはテンプレートのincludeのみに使用し、すべての処理はクライアントサイドJavaScriptで完結する。

## 開発・動作確認

ビルドプロセス・パッケージ管理・テストフレームワークは存在しない。PHPの`include`が動けば機能するため、PHPが使えるローカルサーバー（例: `php -S localhost:8000`）で確認できる。

## アーキテクチャ

### ページ構成

PHPファイルはすべて `$pageTitle` を設定して `header.php` / `menu.php` / `footer.php` をincludeするだけのHTMLテンプレート。サーバーサイド処理は一切ない。

| ディレクトリ | 内容 |
|---|---|
| `page-main/` | メインツール4本（extract / format / multi / plot） |
| `page-tools/` | サブツール5本（imagejoin / imageresize / graffiti / bpmtest / dltextbhecker） |
| `page-help/` | ヘルプ・正規表現ガイド・プライバシーポリシー |
| `page-home/` | トップ・お問い合わせ |
| `script-tool/` | JS（maintools.js / common.js） |
| `TODO/` | 内部TODOリスト管理 |
| `0000exclusion/` | デプロイ除外ファイル |

### JavaScriptの構造

`script-tool/maintools.js`（約2600行）がすべてのメインツールのロジックを担う単一モノリシックファイル。どのページで実行されているかをDOMの要素存在確認で判定する（例: `document.getElementById('plotPage')` があればプロットページ専用初期化）。

`script-tool/common.js` は上部ナビゲーションの開閉とフッターのDLsiteアフィリエイトバナー生成のみ担当。

### 状態管理（localStorage）

ユーザー設定はすべてlocalStorageに保存される：

- `rules_ext` — セリフのみ抽出ツールの削除ルール一覧（JSON）
- `rules_fmt` — 台本整形（1人）のハイライト・書式ルール一覧（JSON）
- `rules_multi` — 複数ヒロイン整形のルール一覧（JSON）
- `auto_save_{pathname}_{elementId}` — textareaの内容を自動保存

ルールのデフォルト値は `maintools.js` の `defaultExtract` / `defaultFormat` 定数で定義されており、`resetToDefault()` で復元できる。

### ルールシステム

各ツールのルールは正規表現パターンを持つオブジェクト配列。SortableSJにより上から優先順位順にドラッグで並び替えられる。

- `extract`ルール: `{ label, pattern, active, isSpecial }` — マッチした行を削除
- `format`/`multi`ルール: `{ label, pattern, active, bgColor, fgColor, bold, fontSize, isSpecial }` — マッチした行をスタイル付きプレビュー表示

`isSpecial: true` かつ `pattern === 'delete_comment'` または `'format_comment'` のルールは `%%%〜%%%` 囲みブロックを特殊処理する。

### 台本の書式規約（ドメイン知識）

このツールが扱う台本には以下の記法がある：

| 記号 | 意味 |
|---|---|
| `＝＝＝…＝＝＝` | トラック区切り装飾 |
| `トラック〇〇` / `Track〇〇` | トラック名 |
| `%%%〜%%%` | コメント・削除ブロック |
| `◆SE：` | 効果音指示 |
| `◆SE方向：` | 効果音方向指示 |
| `■編集：` | 編集指示 |
| `◇音声：` | 音声方向・距離指示 |
| `□演技：` | 演技指示 |
| `＊〇〇　秒/回` | アドリブ指示 |
| `【同時　ここから/ここまで】` | 同時録音セクション |
| `//キャラ名：` | 話者（複数ヒロイン整形で使用） |
| `（）` `【】` `《》` `〔〕` | ト書き・補足（抽出時に削除対象） |

### 複数ヒロイン整形の色分け

`heroineTargetLabels`配列に含まれるラベル名のルールだけにヒロイン色（最大10色）が適用される。新しいルールを追加してヒロインカラーを当てたい場合はこの配列への追加が必要。

### 外部CDN依存（header.php経由）

- `docx@7.1.0` — Word出力
- `FileSaver.js 2.0.5` — ファイルダウンロード
- `SortableJS 1.15.0` — ルールのドラッグ並び替え
- `Google Material Symbols` / `Noto Sans JP` — アイコン・フォント

### フッターのDLsiteバナー

Googleスプレッドシート公開CSVから作品情報を取得し、DLsiteアフィリエイトリンクを動的生成する。アフィリエイトIDは `common.js` の `affiliateId` 変数で管理。
