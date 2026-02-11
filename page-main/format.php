<?php $pageTitle = "台本整形"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">
    <div class="content-header">
      <h1>② 台本整形（1人）</h1>
    </div>

    <div class="card">
      <div class="editor-container">
        <textarea id="textFormat"
          oninput="updateCharCount('textFormat', 'countFormat'); runPreview();"
          placeholder="台本を貼り付けてください..."
          style="width: 100%; min-height: 300px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
        <div class="char-count" style="text-align: right; font-size: 0.9rem; color: #666; margin-top: 5px;">
          文字数: <span id="countFormat">0</span>
        </div>
      </div>

      <div class="btn-group" style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
        <button class="btn-primary" onclick="runPreview()">プレビュー更新</button>
        <button class="btn-primary" onclick="shrinkBlankLines('textFormat')">空行を1行に整理</button>
        <button class="btn-primary" onclick="exportToWord()">Wordに出力</button>
        <button class="btn-danger" onclick="clearData('fmt')">データクリア</button>

        <div id="formatDialogueCount" style="font-size: 0.9em; color: #666; background: #f8f9fa; padding: 10px; border-radius: 6px;">
          セリフのみカウント：<span id="dialogueCharCount">0</span> 文字
          <small style="display: block; font-size: 0.8em; color: #999;">
            ※「①セリフのみ抽出」の保存済み条件を適用
          </small>
        </div>
      </div>
    </div>

    <div class="card">
      <details>
        <summary style="cursor: pointer; font-weight: bold; color: #2c3e50;">⚙️ ハイライト・書式設定</summary>
        <div class="details-content" style="padding-top: 15px;">
          <div id="ruleListFormat"></div>
          <button class="btn-primary" onclick="addNewRule('fmt')">+ 項目追加</button>
          <button class="btn-primary" onclick="saveSettings('fmt')">設定を保存</button>
          <button class="btn-danger" onclick="resetToDefault('fmt')">デフォルトに戻す</button>
        </div>
      </details>
    </div>

    <div class="card">
      <h4 style="margin-top: 0;">プレビュー</h4>
      <div id="previewArea" class="preview-box" style="background: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; min-height: 100px; white-space: pre-wrap;"></div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>