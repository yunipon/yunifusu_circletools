// ==========================================
// 9. 上部ナビゲーション
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const topNavMenu = document.getElementById('top-nav-menu');

  function closeAllDropdowns() {
    document.querySelectorAll('.top-nav-dropdown-content').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.top-nav-dropdown-btn').forEach(b => b.classList.remove('active'));
  }

  // ハンバーガーボタン（スマホ）
  if (menuToggle && topNavMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = topNavMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      if (!isOpen) closeAllDropdowns();
    });
  }

  // ドロップダウンボタン（スマホのみクリックで開閉）
  document.querySelectorAll('.top-nav-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isMobile = window.getComputedStyle(menuToggle).display !== 'none';
      if (!isMobile) return;
      e.stopPropagation();
      const content = btn.closest('.top-nav-dropdown').querySelector('.top-nav-dropdown-content');
      const isActive = content.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) {
        content.classList.add('active');
        btn.classList.add('active');
      }
    });
  });

  // 外側クリックで全て閉じる（スマホのみ）
  document.addEventListener('click', () => {
    const isMobile = menuToggle && window.getComputedStyle(menuToggle).display !== 'none';
    if (!isMobile) return;
    topNavMenu?.classList.remove('active');
    menuToggle?.classList.remove('active');
    closeAllDropdowns();
  });
});


// ==========================================
// 9. フッター
// ==========================================

async function loadDLsiteBanners() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXPke_WzLHshggHG0N7ChucamYu-sQ8zXI_5UpP2FV9nKGeN01Qb38zR23a509-27df0obS1YBTgpu/pub?gid=0&single=true&output=csv';

  const affiliateId = "kukuafi"; // ← あなたのaid

  try {
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    const rows = csvData
      .split(/\r?\n/)
      .filter(row => row.trim() !== "")
      .slice(1); // ヘッダー除外

    const container = document.getElementById('dlsite-banners');
    if (!container) return;
    container.innerHTML = '';

    rows.forEach(row => {

      // CSV安全分割（ダブルクォーテーション対応）
      const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(col => col.replace(/^"|"$/g, '').trim());

      const circle = cols[0] || '';
      const title = cols[1] || '';
      const workId = cols[2] || '';
      const folderId = cols[3] || '';

      if (!workId || !folderId) return;

      // ---- アフィリエイトURL ----
      const affiliateUrl =
        `https://dlaf.jp/maniax/dlaf/=/t/t/link/work/aid/${affiliateId}/id/${workId}.html`;

      // ---- 画像URL（D列をそのまま使用）----
      const imageUrl =
        `https://img.dlsite.jp/modpub/images2/work/doujin/${folderId}/${workId}_img_sam.jpg`;

      // ---- HTML生成 ----
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'dlsite-list-item';

      widgetDiv.innerHTML = `
        <a rel="noopener sponsored" href="${affiliateUrl}" target="_blank" class="dlsite-link-wrapper">
          <div class="list-image">
            <img src="${imageUrl}" alt="${title}" class="target_type" />
          </div>
          <div class="list-content">
            <div class="circle-name">【${circle}】</div>
            <div class="work-title">${title}</div>
          </div>
        </a>
      `;

      container.appendChild(widgetDiv);
    });

  } catch (error) {
    console.error('Banners load error:', error);
  }
}

document.addEventListener("DOMContentLoaded", loadDLsiteBanners);