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
      max-width: 800px;
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

    .upload-area {
      border: 2px dashed #ccc;
      padding: 40px;
      border-radius: 8px;
      margin-bottom: 20px;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-area:hover {
      border-color: var(--accent-color);
      background-color: rgba(0, 168, 232, 0.05);
    }

    #canvasWrapper {
      margin-top: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: auto;
      background-color: #eee;
      line-height: 0;
    }

    canvas {
      cursor: crosshair;
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }

    /* 操作パネルのレイアウト調整 */
    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      align-items: center;
    }

    .control-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      font-size: 12px;
    }

    .main-btn {
      background-color: var(--accent-color);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: opacity 0.3s;
      font-weight: bold;
    }

    .main-btn:hover {
      opacity: 0.8;
    }

    .clear-btn {
      background-color: #666;
    }

    .eraser-mode {
      background-color: #ff9800;
    }

    /* 消しゴムモードの色 */

    input[type="range"] {
      width: 100%;
      cursor: pointer;
    }

    input[type="color"] {
      width: 50px;
      height: 40px;
      border: none;
      cursor: pointer;
      background: none;
    }
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>
  <main class="main-content">
    <div class="tool-container">
      <h2>落書きツール</h2>

      <div class="upload-area" id="dropZone">
        <p>画像をここにドラッグ＆ドロップ、またはクリックで選択</p>
        <input type="file" id="imageInput" accept="image/*" style="display:none;">
      </div>

      <div id="canvasWrapper" style="display: none;">
        <canvas id="mainCanvas"></canvas>
      </div>

      <div id="controlsArea" style="display: none;">
        <div class="controls-grid">
          <div class="control-item">
            <span>スプレーの色</span>
            <input type="color" id="colorPicker" value="#ffffff">
          </div>

          <div class="control-item">
            <span>太さ: <span id="sizeNum">100</span>px</span>
            <input type="range" id="brushSize" min="5" max="200" value="100">
          </div>

          <div class="control-item">
            <span>色の濃さ: <span id="opacityNum">40</span>%</span>
            <input type="range" id="opacityRange" min="5" max="100" value="40">
          </div>

          <div class="control-item" style="flex-direction: row; gap: 10px;">
            <button id="eraserBtn" class="main-btn eraser-mode">消しゴム</button>
            <button class="main-btn clear-btn" onclick="resetCanvas()">全消去</button>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <button class="main-btn" onclick="downloadImage()" style="background-color: var(--primary-color); width: 100%; max-width: 400px;">
            画像を保存
          </button>
        </div>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    // --- 共通変数 ---
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const opacityRange = document.getElementById('opacityRange');
    const eraserBtn = document.getElementById('eraserBtn');

    let isDrawing = false;
    let isEraser = false;
    let originalImage = null;
    let originalFileType = 'image/jpeg';
    let originalFileName = 'graffiti_art';

    // UI数値の連動表示
    brushSize.oninput = () => document.getElementById('sizeNum').innerText = brushSize.value;
    opacityRange.oninput = () => document.getElementById('opacityNum').innerText = opacityRange.value;

    // --- 【重要】クリックイベントの分離 ---
    // dropZoneをクリックした時だけ、隠れているinputを発火させる
    dropZone.addEventListener('click', (e) => {
      // もしクリックされたのがinput自身なら、親(div)のイベントとして処理を繰り返さない
      if (e.target === imageInput) return;
      imageInput.click();
    });

    // 1. ファイルが選択された瞬間に動く処理
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFile(file); // ここで実際の読み込み関数を呼ぶ
      }
      // 【重要】選択が終わったら値をリセット！
      // これにより、JPEGでの不安定な挙動や、同じファイルを連続で選べない問題を解決します
      imageInput.value = '';
    });

    // --- 【重要】ドラッグ＆ドロップ処理 ---
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    // 消しゴムモード切り替え
    eraserBtn.onclick = () => {
      isEraser = !isEraser;
      eraserBtn.innerText = isEraser ? "スプレーに戻る" : "消しゴム";
      eraserBtn.style.backgroundColor = isEraser ? "var(--accent-color)" : "#ff9800";
    };

    // ファイル読み込み処理
    imageInput.onchange = (e) => handleFile(e.target.files[0]);

    function handleFile(file) {
      if (!file) return;
      originalFileType = file.type;
      originalFileName = file.name.split('.')[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          originalImage = img;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          document.getElementById('canvasWrapper').style.display = 'block';
          document.getElementById('controlsArea').style.display = 'block';
          document.getElementById('dropZone').style.display = 'none';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    // スプレー描画ロジック
    function drawSpray(x, y) {
      const size = parseInt(brushSize.value);
      const opacity = parseInt(opacityRange.value) / 100;
      const color = colorPicker.value;

      if (isEraser) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(originalImage, 0, 0);
        ctx.restore();
        return;
      }

      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // ふわっとした全体グロー
      const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
      glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.12})`);
      glowGrad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${opacity * 0.04})`);
      glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // ふわふわ粒子（中心寄りのガウス分布）
      const density = size * 5;
      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        // 3サンプル平均で中心に集まる分布を近似
        const dist = ((Math.random() + Math.random() + Math.random()) / 3) * size;
        const pX = x + Math.cos(angle) * dist;
        const pY = y + Math.sin(angle) * dist;
        const pRadius = Math.random() * 4 + 0.5;
        const pOpacity = opacity * 0.35 * (1 - (dist / size) * 0.6) * (0.3 + Math.random() * 0.7);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pOpacity})`;
        ctx.beginPath();
        ctx.arc(pX, pY, pRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // キラキラ十字スパーク
      const sparkCount = Math.max(2, Math.floor(size * 0.12));
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * size * 0.85;
        const pX = x + Math.cos(angle) * dist;
        const pY = y + Math.sin(angle) * dist;
        const sparkLen = Math.random() * size * 0.1 + size * 0.04;
        const sparkOpacity = opacity * (0.7 + Math.random() * 0.3);
        const br = Math.min(255, r + 80);
        const bg = Math.min(255, g + 80);
        const bb = Math.min(255, b + 80);

        ctx.save();
        ctx.translate(pX, pY);
        ctx.rotate(Math.random() * Math.PI / 4);
        ctx.shadowBlur = sparkLen * 2;
        ctx.shadowColor = `rgba(${br}, ${bg}, ${bb}, ${sparkOpacity * 0.8})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${sparkOpacity})`;
        ctx.lineCap = 'round';

        // 縦横の十字
        ctx.lineWidth = sparkLen * 0.12;
        ctx.beginPath();
        ctx.moveTo(0, -sparkLen);
        ctx.lineTo(0, sparkLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-sparkLen, 0);
        ctx.lineTo(sparkLen, 0);
        ctx.stroke();

        // 斜めの細い輝き
        ctx.lineWidth = sparkLen * 0.06;
        ctx.beginPath();
        ctx.moveTo(-sparkLen * 0.55, -sparkLen * 0.55);
        ctx.lineTo(sparkLen * 0.55, sparkLen * 0.55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sparkLen * 0.55, -sparkLen * 0.55);
        ctx.lineTo(-sparkLen * 0.55, sparkLen * 0.55);
        ctx.stroke();

        ctx.restore();
      }
    }

    // イベント登録
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: ((e.clientX || e.touches[0].clientX) - rect.left) * scaleX,
        y: ((e.clientY || e.touches[0].clientY) - rect.top) * scaleY
      };
    };

    const start = (e) => {
      isDrawing = true;
      move(e);
    };
    const end = () => isDrawing = false;
    const move = (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      drawSpray(pos.x, pos.y);
      if (e.cancelable) e.preventDefault();
    };

    // マウスイベント
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      paint(e);
    });
    window.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', paint);

    // タッチデバイス対応
    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      paint(e.touches[0]);
      e.preventDefault();
    });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', (e) => {
      paint(e.touches[0]);
      e.preventDefault();
    });

    function paint(e) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      // キャンバスの実際のサイズと表示サイズの比率を計算
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      drawSpray(x, y);
    }

    canvas.addEventListener('mousedown', start);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchmove', move);

    function resetCanvas() {
      if (confirm('すべての落書きを消去して元に戻しますか？')) ctx.drawImage(originalImage, 0, 0);
    }

    function downloadImage() {
      const link = document.createElement('a');
      const ext = originalFileType === 'image/png' ? 'png' : 'jpg';
      link.download = `${originalFileName}_edited.${ext}`;
      link.href = canvas.toDataURL(originalFileType, 0.95);
      link.click();
    }
  </script>
</body>

</html>