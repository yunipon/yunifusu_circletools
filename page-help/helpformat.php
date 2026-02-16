<?php $pageTitle = "台本整形"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>

  <?php include __DIR__ . '/../menu.php'; ?>

  <?php
  // デフォルトの書式設定の説明
  $regexDictionary = [
    ['symbol' => '%%% %%%', 'name' => '複数行コメント', 'desc' => '複数行にわたってのコメント'],
    ['symbol' => '$', 'name' => '行末', 'desc' => '行の終わりを意味します。例：「。$」 は行の最後にある句読点に一致します。'],
    ['symbol' => '.', 'name' => '任意の1文字', 'desc' => '改行を除くすべての1文字に一致します。'],
    ['symbol' => '*', 'name' => '0回以上の繰り返し', 'desc' => '直前の文字が0個、またはそれ以上連続している場合に一致します（最長一致）。'],
    ['symbol' => '+', 'name' => '1回以上の繰り返し', 'desc' => '直前の文字が少なくとも1個以上連続している場合に一致します。'],
    ['symbol' => '?', 'name' => '0回または1回', 'desc' => '直前の文字があってもなくても良い（最大1文字）場合に一致します。'],
    ['symbol' => '|', 'name' => 'または（選択）', 'desc' => '左右どちらかのパターンに一致します。例：「(A|B)」 は A または B。'],
    ['symbol' => '[]', 'name' => '文字クラス', 'desc' => '括弧内のいずれかの1文字に一致します。例：「[0-9]」 は任意の数字。'],
    ['symbol' => '[^ ]', 'name' => '否定文字クラス', 'desc' => '括弧内の文字「以外」の1文字に一致します。例：「[^】]」 は 】以外の文字。'],
    ['symbol' => '\\s', 'name' => '空白文字', 'desc' => 'スペース、タブ、改行などの空白文字を指します。'],
    ['symbol' => '\\d', 'name' => '数字', 'desc' => '半角数字 「[0-9]」 と同じ意味です。'],
    ['symbol' => '()', 'name' => 'グループ化', 'desc' => 'パターンをひとまとめにします。抽出や、後続の量指定子をかける際に使います。'],
    ['symbol' => '\\', 'name' => 'エスケープ', 'desc' => '記号（.や*など）を、普通の文字として扱いたい時に直前に付けます。']
  ];
  ?>

  <main class="main-content container">
    <div class="content-header">
      <h1>台本整形の書き方</h1>
    </div>

    <div style="overflow-x: auto;">
      <table class="guide-table">
        <thead>
          <tr>
            <th class="symbol-col">記号</th>
            <th class="name-col">名称</th>
            <th class="desc-col">説明</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($regexDictionary as $item): ?>
            <tr>
              <td class="symbol-col"><code><?php echo htmlspecialchars($item['symbol']); ?></code></td>
              <td class="name-col"><?php echo htmlspecialchars($item['name']); ?></td>
              <td class="desc-col"><?php echo $item['desc']; // HTMLタグ（`）を含むためそのまま出力 
                                    ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>