async function processImages() {
  const input = document.getElementById('imageInput');
  const files = Array.from(input.files);
  if (files.length === 0) return;

  // 1. 画像を読み込んで高さを計算
  const images = await Promise.all(files.map(file => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(file);
    });
  }));

  const width = images[0].width;
  const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

  // 2. Canvasの準備
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let scale = 1.0;
  let finalBlob = null;
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  // 3. Python版と同じリサイズ＆品質ループ
  loop: while (scale > 0.3) {
    canvas.width = width * scale;
    canvas.height = totalHeight * scale;

    // 連結描画
    let yOffset = 0;
    images.forEach(img => {
      ctx.drawImage(img, 0, yOffset, canvas.width, img.height * scale);
      yOffset += img.height * scale;
    });

    // Qualityを下げながらサイズチェック
    for (let q = 0.95; q > 0.5; q -= 0.05) {
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', q));
      console.log(`scale=${scale.toFixed(2)}, quality=${q.toFixed(2)} → ${(blob.size / 1024 / 1024).toFixed(2)}MB`);

      if (blob.size <= MAX_SIZE) {
        finalBlob = blob;
        break loop;
      }
    }
    scale -= 0.05;
  }

  // 4. 保存処理
  if (finalBlob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = "combined.jpg";
    link.click();
    alert("2MB以下で保存しました！");
  }
}