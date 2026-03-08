<?php $pageTitle = "台本整形"; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/../header.php'; ?>
</head>

<body>

  <?php include __DIR__ . '/../menu.php'; ?>


  <main class="main-content container">

    <button type="button" class="btn-help" onclick="toggleModal('helpModal')">
      <i class="fas fa-question-circle"></i> 使い方・仕様説明
    </button>

    <div id="helpModal" class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🛠️ 台本整形・管理ツール 仕様マニュアル</h2>
          <span class="close-btn" onclick="toggleModal('helpModal')">&times;</span>
        </div>

        <div class="modal-body">
          <h3>1. 基本の書き方（行頭記号）</h3>
          <p>行頭の記号によって役割を自動判別します。記号と文字の間は詰めても空けてもOKです。</p>
          <table class="spec-table">
            <thead>
              <tr>
                <th>記号</th>
                <th>役割</th>
                <th>動作・集計</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>//名前：</code></td>
                <td>話者指定</td>
                <td>これ以降をそのキャラのセリフとして集計。</td>
              </tr>
              <tr>
                <td><code>◆</code></td>
                <td>SE（効果音）</td>
                <td>Word出力時に<strong>茶色（設定色）</strong>で着色。</td>
              </tr>
              <tr>
                <td><code>◇</code> / <code>□</code></td>
                <td>音声 / 演技</td>
                <td>演出指示。セットで扱われ、間に空行は入りません。</td>
              </tr>
              <tr>
                <td><code>＊</code></td>
                <td>アドリブ</td>
                <td>息や動作の指示。演出指示と同じグループです。</td>
              </tr>
              <tr>
                <td><code>（ ）</code></td>
                <td>ト書き / ループ</td>
                <td>補足。文字数集計からは自動的に除外されます。</td>
              </tr>
              <tr>
                <td><code>%%%</code></td>
                <td>コメント</td>
                <td>この記号で囲んだ範囲は<strong>完全に無視</strong>されます。</td>
              </tr>
            </tbody>
          </table>

          <h3>2. 「ここから・ここまで」チェック</h3>
          <div class="info-box">
            <p>SEやループなど、ペアが必要な指示をチェックします。</p>
            <pre><code>（ループ：上記呼吸　ここから）
              ...
              （ループ：呼吸　ここまで）</code></pre>
            <ul>
              <li><strong>交差OK:</strong> A開始→B開始→A終了→B終了といった複雑な重なりも判定可能。</li>
              <li><strong>「上記」の無視:</strong> 比較時に「上記」やコロンを自動で取り除くため、柔軟な記述が可能です。</li>
            </ul>
          </div>

          <h3>3. スマートレイアウト機能</h3>
          <p>「レイアウト調整」を実行すると、役割の境界に自動で空行を挿入します。</p>
          <ul>
            <li><strong>グループ化:</strong> <code>◇</code> <code>□</code> <code>＊</code> が連続する場合、空行を入れず一塊にします。</li>
            <li><strong>視認性向上:</strong> 名前から指示、指示からセリフへ変わる際に自動で1行空けます。</li>
          </ul>

          <h3>4. Word出力（縦書き対応）</h3>
          <p>Word出力時、「縦書き用」を選択すると以下の処理が行われます。</p>
          <ul>
            <li><strong>濁点ずらし:</strong> <code>おﾞ</code> → <code>ﾞお</code> のように文字順を変換。Wordの縦書き設定で綺麗に重なります。</li>
            <li><strong>キャラ別出力:</strong> 各キャラごとの個別台本をZIP形式や一括DLで生成します。</li>
          </ul>
        </div>

        <div class="modal-footer">
          <button class="btn-close-action" onclick="toggleModal('helpModal')">閉じる</button>
        </div>
      </div>
    </div>

  </main>
  <script>
    // モーダルの開閉切り替え
    function toggleModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal.style.display === "block") {
        modal.style.display = "none";
      } else {
        modal.style.display = "block";
      }
    }

    // 外側をクリックして閉じる
    function closeModal(event) {
      if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = "none";
      }
    }
  </script>
  <?php include __DIR__ . '/../footer.php'; ?>
</body>

</html>