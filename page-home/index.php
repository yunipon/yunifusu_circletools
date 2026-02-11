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
      <h1>Dashboard</h1>
      <p class="subtitle">台本作成支援ツール集</p>
    </header>

    <section class="news-section card">
      <h2>📢 アップデート情報</h2>
      <ul class="news-list">
        <li><span class="date">2026.02.07</span> エックスサーバー移行完了。PHP 8.5.2 で稼働中。</li>
        <li><span class="date">2026.02.05</span> 「複数ヒロイン整形」のカラーパレットを更新しました。</li>
        <li><span class="date">2026.02.01</span> ポータルサイトのデザインをリニューアルしました。</li>
      </ul>
    </section>

    <div class="menu-grid">
      <a href="/page-main/extract.php" class="card tool-card">
        <div class="card-icon">①</div>
        <h3>セリフのみ抽出</h3>
        <p>ト書きや注釈を自動除去し、セリフだけをリストアップします。</p>
      </a>

      <a href="/page-main/format.php" class="card tool-card">
        <div class="card-icon">②</div>
        <h3>台本整形（1人）</h3>
        <p>一人称視点の台本をきれいに整え、文字数をカウントします。</p>
      </a>

      <a href="/page-main/multi.php" class="card tool-card">
        <div class="card-icon">③</div>
        <h3>複数ヒロイン整形</h3>
        <p>配役ごとに色分けを行い、視覚的なプレビューを表示します。</p>
      </a>

      <a href="/page-main/plot.php" class="card tool-card">
        <div class="card-icon">④</div>
        <h3>プロット作成</h3>
        <p>作品の構成案、キャラクター設定、トラックリストを作成します。</p>
      </a>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>