<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/headertools.php'; ?>
  <style>
    /* リセット：ツール全体に影響を限定 */
    .dlsite-checker-container * {
      box-sizing: border-box;
      /* 幅の計算を「余白込み」に統一 */
    }

    .dlsite-checker-container {
      display: flex;
      gap: 20px;
      background: #f4f4f4;
      padding: 20px;
      border-radius: 8px;
    }

    /* スマホ外枠の厳密な設定 */
    #dlsite-mobile-wrapper {
      width: 375px;
      /* ここがズレると全て狂うので固定 */
      height: 600px;
      margin: 0 auto;
      background-color: #fff;
      border: 8px solid #333;
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
    }

    .work_parts.type_text {
      width: 100%;
      line-height: 1.8 !important;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* 文字表示の最終設定 */
    #dlsite-output {
      white-space: pre-wrap;
      font-size: 14px !important;
      /* スマホ版の標準サイズに固定 */
      font-family: "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", Meiryo, sans-serif;
      color: #333;
      margin: 0;
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
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>

  <div class="main-content">

    <h2>DLsiteスマホ表示改行確認</h2>

    <div class="dlsite-checker-container">
      <div class="checker-input-section">
        <label>紹介文テキスト入力</label>
        <textarea id="dlsite-input" placeholder="実機のCSSを反映したプレビューです..."></textarea>
        <div class="char-count">現在：<span id="char-num">0</span> 文字</div>
      </div>

      <div class="checker-preview-section">
        <p class="preview-label">スマホ表示プレビュー (幅375px)</p>
        <div id="dlsite-mobile-wrapper">
          <div class="dlsite-mobile-frame">
            <div class="work_info_box_inner">
              <div class="work_parts type_text">
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
      const input = document.getElementById('dlsite-input');
      const output = document.getElementById('dlsite-output');

      input.addEventListener('input', () => {
        // 入力された文字をプレビューに反映
        // HTMLタグを無効化しつつ改行だけ維持するために textContent を使用
        output.textContent = input.value;
      });
    });
  </script>

</body>

</html>