<?php $pageTitle = "プロット作成"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">
    <div class="content-header">
      <h1>④ プロット作成モード</h1>
    </div>

    <div id="plotPage">
      <div class="rule-card">
        <h4>【作品基本情報】</h4>
        <label>■タイトル（仮） <span style="color:red;">*</span></label>
        <input type="text" id="p-title" class="replace-input" style="width:100%; margin-bottom:15px;" required>

        <div style="position:relative;">
          <label>■作品の通称を10文字以内で表すと？</label>
          <small style="font-size: 0.8em; color: #888; display: block; margin-bottom: 5px;">短い文で作品か判別できたら嬉しいなって…（作品の特徴を書いてみてね）</small>
          <input type="text" id="p-short-title" class="replace-input" style="width:100%; margin-bottom:15px;" maxlength="10" oninput="updatePlotCharCount(this, 'p-short-title-cnt')" placeholder="例：元勇者のおばさん">
          <div class="char-count" id="p-short-title-cnt">0</div>
        </div>

        <div style="position:relative;">
          <label>■あらすじ <span style="color:red;">* (200〜210字)</span></label>
          <textarea id="p-summary" oninput="updatePlotCharCount(this, 'p-summary-cnt')" required></textarea>
          <div class="char-count" id="p-summary-cnt">0</div>
        </div>

        <div style="position:relative;">
          <label>■長めのあらすじ</label>
          <textarea id="p-summary-long" oninput="updatePlotCharCount(this, 'p-summary-long-cnt')"></textarea>
          <div class="char-count" id="p-summary-long-cnt">0</div>
        </div>
      </div>

      <div class="rule-card" style="border-left-color: #9b59b6;">
        <h4>■ キャラクター設定 (最大7人)</h4>
        <div id="plot-chars"></div>
        <button class="btn-primary" onclick="addPlotChar()">+ キャラクターを追加</button>
      </div>

      <div class="rule-card" style="border-left-color: #666;">
        <h4>■ 主人公の設定</h4>
        <textarea id="p-hero-setting" style="height:80px;" placeholder="主人公の立ち位置など"></textarea>
      </div>

      <div class="rule-card" style="border-left-color: #e67e22;">
        <h4>■ トラックリスト (最大20)</h4>
        <div id="plot-tracks"></div>
        <button class="btn-primary" onclick="addPlotTrack()">+ トラックを追加</button>
      </div>

      <div class="rule-card" style="border-left-color: #28a745;">
        <h4>■ その他１</h4>
        <textarea id="p-other1" style="height:80px;"></textarea>
      </div>

      <div class="rule-card" style="border-left-color: #ffc107;">
        <h4>■ その他２</h4>
        <textarea id="p-other2" style="height:80px;"></textarea>
      </div>

      <div class="rule-card" style="border-left-color: #17a2b8;">
        <h4>■ その他３</h4>
        <textarea id="p-other3" style="height:80px;"></textarea>
      </div>

      <div class="btn-group" style="margin-bottom: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn-primary" onclick="generatePlotText()">プロットテキスト生成</button>
        <button class="btn-primary" onclick="document.getElementById('importFile').click()">データ取り込み(.txt)</button>
        <input type="file" id="importFile" style="display:none;" accept=".txt" onchange="importPlotText(this)">
        <button class="btn-primary" onclick="downloadTxt()">txt出力</button>
        <button class="btn-danger" onclick="clearData('plot')">データクリア</button>
      </div>

      <div class="card">
        <h4>生成結果プレビュー</h4>
        <textarea id="plotResult" style="height:400px; background:#f8f9fa; font-size:13px; line-height:1.5; border:1px solid #ddd; width: 100%;" readonly></textarea>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>