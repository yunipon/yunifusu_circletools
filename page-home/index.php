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
        <li><span class="date">2026.05.05</span> メニューを上部ナビゲーションバーに変更しました。</li>
        <li><span class="date">2026.05.05</span>メインツールのボタン配置を整理しました。</li>
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

    <section class="sub-tools-section">
      <h2>サブツール</h2>
      <div class="menu-grid">
        <a href="/page-tools/imagejoin.php" class="card tool-card">
          <div class="card-icon" style="background: #e8f5e9; color: #43a047;">🖼️</div>
          <h3>複数画像連結</h3>
          <p>複数の画像を縦に並べて1枚に連結して2MB以下で保存します。縦デザインの紹介画像の連結に。</p>
        </a>

        <a href="/page-tools/imageresize.php" class="card tool-card">
          <div class="card-icon" style="background: #e3f2fd; color: #1e88e5;">📐</div>
          <h3>画像リサイズ&amp;トリミング</h3>
          <p>画像を指定サイズに一括リサイズ・トリミングしてJPEG保存します。DLsite等への入稿素材の調整に。</p>
        </a>

        <a href="/page-tools/graffiti.php" class="card tool-card">
          <div class="card-icon" style="background: #fff8e1; color: #f9a825;">✏️</div>
          <h3>落書きツール</h3>
          <p>ブラウザ上でフリーハンド描画ができる簡易キャンバス。SNS投稿で一部を隠したい場合に。</p>
        </a>

        <a href="/page-tools/bpmtest.php" class="card tool-card">
          <div class="card-icon" style="background: #fce4ec; color: #e53935;">🎵</div>
          <h3>BPMスピード確認</h3>
          <p>タップでBPMを計測し、音楽のテンポを素早く確認します。BGMのテンポ合わせや演出のリズム確認に。</p>
        </a>

        <a href="/page-tools/dltextbhecker.php" class="card tool-card">
          <div class="card-icon" style="background: #ede7f6; color: #7b1fa2;">📱</div>
          <h3>スマホ表示改行確認</h3>
          <p>DLsiteのスマホ画面での改行位置をシミュレート。作品説明文の見え方を投稿前に確認できます。</p>
        </a>
      </div>
    </section>

  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>