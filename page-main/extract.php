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
    <div class="editor-container">
      <div class="editor-left">
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

        <div class="card">
          <strong>文字列置換</strong>
          <div class="replace-section" style="gap: 10px; align-items: center;">
            <input type="text" id="replaceBefore" class="replace-input" placeholder="置換前">
            <span>→</span>
            <input type="text" id="replaceAfter" class="replace-input" placeholder="置換後">
            <button class="btn-primary" onclick="executeReplace()" style="margin: 10px 0px;">置換実行</button>
          </div>

          <div class="box">
            <h4>台本貼り付け</h4>
            <div class="textarea-wrapper">
              <div id="lineNumbers" class="line-numbers"></div>
              <textarea id="textExtract"
                oninput="updateCharCount('textExtract', 'countExtract'); updateNameButtons('textExtract'); updateLineNumbers()"
                onscroll="syncScroll()"
                placeholder="台本を貼り付けてください...">
                </textarea>
            </div>
            <div class="char-count">
              文字数: <span id="countExtract">0</span>
            </div>
          </div>
          <strong>台本チェック</strong>
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <span class="tooltip" data-tooltip="「ここから」と「ここまで」のペアが揃っているか確認します">
              <button class="btn-secondary" onclick="runScriptCheck()">始終チェック</button>
            </span>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <div class="btn-group" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
            <button class="btn-primary" onclick="applyExtract()">セリフのみ抽出</button>
            <button class="btn-primary" onclick="shrinkBlankLines('textExtract')">空行を1行に整理</button>
            <button class="btn-primary" onclick="removeAllBlankLines('textExtract')">空白改行完全削除</button>
            <button class="btn-primary" onclick="exportToWord()">Word出力</button>
            <button class="btn-primary" onclick="exportTextAreaToTxt('textExtract', 'セリフ抽出')">txt出力</button>
            <button class="btn-danger" onclick="clearData('extract')">データクリア</button>
          </div>

          <div class="box" style="padding-top: 15px;">
            <textarea id="textExtractBefore"
              oninput="updateCharCount('textExtractBefore', 'countExtractBefore')"
              placeholder="整形実行前の台本、チェックの結果が出力されます"
              style="width: 100%; min-height: 300px;"></textarea>
            </textarea>
            <div class="char-count">
              文字数: <span id="countExtractBefore">0</span>
            </div>
          </div>

        </div>
      </div>
      <div class="editor-right">
        <div class="card">
          <details open>
            <summary style="cursor: pointer; font-weight: bold; color: #2c3e50;">⚙️ 削除ルール設定（上から優先処理されます）</summary>
            <div class="details-content" style="padding-top: 15px;">
              <div class="extract-notice" style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; border-radius: 4px;">
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
              <div style="margin:10px 0px;">
                <button class="btn-primary" onclick="addNewRule('ext')">+ 項目追加</button>
                <button class="btn-primary" onclick="saveSettings('ext')">設定を保存</button>
                <button class="btn-danger" onclick="resetToDefault('ext')">デフォルトに戻す</button>
              </div>
              <div id="ruleListExtract"></div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>