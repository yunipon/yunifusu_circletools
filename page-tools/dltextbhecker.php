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

    h2 {
      color: var(--primary-color);
      margin-bottom: 20px;
    }

    .dlsite-checker-container {
      display: flex;
      gap: 50px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    /* スマホ外枠の厳密な設定 */
    #dlsite-mobile-wrapper {
      width: 375px;
      /* ここがズレると全て狂うので固定 */
      height: 600px;
      margin: 0 auto;
      background-color: #fff;
      border: 4px solid #333;
      box-sizing: content-box;
      border-radius: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      /* 横スクロールを禁止 */
    }

    .dlsite-mobile-frame {
      width: 100%;
      background-color: #fff;
    }

    /* DLsite実機の余白と行間 */
    .work_info_box_inner {
      width: 100%;
      padding: 16px 12px;
      /* 左右12pxを厳守 */
      text-align: left;
    }

    .work_parts.type_text {
      width: 100%;
      line-height: 1.8;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* 文字表示の最終設定 */
    #dlsite-output {
      white-space: pre-wrap;
      font-size: 13px;
      /* スマホ版の標準サイズに固定 */
      font-family: ヒラギノ角ゴ Pro W3, Meiryo, メイリオ, helvetica, arial, verdana, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      display: block;
    }

    /* タイトルのスタイル */
    #dlsite-title-output {
      font-size: 16px;
      font-weight: 700;
      white-space: pre-wrap;
      font-family: ヒラギノ角ゴ Pro W3, Meiryo, メイリオ, helvetica, arial, verdana, sans-serif;
      color: #333;
      margin: 0 0 10px 0;
      padding: 0;
      display: block;
    }

    /* 入力欄のスタイル */
    #dlsite-input {
      width: 100%;
      height: 400px;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      flex: 1;
    }

    #dlsite-title-input {
      width: 100%;
      height: 100px;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
    }

    .char-count {
      margin-top: 5px;
      font-size: 12px;
      color: #777;
      text-align: right;
    }

    .preview-label {
      margin-bottom: 15px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
      text-align: center;
    }

    #device-size {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 10px;
    }

    /* レスポンシブデザイン */
    @media (max-width: 768px) {
      .dlsite-checker-container {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
      }

      #dlsite-mobile-wrapper {
        width: 100%;
        max-width: 375px;
        height: 500px;
        border-width: 3px;
      }

      #dlsite-input {
        height: 300px;
      }

      #dlsite-title-input {
        height: 80px;
      }

      .work_info_box_inner {
        padding: 12px 10px;
      }

      #dlsite-output {
        font-size: 12px;
      }

      #dlsite-title-output {
        font-size: 15px;
      }
    }
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>

  <div class="main-content">

    <h2>DLsiteスマホ表示改行確認</h2>
    <p>⚠️スマホで確認することは想定していません。</p>

    <div class="dlsite-checker-container">
      <div class="checker-input-section">
        <label for="dlsite-title-input">タイトル入力</label>
        <textarea id="dlsite-title-input" placeholder="タイトルを入力..."></textarea>
        <div class="char-count">現在：<span id="title-char-num">0</span> 文字</div>
        <label for="dlsite-input">紹介文テキスト入力</label>
        <textarea id="dlsite-input" placeholder="実機のCSSを反映したプレビューです..."></textarea>
        <div class="char-count">現在：<span id="char-num">0</span> 文字</div>
      </div>

      <div class="checker-preview-section">
        <label for="device-size">デバイスサイズ</label>
        <select id="device-size">
          <option value="375">iPhone SE (375px)</option>
          <option value="390">iPhone 12/13 (390px)</option>
          <option value="428">iPhone 14 Pro Max (428px)</option>
          <option value="411">Android Pixel 4 (411px)</option>
          <option value="360">Android Galaxy S21 (360px)</option>
        </select>
        <p class="preview-label">スマホ表示プレビュー (幅375px)</p>
        <div id="dlsite-mobile-wrapper">
          <div class="dlsite-mobile-frame">
            <div class="work_info_box_inner">
              <div class="work_parts type_text">
                <div id="dlsite-title-output"></div>
                <div id="dlsite-output"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>


  </div>

  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const titleInput = document.getElementById('dlsite-title-input');
      const input = document.getElementById('dlsite-input');
      const titleOutput = document.getElementById('dlsite-title-output');
      const output = document.getElementById('dlsite-output');
      const titleCharNum = document.getElementById('title-char-num');
      const charNum = document.getElementById('char-num');
      const deviceSize = document.getElementById('device-size');
      const mobileWrapper = document.getElementById('dlsite-mobile-wrapper');
      const previewLabel = document.querySelector('.preview-label');

      const updatePreview = () => {
        titleOutput.textContent = titleInput.value;
        output.textContent = input.value;
        const titleLen = titleInput.value.length;
        const inputLen = input.value.length;
        titleCharNum.textContent = titleLen;
        charNum.textContent = inputLen;
        console.log('Title length:', titleLen, 'Input length:', inputLen);
      };

      const updateDeviceSize = () => {
        const width = deviceSize.value;
        mobileWrapper.style.width = width + 'px';
        previewLabel.textContent = `スマホ表示プレビュー (幅${width}px)`;
      };

      deviceSize.addEventListener('change', updateDeviceSize);
      titleInput.addEventListener('input', updatePreview);
      input.addEventListener('input', updatePreview);
      updatePreview();
      updateDeviceSize();
    });
  </script>

</body>

</html>