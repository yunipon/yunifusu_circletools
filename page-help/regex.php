<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>

  <?php
  // 正規表現記号の辞書データ（1項目1行で管理）
  $regexDictionary = [
    ['symbol' => '^', 'name' => '行頭', 'desc' => '行の始まりを意味します。例：「^トラック」 は行の先頭にある「トラック」にのみ一致します。'],
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

  <main class="main-content">
    <div class="container">
      <div class="content-header">
        <h1>正規表現の実例ガイド</h1>
        <p class="subtitle">当ツールで使用している標準ルールの仕組みを解説します。</p>
      </div>

      <div class="card">
        <h3>1. 特定の行を丸ごと削除する</h3>
        <p>トラック名や注釈など、特定の文字から始まる「行」を指定して消去します。</p>

        <div class="example-box">
          <h4 class="highlight">トラック名の削除</h4>
          <div class="rule-card">
            <div class="rule-header">
              <div class="rule-info">
                <code class="rule-pattern">^(トラック|Track|ＴＲＡＣＫ|TRACK).*</code>
              </div>
            </div>
          </div>
          <p><strong>仕組みの解説:</strong></p>
          <ul>
            <li style="margin: 5px 0px;"><span class="example-code">^</span>: <span style="font-weight: bold;">行の先頭</span>を意味します。行の途中に「トラック」があっても無視し、先頭にある場合だけ反応します。</li>
            <li style="margin: 5px 0px;"><span class="example-code">(A|B|C)</span> : <span style="font-weight: bold;">「または」</span>を意味します。全角・半角や大文字・小文字の表記揺れをまとめて指定しています。</li>
            <li style="margin: 5px 0px;"><span class="example-code">.*</span> : <span style="font-weight: bold; margin:0px 10px; color: #d81b60;">.</span>は任意の1文字、<span style="font-weight: bold; margin:0px 10px; color: #d81b60;">*</span>は0回以上の繰り返し。つまり、キーワードの後に続く<span style="font-weight: bold;">残りの文字すべて</span>を指します。</li>
          </ul>
        </div>

        <div class="example-box" style="margin-top: 20px;">
          <h4 class="highlight">ト書き（記号）行の削除</h4>
          <div class="rule-card">
            <div class="rule-header">
              <div class="rule-info">
                <code class="rule-pattern">^\s*(◆|■|※|//|◇|□|＊).*</code>
              </div>
            </div>
          </div>
          <ul>
            <li style="margin: 5px 0px;"><span class="example-code">\s*</span> : <span style="font-weight: bold;">「0個以上の空白」</span>を意味します。行の頭にスペースやタブが入っていても、その後の記号を正しく見つけ出します。</li>
          </ul>
        </div>
      </div>



      <div class="card">
        <h3>2. カッコに囲まれた部分を削除</h3>
        <p>演出指示や、ファイル名に含まれる不要な補足（）などを消去します。</p>

        <div class="example-box">
          <h4 class="highlight">【】や ( ) の中身ごと削除</h4>
          <div class="rule-card" style="margin-bottom:10px;">
            <code class="rule-pattern">【[^】]*】</code>
          </div>
          <div class="rule-card">
            <code class="rule-pattern">[（\(][^）\)]*[）\)]</code>
          </div>

          <p><strong>仕組みの解説:</strong></p>
          <ul>
            <li style="margin: 5px 0px;"><span class="example-code">[（\(]</span> : <span style="font-weight: bold;">「全角の（ または 半角の (」</span>のどちらかという意味です。</li>
            <li style="margin: 5px 0px;"><span class="example-code">[^】]*</span> : <span style="font-weight: bold; margin:0px 10px; color: #d81b60;">[^ ]</span>は<span style="font-weight: bold;">「〜以外の文字」</span>。つまり「閉じカッコ以外の文字が続く限り」という意味になり、カッコの中身を確実に捉えます。</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h3>3. 特定の文字を狙い撃つ</h3>
        <div class="example-box">
          <h4 class="highlight">スペース（空白）の削除</h4>
          <div class="rule-card">
            <code class="rule-pattern">[ 　]</code>
          </div>
          <p><strong>仕組みの解説:</strong></p>
          <ul>
            <li style="margin: 5px 0px;"><span class="example-code">[ ]</span> : 括弧の中に入れた<span style="font-weight: bold;">いずれかの1文字</span>に一致します。ここでは「半角スペース」と「全角スペース」を指定しています。</li>
            <li style="margin: 5px 0px;">文章の途中にある空白もすべて見つけ出し、空文字に置き換える（削除する）設定です。</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h3>4. 正規表現 記号辞書</h3>
        <p>パターンを作成する際によく使われる共通記号の解説です。</p>

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


      </div>
  </main>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>