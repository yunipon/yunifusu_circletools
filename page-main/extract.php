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
            <button class="btn-copy" onclick="copyToClipboard('＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\nトラック\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝')">トラック+装飾</button>
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

          <!-- 文字列置換 -->
          <strong>文字列置換</strong>
          <div class="replace-section" style="gap: 10px; align-items: center;">
            <input type="text" id="replaceBefore" class="replace-input" placeholder="置換前">
            <span>→</span>
            <input type="text" id="replaceAfter" class="replace-input" placeholder="置換後">
            <button class="btn-primary" onclick="executeReplace()" style="margin: 10px 0px;">置換実行</button>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <!-- ① 台本入力 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="margin: 0;">台本貼り付け</h4>
            <button class="btn-danger" onclick="clearData('extract')" style="padding: 4px 10px; font-size: 0.8rem;">データクリア</button>
          </div>
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

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <!-- ② テキスト整形 -->
          <strong>テキスト整形</strong>
          <div class="text-format-subheading">空白調整</div>
          <div class="btn-group" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
            <span class="tooltip" data-tooltip="右の削除ルール設定に基づいてト書きなどを削除し、セリフのみを残します">
              <button class="btn-primary" onclick="applyExtract(extractRules)">セリフのみ抽出</button>
            </span>
            <span class="tooltip" data-tooltip="ト書きを削除し、空白行を調整して同梱テキスト用に整形します">
              <button class="btn-primary" onclick="makeincluded()">同梱用</button>
            </span>
            <span class="tooltip" data-tooltip="各行の先頭にある半角・全角スペースやタブを削除します">
              <button class="btn-primary" onclick="removeLeadingSpaces('textExtract')">行頭空白削除</button>
            </span>
            <span class="tooltip" data-tooltip="ト書きとセリフの間など、種類が変わる行の間に空行を挿入します">
              <button class="btn-primary" onclick="addLineBreaksBetweenTypes()">空行を追加</button>
            </span>
            <span class="tooltip" data-tooltip="空白のみの行を削除します（セリフ間の完全な空行を取り除きます）">
              <button class="btn-primary" onclick="removeBlankLinesOnly('textExtract')">空白行削除</button>
            </span>
            <span class="tooltip" data-tooltip="空行・改行をすべて完全に削除します（空白行削除より強力）">
              <button class="btn-primary" onclick="removeAllBlankLines('textExtract')">空白改行完全削除</button>
            </span>
          </div>
          <hr class="text-format-divider">
          <div class="text-format-subheading">読み分けタグ</div>
          <div class="btn-group" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
            <span class="tooltip pronunciation-tooltip" data-tooltip="セリフの対象語へ読み分けタグを付けます。&#10;付与設定：[BA] [BI] [BU] [BE] [BO] [PA] [PI] [PU] [PE] [PO] [BYU] [PYU]">
              <button class="btn-primary" onclick="applyPronunciationTags('textExtract')">読み分けタグ付与</button>
            </span>
            <span class="tooltip" data-tooltip="読み分けタグと対象語の一覧をTXTでダウンロードします">
              <button class="btn-secondary" onclick="downloadPronunciationTagList()">設定一覧DL</button>
            </span>
          </div>
          <div id="pronunciationTagResult" class="pronunciation-tag-result" aria-live="polite"></div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <!-- ③ 出力 -->
          <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap; font-size: 14px; margin-bottom: 10px;">
            <strong>出力</strong>
            <label><input type="radio" name="wordMode" value="h" checked> 通常（横書き）</label>
            <label><input type="radio" name="wordMode" value="v"> 縦書き用（濁点ずらし）</label>
          </div>
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <button class="btn-primary" onclick="handleExport('word')">Word出力</button>
            <button class="btn-primary" onclick="handleExport('txt')">txt出力</button>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <!-- ④ 台本チェック -->
          <strong>台本チェック</strong>
          <div class="btn-group" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <span class="tooltip" data-tooltip="「ここから」と「ここまで」のペアが揃っているか確認します">
              <button class="btn-secondary" onclick="runScriptCheck()">始終チェック</button>
            </span>
            <span class="tooltip" data-tooltip="「＊」から始まるアドリブ指示を抽出します">
              <button class="btn-secondary" onclick="extractAdlibCommands()">「＊」抽出</button>
            </span>
          </div>
          <div style="padding-top: 15px;">
            <p style="font-size: 0.78rem; color: #888; margin: 0 0 6px 0;">※ テキスト整形ボタンを実行すると、整形前の元テキストがここに自動転記されます。チェック結果もここに出力されます。</p>
            <textarea id="textExtractBefore"
              oninput="updateCharCount('textExtractBefore', 'countExtractBefore')"
              placeholder="整形実行前の台本、チェックの結果が出力されます"
              style="width: 100%; min-height: 300px;"></textarea>
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
