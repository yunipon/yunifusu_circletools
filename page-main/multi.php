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
      <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
        <button type="button" id="addHeroineBtn" class="btn-primary" onclick="addHeroineInput()" style="margin: 0;">
          + 人数を追加 (最5名)
        </button>

        <button type="button" onclick="autoFillHeroineNames()" class="btn-secondary" style="margin: 0; display: flex; align-items: center; gap: 4px; height: 100%;">
          <span class="material-symbols-outlined" style="font-size: 1.2rem;">person_search</span>
          本文から名前を取得
        </button>
      </div>
    </div>
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
          <div class="box">
            <h4>台本入力
              <div style="font-size: x-small; color: red; margin-top: 5px;">【注意】「//」はキャラ名以外に使用しないでください！！</div>
            </h4>

            <div class="textarea-wrapper">
              <div id="lineNumbers" class="line-numbers"></div>
              <textarea id="textMulti"
                oninput="updateCharCount('textMulti', 'countMulti'); runMultiPreview(); updateNameButtons('textMulti'); updateLineNumbers()"
                onscroll="syncScroll()"
                placeholder="複数人の台本を貼り付けてください...">
              </textarea>
            </div>
            <div class="char-count" style="text-align: right; margin-top: 5px; color: #666;">
              文字数: <span id="countMulti">0</span>
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div id="multiDialogueCount" style="font-size: 0.9em; color: #666; background: #f8f9fa; padding: 10px; border-radius: 6px;">合計セリフ：0 文字</div>
            <div id="characterBreakdown" style="font-size: 0.85em; color: #555; display:none; background: #fefefe; padding: 8px; border: 1px dashed #ddd;"></div>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <strong>台本チェック</strong>
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <span class="tooltip" data-tooltip="「ここから」と「ここまで」のペアが揃っているか確認します">
              <button class="btn-secondary" onclick="runScriptCheck()">始終チェック</button>
            </span>
            <span class="tooltip" data-tooltip="「＊」から始まるアドリブ指示を抽出します">
              <button class="btn-secondary" onclick="extractAdlibCommands()">「＊」抽出</button>
            </span>
          </div>
          <textarea id="textCheck" placeholder="チェックの結果が出力されます"></textarea>
          <div style="margin: 10px 0; font-size: 14px;">
            <label><input type="radio" name="wordMode" value="h" checked> 通常（横書き）</label>
            <label style="margin-left: 10px;"><input type="radio" name="wordMode" value="v"> 縦書き用（濁点ずらし）</label>
          </div>
          <div class="btn-group" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <button class="btn-primary" onclick="handleExport('word')">Word出力</button>
            <button class="btn-primary" onclick="handleExport('txt')">txt出力</button>
            <span class="tooltip" data-tooltip="上の「ヒロイン名設定」で全キャラの名前を設定してください。">
              <button class="btn-primary" onclick="exportAllHeroinesToWord()">キャラ別Word出力</button>
            </span>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <div class="btn-group" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <button class="btn-danger" onclick="clearData('multi')">データクリア</button>
          </div>

        </div>
      </div>
      <div class="editor-right">
        <div class="card">
          <h4>プレビュー（既定の書式設定で固定しています）</h4>
          <div id="previewAreaMulti" class="preview-box"></div>
        </div>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>