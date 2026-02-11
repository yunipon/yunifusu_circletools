<?php $pageTitle = "複数ヒロイン整形"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">
    <div class="content-header">
      <h1>③ 複数ヒロイン整形</h1>
    </div>

    <div class="card" style="background:#fff3cd; border: 1px solid #ffeeba;">
      <p style="margin:0 0 10px 0; font-weight:bold;">ヒロイン名設定</p>
      <div id="heroineInputs" class="heroine-grid"></div>
      <button id="addHeroineBtn" class="btn-primary" onclick="addHeroineInput()" style="margin-top:10px;">
        + 人数を追加 (最大5名)
      </button>
    </div>

    <div class="card">
      <div class="editor-container">
        <textarea id="textMulti"
          oninput="updateCharCount('textMulti', 'countMulti'); runMultiPreview();"
          placeholder="複数人の台本を貼り付けてください..."
          style="width: 100%; min-height: 300px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
        <div class="char-count" style="text-align: right; margin-top: 5px; color: #666;">
          文字数: <span id="countMulti">0</span>
        </div>
      </div>

      <div class="btn-group" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
        <button class="btn-primary" onclick="runMultiPreview()">プレビュー更新</button>
        <button class="btn-primary" onclick="exportToWord()">Wordに出力</button>
        <button class="btn-danger" onclick="clearData('multi')">データクリア</button>

        <div id="multiDialogueCount" style="font-size: 0.9em; color: #666; background: #f8f9fa; padding: 10px; border-radius: 6px;">
          合計セリフ：<span id="dialogueCharCountMulti">0</span> 文字
          <span style="font-size: 0.8em; color: #aaa;">（抽出ルール適用）</span>
        </div>
      </div>

      <div id="characterBreakdown" style="margin-top: 15px; font-size: 0.85em; color: #555; display:none; background: #fefefe; padding: 12px; border: 1px dashed #ddd; border-radius: 6px;">
      </div>
    </div>

    <div class="card">
      <details>
        <summary style="cursor: pointer; font-weight: bold;">⚙️ 複数ヒロイン専用：書式設定</summary>
        <div class="details-content" style="padding-top: 15px;">
          <div id="ruleListMulti"></div>
          <button class="btn-primary" onclick="addNewRule('multi')">+ 項目追加</button>
          <button class="btn-primary" onclick="saveSettings('multi')">設定を保存</button>
          <button class="btn-danger" onclick="resetToDefault('multi')">デフォルトに戻す</button>
        </div>
      </details>
    </div>

    <div class="card">
      <h4>プレビュー</h4>
      <div id="previewAreaMulti" class="preview-box" style="background: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; min-height: 200px; white-space: pre-wrap;"></div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>