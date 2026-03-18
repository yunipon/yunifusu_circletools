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

    /* ファイル選択エリアを少しオシャレに */
    .upload-area {
      border: 2px dashed #ccc;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 20px;
      background: #fafafa;
      cursor: pointer;
      transition: border 0.3s;
    }

    .upload-area:hover {
      border-color: var(--accent-color);
    }

    input[type="file"] {
      display: block;
      margin: 10px auto;
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
    }

    #processBtn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    #status {
      margin-top: 15px;
      font-size: 14px;
      color: #666;
      min-height: 1.5em;
    }

    .note {
      margin-top: 20px;
      font-size: 12px;
      color: #888;
      text-align: left;
    }

    /* CSSに追加 */
    .upload-area.dragover {
      border-color: var(--accent-color);
      background-color: rgba(0, 168, 232, 0.1);
      /* 少し水色に */
    }
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>
  <main class="main-content">
    <div class="tool-container">
      <h2>複数画像連結ツール</h2>

      <div class="upload-area" id="dropZone">
        <p>画像をここにドラッグ＆ドロップ<br>またはクリックで選択</p>
        <input type="file" id="imageInput" multiple accept="image/*" style="display:none;">
      </div>

      <button id="processBtn" onclick="processImages()">画像を連結して保存</button>

      <div id="status"></div>

      <div class="note">
        ※ すべての画像を同じ横幅に調整し、縦に連結します。<br>
        ※ 自動でリサイズし、ファイルサイズを2MB以下に抑えます。
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageInput');
    const status = document.getElementById('status');

    // 1. エリアをクリックしたらファイル選択を開く
    dropZone.addEventListener('click', () => fileInput.click());

    // 2. ドラッグオーバー時のエフェクト
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    // 3. ドロップされた時の処理
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');

      // ファイルをinputにセット
      fileInput.files = e.dataTransfer.files;

      // 【重要】即実行せず、何枚選ばれたか表示するだけにする
      updateFileStatus();
    });

    // 4. 普通にファイル選択された時の処理
    fileInput.addEventListener('change', () => {
      // 【重要】即実行せず、何枚選ばれたか表示するだけにする
      updateFileStatus();
    });

    // ファイルの選択状況を画面に出す関数
    function updateFileStatus() {
      const count = fileInput.files.length;
      if (count > 0) {
        status.innerText = `${count} 枚の画像が選択されています。「保存」ボタンを押してください。`;
        status.style.color = "var(--accent-color)"; // 目立つ色に
      } else {
        status.innerText = "";
      }
    }

    // processImages() 関数の中身はそのままでOKです！
    // （HTMLのボタンにある onclick="processImages()" で実行されるようになります）

    async function processImages() {
      const input = document.getElementById('imageInput');
      const btn = document.getElementById('processBtn'); // ボタン要素
      const status = document.getElementById('status'); // 状況表示エリア
      const files = Array.from(input.files);
      if (files.length === 0) return;

      // 1. 処理開始の準備（ボタン無効化と表示変更）
      btn.disabled = true;
      const originalBtnText = btn.innerText;
      btn.innerText = "処理中...";
      if (status) status.innerText = "画像を読み込み中...";

      // メモリ解放のために作成したURLを記録する配列
      const objectUrls = [];

      try {
        // 2. 画像を読み込んで高さを計算
        const images = await Promise.all(files.map(file => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            objectUrls.push(url); // 後で解放するために記録
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
            img.src = url;
          });
        }));

        const width = images[0].width;
        const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

        // 3. Canvasの準備
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let scale = 1.0;
        let finalBlob = null;
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB

        // 4. Python版と同じリサイズ＆品質ループ
        loop: while (scale > 0.3) {
          if (status) status.innerText = `サイズ調整中... (Scale: ${Math.round(scale * 100)}%)`;

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

            // ログ出力（デバッグ用）
            console.log(`scale=${scale.toFixed(2)}, quality=${q.toFixed(2)} → ${(blob.size / 1024 / 1024).toFixed(2)}MB`);

            if (blob.size <= MAX_SIZE) {
              finalBlob = blob;
              break loop;
            }
          }
          scale -= 0.05;
        }

        // 5. 保存処理
        if (finalBlob) {
          const downloadUrl = URL.createObjectURL(finalBlob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "combined.jpg";
          link.click();

          // ダウンロード用URLも解放対象に加える
          objectUrls.push(downloadUrl);

          if (status) status.innerText = "保存が完了しました！";
          alert("2MB以下で保存しました！");
        } else {
          alert("2MB以下に収めることができませんでした。");
        }

      } catch (error) {
        console.error(error);
        alert("エラーが発生しました: " + error.message);
        if (status) status.innerText = "エラーが発生しました。";
      } finally {
        // 6. メモリ解放の儀式
        // 作成したすべての ObjectURL を無効化する
        objectUrls.forEach(url => URL.revokeObjectURL(url));

        // 7. ボタンを元に戻す
        btn.disabled = false;
        btn.innerText = originalBtnText;
      }
    }
  </script>

</body>

</html>