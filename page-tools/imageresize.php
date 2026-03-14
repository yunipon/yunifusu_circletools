<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/headertools.php'; ?>
  <style>
    body {
      font-family: sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      padding-top: 20px;
    }

    .tool-container {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    h2 {
      color: var(--primary-color);
      margin-bottom: 20px;
    }

    /* アップロードエリアのデザイン */
    .upload-area {
      border: 2px dashed #ccc;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 20px;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-area:hover,
    .upload-area.dragover {
      border-color: var(--accent-color);
      background-color: rgba(0, 168, 232, 0.05);
    }

    #processBtn {
      background-color: var(--accent-color);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.3s;
      margin-top: 10px;
    }

    #processBtn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    #status {
      margin-top: 15px;
      font-size: 14px;
      color: var(--accent-color);
      min-height: 1.5em;
    }

    .preview-container {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: none;
    }

    canvas {
      border: 1px solid #ddd;
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .note {
      margin-top: 20px;
      font-size: 12px;
      color: #888;
      text-align: left;
      line-height: 1.6;
    }
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>

  <div class="tool-container">
    <h2>画像一括リサイズ（JPEG保存）</h2>

    <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 20px;">
      <label style="cursor: pointer; font-weight: bold;">
        <input type="radio" name="sizeSelect" value="small" checked onchange="updateTargetSize()"> 560 × 420
      </label>
      <label style="cursor: pointer; font-weight: bold;">
        <input type="radio" name="sizeSelect" value="large" onchange="updateTargetSize()"> 1600 × 1200
      </label>
    </div>

    <div class="upload-area" id="dropZone">
      <p id="dropText">画像をここにドラッグ＆ドロップ（最大10枚）<br>またはクリックで選択</p>
      <input type="file" id="imageInput" accept="image/*" multiple style="display:none;">
    </div>

    <div id="status"></div>

    <div id="previewArea" class="preview-container">
      <button id="processBtn" onclick="downloadAllImages()" style="margin-bottom:20px;">すべての画像を保存</button>
      <div id="canvasContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;"></div>
    </div>
  </div>

  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    // グローバルな目標サイズ
    let TARGET_WIDTH = 560;
    let TARGET_HEIGHT = 420;

    // 現在選択されているファイルを保持する変数
    let currentFiles = [];

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageInput');
    const status = document.getElementById('status');
    const previewArea = document.getElementById('previewArea');
    const canvasContainer = document.getElementById('canvasContainer');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    async function handleFiles(files) {
      // 選択されたファイルをグローバル変数に保存（後でサイズ切り替え時に使うため）
      currentFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 10);

      if (currentFiles.length === 0) return;

      status.innerText = `${currentFiles.length}枚を処理中...`;
      canvasContainer.innerHTML = ''; // 前回の結果をクリア
      previewArea.style.display = 'block';

      for (const file of currentFiles) {
        await processSingleFile(file);
      }

      status.innerText = `完了: ${TARGET_WIDTH} × ${TARGET_HEIGHT} で書き出します`;
    }

    // サイズ選択を切り替えた時の処理
    function updateTargetSize() {
      const selected = document.querySelector('input[name="sizeSelect"]:checked').value;
      if (selected === 'small') {
        TARGET_WIDTH = 560;
        TARGET_HEIGHT = 420;
      } else {
        TARGET_WIDTH = 1600;
        TARGET_HEIGHT = 1200;
      }

      document.getElementById('status').innerText = `設定サイズを変更しました: ${TARGET_WIDTH} × ${TARGET_HEIGHT}`;

      // 【重要】もし既に画像が選択されていれば、新しいサイズで再描画する
      if (currentFiles.length > 0) {
        handleFiles(currentFiles);
      }
    }

    // --- 画像処理ロジック (前回の高画質版を維持) ---
    async function processSingleFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const wrapper = document.createElement('div');
            wrapper.style.textAlign = 'center';

            const cvs = document.createElement('canvas');
            cvs.width = TARGET_WIDTH;
            cvs.height = TARGET_HEIGHT;
            cvs.className = 'resized-canvas';
            cvs.style.width = "100%"; // プレビュー表示サイズ

            const ctx = cvs.getContext('2d');

            // 1. 段階的リサイズ
            let tempCanvas = document.createElement('canvas');
            let tempCtx = tempCanvas.getContext('2d');
            let currW = img.width;
            let currH = img.height;

            while (currW * 0.5 > TARGET_WIDTH) {
              currW *= 0.5;
              currH *= 0.5;
              tempCanvas.width = currW;
              tempCanvas.height = currH;
              tempCtx.drawImage(img, 0, 0, currW, currH);
            }

            const scale = Math.max(TARGET_WIDTH / currW, TARGET_HEIGHT / currH);
            const drawW = currW * scale;
            const drawH = currH * scale;
            const offsetX = (drawW - TARGET_WIDTH) / 2;
            const offsetY = (drawH - TARGET_HEIGHT) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(tempCanvas.length > 0 ? tempCanvas : img, -offsetX, -offsetY, drawW, drawH);

            // 2. クッキリ補正
            ctx.filter = 'contrast(1.04) brightness(1.02)';
            ctx.drawImage(cvs, 0, 0);
            ctx.filter = 'none';

            wrapper.appendChild(cvs);
            const nameTag = document.createElement('div');
            nameTag.innerText = `${file.name} (${TARGET_WIDTH}x${TARGET_HEIGHT})`;
            nameTag.style.fontSize = "10px";
            wrapper.appendChild(nameTag);

            document.getElementById('canvasContainer').appendChild(wrapper);
            resolve();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // 保存（品質1.0固定）
    function downloadAllImages() {
      const canvases = document.querySelectorAll('.resized-canvas');
      canvases.forEach((cvs, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.download = `resized_${TARGET_WIDTH}x${TARGET_HEIGHT}_${index + 1}.jpg`;
          link.href = cvs.toDataURL('image/jpeg', 1.0);
          link.click();
        }, index * 300);
      });
    }
  </script>
</body>

</html>