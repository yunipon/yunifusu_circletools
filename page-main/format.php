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
    <div id="format-page">
      <div class="card">
        <div class="editor-header">
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <button class="btn-primary" onclick="runPreview()">プレビュー更新</button>
            <button class="btn-primary" onclick="shrinkBlankLines('textFormat')">空行を1行に整理</button>
            <button class="btn-primary" onclick="exportToWord()">Wordに出力</button>
            <button class="btn-danger" onclick="clearData('fmt')">データクリア</button>
          </div>

          <div id="formatDialogueCount" style="font-size: 0.9em; color: #666; background: #f8f9fa; padding: 10px 15px; border-radius: 6px; border: 1px solid #e9ecef; min-width: 250px;">
            <strong>セリフのみカウント：</strong><span id="dialogueCharCount" style="font-weight: bold; color: #2c3e50;">0</span> 文字
            <small style="display: block; font-size: 0.8em; color: #999; margin-top: 2px;">
              ※「①セリフのみ抽出」の保存済み条件を適用
            </small>
          </div>
        </div>

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
          <summary style="cursor: pointer; font-weight: bold; color: #2c3e50;">⚙️ ハイライト・書式設定</summary>
          <div class="details-content" style="padding-top: 15px;">
            <div id="ruleListFormat"></div>
            <button class="btn-primary" onclick="addNewRule('fmt')">+ 項目追加</button>
            <button class="btn-primary" onclick="saveSettings('fmt')">設定を保存</button>
            <button class="btn-danger" onclick="resetToDefault('fmt')">デフォルトに戻す</button>
          </div>
        </details>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>