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

    /* JSで生成されたボタンに適用されるスタイル */
    .select-edit-btn {
      margin-bottom: 5px;
      display: block;
      width: 100%;
      cursor: pointer;
      font-size: 14px;
      padding: 5px 0;

      /* デザイン設定 */
      background-color: var(--primary-color);
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-weight: bold;

      /* アニメーション */
      transition: opacity 0.3s, background-color 0.3s;
    }

    /* ホバー時の効果 */
    .select-edit-btn:hover {
      opacity: 0.8;
      /* 必要ならホバー時の色指定も */
      background-color: var(--primary-color);
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
  <main class="main-content">
    <div class="tool-container">
      <h2>画像一括リサイズ&トリミング（JPEG保存）</h2>
      <div style="font-size: small; margin-bottom: 10px;">アップロード後に各画像を500×500pxの正方形にトリミングもできます💡</div>

      <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 20px;">
        <label><input type="radio" name="sizeSelect" value="small" checked onchange="updateTargetSize()"> 560×420</label>
        <label><input type="radio" name="sizeSelect" value="large" onchange="updateTargetSize()"> 1600×1200</label>
        <?php //<label><input type="radio" name="sizeSelect" value="square" onchange="updateTargetSize()"> 500×500 (位置調整)</label> 
        ?>
      </div>

      <div class="upload-area" id="dropZone">
        <p id="dropText">画像をここにドラッグ＆ドロップ（最大10枚）<br>またはクリックで選択</p>
        <input type="file" id="imageInput" accept="image/*" multiple style="display:none;">
      </div>

      <div id="squareAdjustArea" style="display:none; margin-bottom: 30px; padding: 20px; border: 2px solid var(--accent-color); border-radius: 12px; background: #f0f8ff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="margin: 0; font-size: 16px;">正方形トリミング: <span id="editingFileName" style="font-weight: normal;"></span></h3>
          <button onclick="closeSquareEditor()" style="background:none; border:none; cursor:pointer; color:#666;">✖ 閉じる</button>
        </div>

        <div style="margin: 10px auto; width: 500px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 12px;">縮小</span>
          <input type="range" id="zoomRange" min="1" max="3" step="0.01" value="1" style="flex: 1;">
          <span style="font-size: 12px;">拡大</span>
        </div>

        <div id="cropWindow" style="width: 500px; height: 500px; margin: 0 auto; overflow: hidden; border: 1px solid #ccc; position: relative; cursor: move; background: #ddd;">
          <img id="cropImg" style="position: absolute; top: 0; left: 0; max-width: none;">
        </div>
        <button id="processBtn" onclick="downloadSquareImage()" style="margin-top:15px; width: 500px; background-color: var(--primary-color);">この位置で正方形保存（500×500 px）</button>
      </div>

      <div id="status"></div>

      <div id="previewArea" class="preview-container">
        <button id="processBtn" onclick="downloadAllImages()" style="margin-bottom:20px;">すべての画像を保存</button>
        <div id="canvasContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;"></div>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    // --- 共通変数 ---
    let TARGET_WIDTH = 560;
    let TARGET_HEIGHT = 420;
    let currentFiles = [];
    let isDragging = false;
    let startX, startY, imgL = 0,
      imgT = 0;
    let rawImg = null;
    let currentEditingName = "";

    let currentScale = 1; // スライダーの倍率
    let baseScale = 1; // 画像が枠にぴったりはまる時の基本倍率

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageInput');
    const status = document.getElementById('status');
    const previewArea = document.getElementById('previewArea');
    const canvasContainer = document.getElementById('canvasContainer');
    const squareArea = document.getElementById('squareAdjustArea');

    // イベントリスナー
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

    // サイズ選択切り替え
    function updateTargetSize() {
      const selected = document.querySelector('input[name="sizeSelect"]:checked').value;

      if (selected === 'square') {
        TARGET_WIDTH = 500;
        TARGET_HEIGHT = 500;
        squareArea.style.display = 'block';
        previewArea.style.display = 'none';
      } else {
        if (selected === 'small') {
          TARGET_WIDTH = 560;
          TARGET_HEIGHT = 420;
        } else if (selected === 'large') {
          TARGET_WIDTH = 1600;
          TARGET_HEIGHT = 1200;
        }
        squareArea.style.display = 'none';
        previewArea.style.display = 'block';
      }

      // 画像があれば現在のモードで再処理
      if (currentFiles.length > 0) {
        handleFiles(currentFiles);
      }
    }

    // --- ファイル処理 (一括) ---
    async function handleFiles(files) {
      if (files instanceof FileList) {
        currentFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 10);
      }
      if (currentFiles.length === 0) return;

      const mode = document.querySelector('input[name="sizeSelect"]:checked').value;
      const status = document.getElementById('status');
      const canvasContainer = document.getElementById('canvasContainer');

      if (mode === 'square') {
        setupSquareCrop(currentFiles[0]);
      } else {
        status.innerText = `${currentFiles.length}枚を読み込み中...`;
        canvasContainer.innerHTML = '';
        document.getElementById('previewArea').style.display = 'block';
        document.getElementById('squareAdjustArea').style.display = 'none';

        for (const file of currentFiles) {
          await processSingleFile(file);
        }
        status.innerText = `完了: ${TARGET_WIDTH} × ${TARGET_HEIGHT}`;
      }
    }

    // --- 正方形調整 (ズーム・移動対応) ---
    function setupSquareCrop(file) {
      currentEditingName = file.name.split('.')[0];
      document.getElementById('editingFileName').innerText = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.getElementById('cropImg');
        img.onload = () => {
          rawImg = new Image();
          rawImg.onload = () => {
            baseScale = 500 / Math.min(rawImg.naturalWidth, rawImg.naturalHeight);
            currentScale = 1;
            document.getElementById('zoomRange').value = 1;
            imgL = 0;
            imgT = 0;
            applyImageTransform();
          };
          rawImg.src = img.src;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    // スライダーイベント
    const zoomRange = document.getElementById('zoomRange');
    zoomRange.addEventListener('input', () => {
      currentScale = parseFloat(zoomRange.value);
      applyImageTransform();
    });

    // 画像の状態を反映させる関数
    function applyImageTransform() {
      const img = document.getElementById('cropImg');
      if (!img || !rawImg) return;

      // 新しい表示サイズを計算
      const newW = rawImg.naturalWidth * baseScale * currentScale;
      const newH = rawImg.naturalHeight * baseScale * currentScale;

      img.width = newW;
      img.height = newH;

      // 枠からはみ出さないように位置を補正
      limitMovement();
    }

    function limitMovement() {
      const img = document.getElementById('cropImg');
      imgL = Math.min(0, Math.max(imgL, 500 - img.width));
      imgT = Math.min(0, Math.max(imgT, 500 - img.height));
      img.style.left = imgL + 'px';
      img.style.top = imgT + 'px';
    }

    // 正方形ドラッグ処理
    const cropWindow = document.getElementById('cropWindow');
    cropWindow.onmousedown = (e) => {
      isDragging = true;
      startX = e.clientX - imgL;
      startY = e.clientY - imgT;
      e.preventDefault();
    };
    window.onmousemove = (e) => {
      if (!isDragging) return;
      const img = document.getElementById('cropImg');
      if (!img) return;
      imgL = e.clientX - startX;
      imgT = e.clientY - startY;
      imgL = Math.min(0, Math.max(imgL, 500 - img.width));
      imgT = Math.min(0, Math.max(imgT, 500 - img.height));
      img.style.left = imgL + 'px';
      img.style.top = imgT + 'px';
    };
    window.onmouseup = () => isDragging = false;

    function downloadSquareImage() {
      if (!rawImg || !rawImg.complete) return;
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      const img = document.getElementById('cropImg');
      const ratio = rawImg.naturalWidth / img.width;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(rawImg, Math.abs(imgL) * ratio, Math.abs(imgT) * ratio, 500 * ratio, 500 * ratio, 0, 0, 500, 500);

      const link = document.createElement('a');
      link.download = `${currentEditingName}_sq.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    }

    // --- 高精度リサイズ描画 (1600x1200対応) ---
    function processSingleFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'text-align:center; padding:10px; border:1px solid #eee; background:#fff;';

            const cvs = document.createElement('canvas');
            cvs.width = TARGET_WIDTH;
            cvs.height = TARGET_HEIGHT;
            cvs.className = 'resized-canvas';
            cvs.style.width = "100%";
            const ctx = cvs.getContext('2d');

            // 1. 高画質リサイズ (段階的)
            let tempCanvas = document.createElement('canvas');
            let tempCtx = tempCanvas.getContext('2d');
            let currW = img.width;
            let currH = img.height;

            tempCanvas.width = currW;
            tempCanvas.height = currH;
            tempCtx.drawImage(img, 0, 0);

            while (currW * 0.5 > TARGET_WIDTH) {
              let nextW = Math.floor(currW * 0.5);
              let nextH = Math.floor(currH * 0.5);
              let t2 = document.createElement('canvas');
              t2.width = nextW;
              t2.height = nextH;
              t2.getContext('2d').drawImage(tempCanvas, 0, 0, currW, currH, 0, 0, nextW, nextH);
              tempCanvas = t2;
              currW = nextW;
              currH = nextH;
            }

            const scale = Math.max(TARGET_WIDTH / currW, TARGET_HEIGHT / currH);
            const drawW = currW * scale;
            const drawH = currH * scale;
            const offsetX = (drawW - TARGET_WIDTH) / 2;
            const offsetY = (drawH - TARGET_HEIGHT) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(tempCanvas, -offsetX, -offsetY, drawW, drawH);

            // 2. フィルタ補正
            ctx.filter = 'contrast(1.04) brightness(1.02)';
            ctx.drawImage(cvs, 0, 0);
            ctx.filter = 'none';

            wrapper.appendChild(cvs);

            // 3. 正方形調整ボタンの追加
            const editBtn = document.createElement('button');
            editBtn.innerText = "この画像を正方形調整";
            // クラス名を割り当てる（例：select-edit-btn）
            editBtn.classList.add('select-edit-btn');
            editBtn.onclick = () => {
              setupSquareCrop(file);
              document.getElementById('squareAdjustArea').style.display = 'block';
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            };
            wrapper.appendChild(editBtn);

            const nameTag = document.createElement('div');
            nameTag.innerText = file.name;
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

    function closeSquareEditor() {
      document.getElementById('squareAdjustArea').style.display = 'none';
    }

    function downloadAllImages() {
      const canvases = document.querySelectorAll('.resized-canvas');
      if (canvases.length === 0) return;
      canvases.forEach((cvs, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.download = `resized_${TARGET_WIDTH}x${TARGET_HEIGHT}_${index + 1}.jpg`;
          link.href = cvs.toDataURL('image/jpeg', 1.0);
          link.click();
        }, index * 400); // 1600pxは重いため間隔を少し広げる
      });
    }
  </script>
</body>

</html>