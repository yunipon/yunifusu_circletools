<?php $pageTitle = "HOME"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/headertools.php'; ?>
  <script src="https://sdk.form.run/js/v2/embed.js"></script>
</head>


<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">
    <h3>画像結合ツール</h3>
    <div class="memobox">
      同じサイズの画像を縦に連結して２MB以下のjpegとして出力するツールです
    </div>
    <div class="image-tool">
      <input type="file" id="imageInput" multiple accept="image/*">
      <button onclick="processImages()">画像を連結して保存</button>
      <div id="status"></div>
    </div>
    <hr style="border: 0; border-top: 1px solid var(--primary-color); margin: 20px 0;">

  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>