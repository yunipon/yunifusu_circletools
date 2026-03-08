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
      <details class="card" open>
        <summary style="margin-bottom: 10px; font-weight: bold; color: #2c3e50; font-size: 0.9rem; background: white;">📋 クイックコピー</summary>
        <div id="copyPalette" style="display: flex; flex-wrap: wrap; gap: 8px;">
          <button class="btn-copy btn-symbol" onclick="copyToClipboard('゛')">゛</button>
          <button class="btn-copy btn-symbol" onclick="copyToClipboard('♡')">♡</button>

          <button class="btn-copy" onclick="copyToClipboard('%%%')">%%%</button>
          <button class="btn-copy" onclick="copyToClipboard('＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝\nトラック\n＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝＝＊＝')">トラック+装飾</button>
          <button class="btn-copy" onclick="copyToClipboard('トラック')">トラック</button>
          <button class="btn-copy" onclick="copyToClipboard('◆SE：')">◆SE：</button>
          <button class="btn-copy" onclick="copyToClipboard('◆SE：　ここから')">◆SE：始</button>
          <button class="btn-copy" onclick="copyToClipboard('◆SE：　ここまで')">◆SE：終</button>
          <button class="btn-copy" onclick="copyToClipboard('◆SE方向：')">◆SE方向：</button>
          <button class="btn-copy" onclick="copyToClipboard('■編集：')">■編集：</button>
          <button class="btn-copy" onclick="copyToClipboard('【同時　ここから】')">【同時】始</button>
          <button class="btn-copy" onclick="copyToClipboard('【同時　ここまで】')">【同時】終</button>
          <button class="btn-copy" onclick="copyToClipboard('（）')">（）</button>
          <button class="btn-copy" onclick="copyToClipboard('※補足：')">※補足：</button>
          <button class="btn-copy" onclick="copyToClipboard('《状況：》')">《状況：》</button>
          <button class="btn-copy" onclick="copyToClipboard('＊　秒')">＊秒</button>
          <button class="btn-copy" onclick="copyToClipboard('＊　回')">＊回</button>
          <button class="btn-copy" onclick="copyToClipboard('□演技：')">□演技：</button>

          <div id="DirDistButtons" style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button class="btn-copy" onclick="copyToClipboard('◇音声：')">◇音声：</button>
            <button class="btn-copy btn-Dir" onclick="copyToClipboard('正面 ')">正面</button>
            <button class="btn-copy btn-Dir" onclick="copyToClipboard('右 ')">右</button>
            <button class="btn-copy btn-Dir" onclick="copyToClipboard('左 ')">左</button>
            <button class="btn-copy btn-Dir" onclick="copyToClipboard('上 ')">上</button>
            <button class="btn-copy btn-Dir" onclick="copyToClipboard('下 ')">下</button>

            <button class="btn-copy btn-Dist" onclick="copyToClipboard('普通')">普通</button>
            <button class="btn-copy btn-Dist" onclick="copyToClipboard('遠い')">遠い</button>
            <button class="btn-copy btn-Dist" onclick="copyToClipboard('近い')">近い</button>
            <button class="btn-copy btn-Dist" onclick="copyToClipboard('密着')">密着</button>

            <button class="btn-copy" onclick="copyToClipboard('有声')">有声</button>
            <button class="btn-copy" onclick="copyToClipboard('無声')">無声</button>
          </div>

          <div id="dynamicNameButtons" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
        </div>
      </details>
      <div class="editor-container">
        <div class="editor-left">
          <div class="card">
            <div class="editor-pane" style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="font-weight: bold; color: #2c3e50;">台本入力</label>
              </div>

              <div class="textarea-wrapper">
                <div id="lineNumbers" class="line-numbers"></div>
                <textarea id="textFormat"
                  oninput="updateCharCount('textFormat', 'countFormat'); runPreview(); updateNameButtons('textFormat'); updateLineNumbers()"
                  onscroll="syncScroll()"
                  placeholder="台本を貼り付けてください...">
                </textarea>
              </div>
            </div>
            <div class="char-count" style="font-size: 0.85rem; color: #666; margin: 5px 0px;">
              入力文字数: <span id="countFormat">0</span>
            </div>
            <div id="formatDialogueCount" style="font-size: 0.9em; color: #666; background: #f8f9fa; padding: 10px 15px; border-radius: 6px; border: 1px solid #e9ecef; min-width: 250px;">
              <strong>セリフのみカウント：</strong><span id="dialogueCharCount" style="font-weight: bold; color: #2c3e50;">0</span> 文字
              <small style="display: block; font-size: 0.8em; color: #999; margin-top: 2px;">
                ※「①セリフのみ抽出」の保存済み条件を適用
              </small>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <strong>台本チェック</strong>
            <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
              <span class="tooltip" data-tooltip="「ここから」と「ここまで」のペアが揃っているか確認します">
                <button class="btn-secondary" onclick="runScriptCheck()">始終チェック</button>
              </span>
              </span>
              <span class="tooltip" data-tooltip="「＊」から始まるアドリブ指示を抽出します">
                <button class="btn-secondary" onclick="extractAdlibCommands()">「＊」抽出</button>
              </span>
            </div>
            <textarea id="textCheck" placeholder="チェックの結果が出力されます"></textarea>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 10px;">
              <button class="btn-primary" onclick="exportToWord()">Word出力</button>
              <button class="btn-primary" onclick="exportTextAreaToTxt('textFormat', '一人用整形')">txt出力</button>
              <button class="btn-danger" onclick="clearData('fmt')">データクリア</button>
            </div>
          </div>
        </div>
        <div class="editor-right">
          <div class="card">
            <div class="preview-pane" style="flex: 1; min-width: 300px;">
              <div style="margin-bottom: 14px;">
                <label style="font-weight: bold; color: #2c3e50;">プレビュー</label>
              </div>
              <div id="previewArea" class="preview-box"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="btn-group">
          <button class="btn-primary" onclick="addNewRule('fmt')">+ 項目追加</button>
          <button class="btn-primary" onclick="saveSettings('fmt')">設定を保存</button>
          <button class="btn-danger" onclick="resetToDefault('fmt')">デフォルトに戻す</button>
        </div>
        <details open>
          <summary style="cursor: pointer; font-weight: bold; color: #2c3e50;">⚙️ ハイライト・書式設定（上から優先処理されます）</summary>
          <div class="details-content" style="padding-top: 15px;">
            <div id="ruleListFormat"></div>
          </div>
        </details>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>