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
      <h1>台本整形の書き方</h1>
    </div>
    <div id="format-page">

      <div class="split-container" style="display: flex; flex-wrap: wrap; gap: 20px;">
        <div class="editor-pane" style="flex: 1; min-width: 300px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-weight: bold; color: #2c3e50;">入力エディタ</label>
            <div class="char-count" style="font-size: 0.85rem; color: #666;">
              入力文字数: <span id="countFormat">0</span>
            </div>
          </div>
          <textarea id="textFormat"
            oninput="updateCharCount('textFormat', 'countFormat'); runPreview();"
            placeholder="台本を貼り付けてください..."></textarea>
        </div>

        <div class="preview-pane" style="flex: 1; min-width: 300px;">
          <div style="margin-bottom: 14px;">
            <label style="font-weight: bold; color: #2c3e50;">プレビュー</label>
          </div>
          <div id="previewArea" class="preview-box"></div>
        </div>
      </div>
    </div>

    <div class="card">

      <details open>
        <summary style="cursor: pointer; font-weight: bold; color: #2c3e50;">⚙️ ハイライト・書式設定（上から優先処理されます）</summary>
        <div class="details-content" style="padding-top: 15px;">
          <div id="ruleListFormat"></div>

          <div class="btn-group" style="margin-top: 15px;">
            <button class="btn-primary" onclick="addNewRule('fmt')">+ 項目追加</button>
            <button class="btn-primary" onclick="saveSettings('fmt')">設定を保存</button>
            <button class="btn-danger" onclick="resetToDefault('fmt')">デフォルトに戻す</button>
          </div>
        </div>
      </details>
    </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>