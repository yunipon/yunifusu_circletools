<?php $pageTitle = "HOME"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
  <script src="https://sdk.form.run/js/v2/embed.js"></script>
</head>


<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <main class="main-content container">

    <div
      class="formrun-embed"
      data-formrun-form="@yunifusucircletools-contact"
      data-formrun-redirect="true">
    </div>

  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>