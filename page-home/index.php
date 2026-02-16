<?php $pageTitle = "HOME"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>


<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">
    <header class="content-header">
      <h1>台本作成支援ツール集</h1>
    </header>

    <section class="news-section card">
      <h2>📢 アップデート情報</h2>
      <ul class="news-list">
        <li><span class="date">2026.02.17</span> ポータルサイトを公開しました。</li>
      </ul>
    </section>

    <div class="menu-grid">
      <a href="/page-main/extract.php" class="card tool-card">
        <div class="card-icon" style="background: #e3f2fd; color: #1e88e5;">✂️</div>
        <h3>セリフのみ抽出</h3>
        <p>台本からト書きや注釈を自動除去。必要なセリフだけを素早くリストアップし、編集・保存を効率化します。</p>
      </a>

      <a href="/page-main/format.php" class="card tool-card">
        <div class="card-icon" style="background: #f1f8e9; color: #7cb342;">📝</div>
        <h3>台本整形（1人）</h3>
        <p>一人称視点の台本をワンタップできれいに整形。リアルタイムな文字数カウント機能で、尺の調整もスムーズに。</p>
      </a>

      <a href="/page-main/multi.php" class="card tool-card">
        <div class="card-icon" style="background: #fff3e0; color: #fb8c00;">👥</div>
        <h3>複数ヒロイン整形</h3>
        <p>多人数台本の配役を自動色分け。視覚的なプレビューとキャラ別の文字数集計で、複雑な掛け合いも一目瞭然。</p>
      </a>

      <a href="/page-main/plot.php" class="card tool-card">
        <div class="card-icon" style="background: #f3e5f5; color: #8e24aa;">💡</div>
        <h3>プロット作成</h3>
        <p>アイデアを形にする土台作り。構成案からキャラ設定、トラックリストまでを一括管理し、創作を加速させます。</p>
      </a>
    </div>

  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>