<?php $pageTitle = "セリフのみ抽出"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">
    <div class="content-header">
      <h1>① セリフのみ抽出</h1>
    </div>

    <div class="card">
      <div class="replace-section" style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
        <strong style="font-size: 0.9rem;">文字列置換:</strong>
        <input type="text" id="replaceBefore" class="replace-input" placeholder="置換前" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
        <span>→</span>
        <input type="text" id="replaceAfter" class="replace-input" placeholder="置換後" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
        <button class="btn-primary" onclick="executeReplace()">置換実行</button>
      </div>

      <div class="editor-container">
        <textarea id="textExtract"
          oninput="updateCharCount('textExtract', 'countExtract')"
          placeholder="台本を貼り付けてください..."
          style="width: 100%; min-height: 300px;"></textarea>
        </textarea>
        <div class="char-count">
          文字数: <span id="countExtract">0</span>
        </div>
      </div>

      <div class="btn-group" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
        <button class="btn-primary" onclick="applyExtract()">セリフのみ抽出実行</button>
        <button class="btn-primary" onclick="shrinkBlankLines('textExtract')">空行を1行に整理</button>
        <button class="btn-primary" onclick="exportToWord()">Wordに出力</button>
        <button class="btn-danger" onclick="clearData('extract')">データクリア</button>
      </div>
    </div>

    <div class="card">
      <details>
        <summary style="cursor: pointer; font-weight: bold; color: #2c3e50;">⚙️ 削除ルール設定</summary>
        <div class="details-content" style="padding-top: 15px;">
          <div class="extract-notice" style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">💡 削除ルールの注意点</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.85em; color: #555; line-height: 1.6;">
              <li><code>%%%</code> と <code>%%%</code> で囲まれた部分は、<strong>複数行にわたってすべて削除</strong>されます。</li>
              <li style="margin-top: 5px;">
                <small style="display: block; background: #e9ecef; padding: 5px 10px; border-radius: 3px; color: #777;">
                  入力例：<br>
                  %%% この区間は削除されます %%%
                </small>
              </li>
            </ul>
          </div>
          <div id="ruleListExtract"></div>
          <button class="btn-primary" style="margin-top:10px;" onclick="addNewRule('ext')">+ 項目追加</button>
          <button class="btn-primary" onclick="saveSettings('ext')">設定を保存</button>
          <button class="btn-danger" onclick="resetToDefault('ext')">デフォルトに戻す</button>
        </div>
      </details>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>