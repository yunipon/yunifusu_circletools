<button id="menu-toggle" class="hamburger-btn">
  <span></span>
  <span></span>
  <span></span>
</button>

<div id="sidebar" class="sidebar">
  <div class="sidebar-header">
    <h3 style="color: white; margin-bottom: 20px;">MENU</h3>
  </div>

  <nav class="nav-menu" style="display: flex; flex-direction: column; gap: 10px;">
    <a href="/page-home/index.php" class="nav-item">
      <span class="material-symbols-outlined">home</span> HOME
    </a>
  </nav>

  <nav class="nav-menu" style="display: flex; flex-direction: column; gap: 10px;">
    <details open>
      <summary class="section-title">メインツール</summary>
      <a href="/page-main/extract.php" class="nav-item">① セリフのみ抽出</a>
      <a href="/page-main/format.php" class="nav-item">② 台本整形（1人）</a>
      <a href="/page-main/multi.php" class="nav-item">③ 複数ヒロイン整形</a>
      <a href="/page-main/plot.php" class="nav-item">④ プロット作成</a>
    </details>
  </nav>

  <nav class="nav-menu" style="display: flex; flex-direction: column; gap: 10px;">
    <details open>
      <summary class="section-title">サブツール</summary>
      <a href="/page-tools/imagejoin.php" class="nav-item">画像連結</a>
      <a href="/page-tools/bpmtest.php" class="nav-item">BPMスピードテスト</a>
    </details>
  </nav>

  <nav class="nav-menu" style="display: flex; flex-direction: column; gap: 10px;">
    <details open>
      <summary class="section-title">ヘルプ</summary>
      <a href="/page-help/regex.php" class="nav-item">正規表現ガイド</a>
      <a href="/page-home/contact.php" class="nav-item">お問い合わせ</a>
    </details>
  </nav>

</div>

<div id="sidebar-overlay" class="sidebar-overlay"></div>