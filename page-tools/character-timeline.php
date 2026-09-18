<?php $pageTitle = "キャラクター位置タイムライン"; ?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <?php include __DIR__ . '/../header.php'; ?>
  <link rel="stylesheet" href="../character-timeline.css">
</head>
<body>
  <?php include __DIR__ . '/../menu.php'; ?>
  <main class="app-shell">
    <header class="page-header">
      <div>
        <p class="eyebrow">SUB TOOL</p>
        <h1>キャラクター配置タイムライン</h1>
        <p class="lead">複数人台本を解析し、通常発話・同時発話・ループ/BGVと音声位置を上から下へ表示します。</p>
      </div>
      <span class="local-note">解析はブラウザ内のみ</span>
    </header>

    <section class="input-panel">
      <label for="scriptInput">台本を貼り付け</label>
      <textarea id="scriptInput" spellcheck="false" placeholder="複数人の台本を貼り付けてください"></textarea>
      <div class="actions">
        <button type="button" id="analyzeBtn" class="primary">タイムライン生成</button>
        <button type="button" id="sampleBtn">サンプルを入力</button>
        <button type="button" id="clearBtn">クリア</button>
      </div>
    </section>

    <section id="resultArea" class="results" hidden>
      <div id="summary" class="summary-grid"></div>

      <section class="panel">
        <div class="panel-heading">
          <div>
            <h2>トラック概要</h2>
            <p>各トラック内にある「◇音声」の左右位置指定を数えます。</p>
          </div>
        </div>
        <div id="overview" class="overview-wrap"></div>
      </section>

      <section class="panel timeline-panel">
        <div class="panel-heading timeline-heading">
          <div>
            <h2>台本・タイムライン比較</h2>
            <p>横軸は音声位置です。色＝キャラクター、濃さ＝距離、↑↓＝上下、斜線＝ループ/BGVを表します。</p>
          </div>
          <div class="timeline-controls">
            <div id="characterLegend" class="legend character-legend" aria-label="キャラクター色の凡例"></div>
            <label class="track-picker">表示トラック
              <select id="trackSelect"></select>
            </label>
          </div>
        </div>
        <div id="positionTracker" class="position-tracker" hidden></div>
        <div id="timeline" class="timeline-wrap"></div>
      </section>

      <section id="warningPanel" class="warning-panel" hidden>
        <h2>判定上の注意</h2>
        <ul id="warningList"></ul>
      </section>
    </section>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
  <script src="../script-tool/character-timeline.js"></script>
</body>
</html>
