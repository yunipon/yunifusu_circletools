// ==========================================
// 9. サイドバー
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuToggle && sidebar && overlay) {
    // ボタンをクリックしたら開閉
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // 背景（オーバーレイ）をクリックしたら閉じる
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      menuToggle.classList.remove('active');
    });

    // メニュー内のリンクをクリックしたら閉じる（スマホ対策）
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
});