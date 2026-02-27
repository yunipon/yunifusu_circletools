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