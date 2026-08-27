<?php $pageTitle = "画像一括圧縮"; ?>

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
      max-width: 680px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .description {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }

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
      background-color: rgba(0, 168, 232, 0.08);
    }

    #processBtn {
      width: 100%;
      padding: 12px 24px;
      color: #fff;
      background-color: var(--accent-color);
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }

    #processBtn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    #status {
      margin-top: 15px;
      min-height: 1.5em;
      color: #666;
      font-size: 14px;
    }

    .file-list,
    .result-list {
      margin: 10px 0;
      padding-left: 24px;
      text-align: left;
      overflow-wrap: anywhere;
    }

    .clear-btn {
      margin-top: 5px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
    }

    .note {
      margin-top: 20px;
      color: #888;
      font-size: 12px;
      line-height: 1.7;
      text-align: left;
    }
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>
  <main class="main-content">
    <div class="tool-container">
      <h2>画像一括圧縮ツール</h2>
      <p class="description">画像の縦横比を維持したまま、1枚ずつ1.9MB以下のJPEGに変換します。</p>

      <div class="upload-area" id="dropZone" role="button" tabindex="0">
        <p>画像をここにドラッグ＆ドロップ<br>またはクリックで選択</p>
        <input type="file" id="imageInput" multiple accept="image/*" hidden>
      </div>

      <button id="processBtn" type="button" disabled>圧縮してまとめて保存</button>
      <div id="status" aria-live="polite"></div>

      <div class="note">
        ※ 出力形式はJPEG、上限は1,900,000バイトです。<br>
        ※ まず画質を調整し、収まらない場合のみ縦横比を保って縮小します。<br>
        ※ ブラウザから複数ファイルのダウンロード許可を求められる場合があります。<br>
        ※ 画像はサーバーへ送信せず、ブラウザ内で処理します。
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    const MAX_SIZE = 1_900_000;
    const MIN_QUALITY = 0.35;
    const MAX_QUALITY = 0.95;
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageInput');
    const processBtn = document.getElementById('processBtn');
    const statusArea = document.getElementById('status');
    let imageList = [];

    function formatSize(bytes) {
      return `${(bytes / 1_000_000).toFixed(2)}MB`;
    }

    function addFiles(fileList) {
      const images = Array.from(fileList || []).filter(file => file.type.startsWith('image/'));
      imageList.push(...images);
      try { fileInput.value = ''; } catch (error) {}
      renderFileList();
    }

    function clearFiles() {
      imageList = [];
      renderFileList();
    }

    function renderFileList() {
      statusArea.replaceChildren();
      processBtn.disabled = imageList.length === 0;
      if (imageList.length === 0) return;

      const summary = document.createElement('div');
      summary.textContent = `${imageList.length}枚の画像が選択されています。`;
      const list = document.createElement('ol');
      list.className = 'file-list';
      imageList.forEach(file => {
        const item = document.createElement('li');
        item.textContent = `${file.name}（${formatSize(file.size)}）`;
        list.appendChild(item);
      });
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'clear-btn';
      clearBtn.textContent = '取り消す';
      clearBtn.addEventListener('click', clearFiles);
      statusArea.append(summary, list, clearBtn);
    }

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        fileInput.click();
      }
    });
    dropZone.addEventListener('dragover', event => {
      event.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', event => {
      event.preventDefault();
      dropZone.classList.remove('dragover');
      addFiles(event.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => addFiles(fileInput.files));

    function canvasToJpeg(canvas, quality) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('JPEGへの変換に失敗しました。'));
        }, 'image/jpeg', quality);
      });
    }

    function loadImage(file) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);
        image.onload = () => resolve({ image, url });
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error(`${file.name}を読み込めませんでした。`));
        };
        image.src = url;
      });
    }

    async function findBestJpeg(canvas) {
      const highest = await canvasToJpeg(canvas, MAX_QUALITY);
      if (highest.size <= MAX_SIZE) return highest;

      let low = MIN_QUALITY;
      let high = MAX_QUALITY;
      let best = null;
      for (let i = 0; i < 9; i++) {
        const quality = (low + high) / 2;
        const blob = await canvasToJpeg(canvas, quality);
        if (blob.size <= MAX_SIZE) {
          best = blob;
          low = quality;
        } else {
          high = quality;
        }
      }
      return best;
    }

    async function compressImage(file) {
      const loaded = await loadImage(file);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });
      let width = loaded.image.naturalWidth;
      let height = loaded.image.naturalHeight;

      try {
        for (let attempt = 0; attempt < 12; attempt++) {
          canvas.width = Math.max(1, Math.round(width));
          canvas.height = Math.max(1, Math.round(height));
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(loaded.image, 0, 0, canvas.width, canvas.height);

          const blob = await findBestJpeg(canvas);
          if (blob) {
            return { blob, width: canvas.width, height: canvas.height };
          }

          const smallest = await canvasToJpeg(canvas, MIN_QUALITY);
          const scale = Math.min(0.9, Math.sqrt(MAX_SIZE / smallest.size) * 0.94);
          width *= scale;
          height *= scale;
        }
        throw new Error(`${file.name}を1.9MB以下に圧縮できませんでした。`);
      } finally {
        URL.revokeObjectURL(loaded.url);
        canvas.width = 1;
        canvas.height = 1;
      }
    }

    function outputName(fileName) {
      const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';
      return `${baseName}_compressed.jpg`;
    }

    function downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    processBtn.addEventListener('click', async () => {
      const files = imageList.slice();
      if (files.length === 0) return;

      processBtn.disabled = true;
      const originalText = processBtn.textContent;
      const results = [];
      const errors = [];

      try {
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          statusArea.textContent = `圧縮中... ${index + 1}/${files.length}（${file.name}）`;
          try {
            const result = await compressImage(file);
            downloadBlob(result.blob, outputName(file.name));
            results.push(`${file.name} → ${formatSize(result.blob.size)}（${result.width}×${result.height}px）`);
            await new Promise(resolve => setTimeout(resolve, 250));
          } catch (error) {
            errors.push(error.message);
          }
        }

        statusArea.replaceChildren();
        const summary = document.createElement('div');
        summary.textContent = `${results.length}/${files.length}枚の保存処理が完了しました。`;
        statusArea.appendChild(summary);
        if (results.length > 0) {
          const list = document.createElement('ul');
          list.className = 'result-list';
          results.forEach(result => {
            const item = document.createElement('li');
            item.textContent = result;
            list.appendChild(item);
          });
          statusArea.appendChild(list);
        }
        if (errors.length > 0) {
          const errorText = document.createElement('div');
          errorText.style.color = '#c0392b';
          errorText.textContent = errors.join(' / ');
          statusArea.appendChild(errorText);
        }
      } finally {
        processBtn.disabled = imageList.length === 0;
        processBtn.textContent = originalText;
      }
    });
  </script>
</body>

</html>
