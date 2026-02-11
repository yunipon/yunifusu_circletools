<?php
$filename = 'todo_data.txt';

// --- データ処理ロジック ---

// 1. 追加機能
if (isset($_POST['add_item']) && !empty($_POST['title'])) {
  $title = str_replace([",", "\n", "\r"], ' ', $_POST['title']);
  $content = str_replace([",", "\n", "\r"], ' ', $_POST['content']);
  $new_line = "0,{$title},{$content}" . PHP_EOL;
  file_put_contents($filename, $new_line, FILE_APPEND | LOCK_EX);
  header('Location: ' . $_SERVER['PHP_SELF']);
  exit;
}

// 2. 並べ替え・更新・削除の共通処理 (JSON受け取り)
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data && isset($data['action'])) {
  $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

  if ($data['action'] === 'reorder') {
    // 並べ替え後のインデックス順に配列を再構成
    $new_lines = [];
    foreach ($data['order'] as $old_index) {
      if (isset($lines[$old_index])) {
        $new_lines[] = $lines[$old_index];
      }
    }
    file_put_contents($filename, implode(PHP_EOL, $new_lines) . PHP_EOL, LOCK_EX);
    echo json_encode(['status' => 'success']);
    exit;
  }
}

// 完了・削除ボタンの処理 (従来のPOST)
if (isset($_POST['toggle_id']) || isset($_POST['delete_id'])) {
  $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  if (isset($_POST['toggle_id'])) {
    $id = $_POST['toggle_id'];
    $row = explode(',', $lines[$id]);
    $row[0] = ($row[0] == "0") ? "1" : "0";
    $lines[$id] = implode(',', $row);
  } elseif (isset($_POST['delete_id'])) {
    unset($lines[$_POST['delete_id']]);
  }
  file_put_contents($filename, !empty($lines) ? implode(PHP_EOL, $lines) . PHP_EOL : "", LOCK_EX);
  header('Location: ' . $_SERVER['PHP_SELF']);
  exit;
}

// データの読み込み
$items = file_exists($filename) ? file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <title>詳細チェックリスト管理</title>
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
  <?php include __DIR__ . '/../header.php'; ?>
  <link rel="stylesheet" href="todostyle.css">
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>
  <div class="main-content container">
    <h1>📋 開発リスト</h1>
    <div class="card">
      <div id="sortable-list" class="list-group">
        <?php foreach ($items as $id => $line):
          $data = explode(',', $line);
          $is_done = ($data[0] == "1");
        ?>
          <div class="list-item" data-id="<?php echo $id; ?>">
            <div class="handle">☰</div>
            <div class="content-area <?php echo $is_done ? 'done-text' : ''; ?>">
              <strong><?php echo htmlspecialchars($data[1]); ?></strong><br>
              <small><?php echo htmlspecialchars($data[2]); ?></small>
            </div>
            <div style="display: flex; gap: 5px;">
              <form method="POST" style="margin: 0;">
                <input type="hidden" name="toggle_id" value="<?php echo $id; ?>">
                <button type="submit" class="btn btn-toggle <?php echo $is_done ? '' : 'done'; ?>">
                  <?php echo $is_done ? '戻す' : '完了'; ?>
                </button>
              </form>
              <form method="POST" style="margin: 0;" onsubmit="return confirm('削除しますか？');">
                <input type="hidden" name="delete_id" value="<?php echo $id; ?>">
                <button type="submit" class="btn btn-delete">削除</button>
              </form>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

      <form method="POST" class="form-group">
        <div class="form-row">
          <input type="text" name="title" placeholder="項目" required>
          <input type="text" name="content" placeholder="内容">
        </div>
        <button type="submit" name="add_item" class="btn btn-add">＋ 追加</button>
      </form>
    </div>
  </div>

  <script>
    const el = document.getElementById('sortable-list');
    const sortable = Sortable.create(el, {
      handle: '.handle',
      ghostClass: 'ghost',
      onEnd: function() {
        // 並べ替え後のID（現在の配列インデックス）を収集
        const order = Array.from(el.children).map(item => item.getAttribute('data-id'));

        // PHPに新しい順番を送信
        fetch(window.location.href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'reorder',
            order: order
          })
        }).then(() => {
          window.location.reload(); // 内部インデックスを同期させるためリロード
        });
      }
    });
  </script>

</body>

</html>