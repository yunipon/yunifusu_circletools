// ==========================================
// 1. グローバル設定・定数
// ==========================================
const heroineColors = [
  "#E50000", // 赤
  "#0000FF", // 青
  "#008000", // 緑
  "#8A2BE2", // 紫
  "#D2691E", // 茶
  "#FF1493", // ピンク
  "#00CED1", // ターコイズ
  "#FFD700", // ゴールド
  "#FF8C00", // オレンジ
  "#2F4F4F"  // ダークグレー
];

const heroineColorPairs = [
  { fg: "#E50000", bg: "#FFDADA" },
  { fg: "#0000FF", bg: "#D1F5FF" },
  { fg: "#008000", bg: "#D1FFD1" },
  { fg: "#8A2BE2", bg: "#E6D1FF" },
  { fg: "#D2691E", bg: "#F5E0D1" },
  { fg: "#FF1493", bg: "#FFD6EC" },
  { fg: "#00CED1", bg: "#D6F7F9" },
  { fg: "#FFD700", bg: "#FFF5CC" },
  { fg: "#FF8C00", bg: "#FFE5CC" },
  { fg: "#2F4F4F", bg: "#DDE5E5" }
];

let extractRules = [], formatRules = [], multiRules = [];
let heroineCount = 3;

// デフォルトルール定義
const defaultExtract = [
  { label: 'コメント行削除（%%% ~ %%% ）', pattern: 'delete_comment', active: true, isSpecial: true },
  { label: 'トラック装飾の削除', pattern: '^＝＊＝.*', active: true },
  { label: 'トラック名の削除', pattern: '^(トラック|Track|ＴＲＡＣＫ|TRACK).*', active: true },
  { label: 'ト書き行削除', pattern: '^\\s*(◆|■|※|//|◇|□|＊).*', active: true },
  { label: 'ト書き行削除', pattern: '^\\s*(SE|SE).*', active: true },
  { label: '【】内削除', pattern: '【[^】]*】', active: true },
  { label: '()内削除', pattern: '[（\\(][^）\\)]*[）\\)]', active: true },
  { label: '《》内削除', pattern: '《[^》]*》', active: true },
  { label: '[]内削除', pattern: '\\[[^\\]]*\\]', active: true },
  { label: 'スペース削除（文章の途中のスペースも削除）', pattern: '[ 　]', active: true }
];

const defaultFormat = [
  { label: 'トラック装飾の削除', pattern: '^＝＊＝.*', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' },
  { label: 'コメント｜%%% ~ %%%', pattern: 'format_comment', active: true, bgColor: 'none', fgColor: '#666666', bold: false, fontSize: '11', isSpecial: true },
  { label: 'トラック名｜トラック or Track or ＴＲＡＣＫ', pattern: '^(トラック|Track|ＴＲＡＣＫ)', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' },
  { label: 'SE指示｜◆SE：〇〇　ここから/ここまで', pattern: '^◆SE：.*', active: true, bgColor: '#E0E0E0', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'SE指示方向｜◆SE方向：｜必要であれば使用', pattern: '^◆SE方向：.*', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '編集指示｜■編集：', pattern: '^■編集：.*', active: true, bgColor: '#E0E0E0', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '同時指示｜【同時　〜ここから/ここまで】', pattern: '^【同時.*(ここから|ここまで)[\s　]*】', active: true, bgColor: '#FFFF00', fgColor: '#000000', bold: true, fontSize: '11' },
  { label: '特記事項｜※補足：｜間を開ける指示など', pattern: '^※補足：.*', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '状況説明｜《状況：〇〇》', pattern: '^\s*《状況：.*》', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },

  { label: '話者｜//キャラ名：', pattern: '^\/\/.*：', active: true, bgColor: 'none', fgColor: '#0000FF', bold: true, fontSize: '11' },
  { label: 'ト書き｜◇音声：｜方向・距離・（有声/無声）', pattern: '^◇音声：', active: true, bgColor: 'none', fgColor: '#0000FF', bold: false, fontSize: '11' },
  { label: 'ト書き｜□演技：)｜必要であれば（ここから/ここまで）指示', pattern: '^□演技：', active: true, bgColor: 'none', fgColor: '#0000FF', bold: false, fontSize: '11' },
  { label: 'アドリブ演技指示｜＊〇〇　秒/回', pattern: '^＊.*', active: true, bgColor: '#D1F5FF', fgColor: '#0000FF', bold: false, fontSize: '11' },
  { label: 'ループ用指示｜（キャラ名｜ループ：〇回/ここから/ここまで）｜回数や開始終了指示など', pattern: '^\\s*[（\\(].*｜ループ：.*\\s*[）\\)]', active: true, bgColor: '#FFFF00', fgColor: '#0000FF', bold: true, fontSize: '11' },

  { label: '補足｜（）｜フェラ、絶頂　など', pattern: '^\\s*[（\\(][^）\\)]*[）\\)]', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'セリフ (その他)', pattern: '.*', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' }
];

// --- 設定：ラベルと表示タイプの定義 ---
const heroineTargetSettings = [
  { label: '話者｜//キャラ名：', type: 'bold' },
  { label: 'ト書き｜◇音声：｜方向・距離・（有声/無声）', type: 'bold' },
  { label: 'ト書き｜□演技：)｜必要であれば（ここから/ここまで）指示', type: 'bold' },
  { label: 'アドリブ演技指示｜＊〇〇　秒/回', type: 'bold' },
  { label: 'セリフ (その他)', type: 'normal' },
  { label: 'ループ用指示｜（キャラ名｜ループ：〜回/ここから/ここまで）', type: 'bg' }
];

// 判定用にラベル名だけの配列も作っておく（既存コード互換用）
const heroineTargetLabels = heroineTargetSettings.map(s => s.label);

/*　過去
const defaultFormat = [
  { label: 'トラック名', pattern: '^(トラック|Track|ＴＲＡＣＫ)', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' },
  { label: '行頭（）', pattern: '^\\s*[（\\(].*[）\\)]', active: false, bgColor: '#FFFF00', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '行頭【】', pattern: '^\\s*【.*】', active: false, bgColor: '#FFFF00', fgColor: '#000000', bold: true, fontSize: '11' },
  { label: 'ト書き (//)', pattern: '^//', active: false, bgColor: 'none', fgColor: '#E50000', bold: false, fontSize: '11' },
  { label: 'ト書き (■)', pattern: '^■', active: true, bgColor: '#FFFF00', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'ト書き (□)', pattern: '^□', active: true, bgColor: '#FFFF00', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'ト書き (◆)', pattern: '^◆', active: true, bgColor: '#D1F5FF', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'ト書き (◇)', pattern: '^◇', active: true, bgColor: '#D1F5FF', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '注釈 (※)', pattern: '^※', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'セリフ (その他)', pattern: '', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' }
];
*/

// ==========================================
// 2. 初期化処理 (ページ読み込み時)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // データのロード
  try {
    extractRules = JSON.parse(localStorage.getItem('rules_ext')) || [...defaultExtract];
    formatRules = JSON.parse(localStorage.getItem('rules_fmt')) || [...defaultFormat];
    const savedMulti = localStorage.getItem('rules_multi');
    multiRules = (savedMulti && savedMulti !== "[]") ? JSON.parse(savedMulti) : JSON.parse(JSON.stringify(defaultFormat));
  } catch (e) {
    console.error("Data Load Error:", e);
  }

  // 【追加】プロットページなら、以下の「textareaごとの自動保存」は一切行わない
  if (document.getElementById('plotPage')) {
    // プロットページ専用の初期化（renderなど）があればここに書く
    addPlotChar(); // 最初にキャラ入力欄を1つ出す
    addPlotTrack(); // 最初にトラック入力欄を1つ出す
    //renderAllRules(); // 必要なら実行
    return; // ここで処理を終了。下の inputs.forEach は実行されない
  }

  // 1. ページ内の全 textarea と input を取得
  const inputs = document.querySelectorAll('textarea');

  inputs.forEach((el) => {
    // ページ固有のキーを作成（他ページとの混同を防ぐためURLパスを含める）
    const storageKey = `auto_save_${window.location.pathname}_${el.id || el.name || el.placeholder}`;

    // 2. 復元
    const savedValue = localStorage.getItem(storageKey);
    if (savedValue !== null) {
      el.value = savedValue;
    }

    // 3. 保存（入力のたびに実行）
    el.addEventListener('input', () => {
      localStorage.setItem(storageKey, el.value);
    });
  });

  // 画面描画（要素が存在する場合のみ）
  if (document.getElementById('heroineInputs')) renderHeroineInputs();
  renderAllRules();

  // 初期プレビュー実行
  if (document.getElementById('textFormat')) runPreview();
  if (document.getElementById('textMulti')) runMultiPreview();

  //文字数と行数表示実行
  updateLineNumbers();
  refreshAllCounts();

});

// 値を書き換えた後にこれを呼ぶと、自動保存が走る
function triggerSave(el) {
  const event = new Event('input', { bubbles: true });
  el.dispatchEvent(event);
}

// ==========================================
// 3. 共通ユーティリティ
// ==========================================
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m]));
}

function updateCharCount(id, cid) {
  const target = document.getElementById(id);
  const display = document.getElementById(cid);
  if (target && display) {
    // \s は改行だけでなく、全角・半角スペースもすべて削除します
    const pureText = target.value.replace(/\s/g, "");
    display.innerText = pureText.length.toLocaleString();
  }
}

function getStyle(r) {
  if (!r) return "";
  return `background-color:${r.bgColor === 'none' ? 'transparent' : r.bgColor}; color:${r.fgColor}; font-weight:${r.bold ? 'bold' : 'normal'}; font-size:11pt;`;
}

// リロード時の末尾で、全カウントを確実に「最新ルール」で叩き直す
function refreshAllCounts() {
  // 現在のページにあるテキストエリアと、表示先のIDをマッピング
  const countMaps = [
    { areaId: 'textExtract', displayId: 'countExtract' }, // ①抽出ページ
    { areaId: 'textExtractBefore', displayId: 'countExtractBefore' }, // ①抽出ページ結果欄
    { areaId: 'textFormat', displayId: 'countFormat' }, // ②整形ページ
    { areaId: 'textMulti', displayId: 'countMulti' }  // ③複数ヒロインページ
  ];

  countMaps.forEach(map => {
    const textarea = document.getElementById(map.areaId);
    const display = document.getElementById(map.displayId);

    // 両方の要素が存在する場合のみ実行
    if (textarea && display) {
      // 共通のカウント関数を呼び出す（引数の名前に注意！）
      updateCharCount(map.areaId, map.displayId);
    }
  });
}

// ==========================================
// テキストエリアに行数追加
// ==========================================

// 行番号を更新する関数
function updateLineNumbers() {
  const ids = ['textExtract', 'textFormat', 'textMulti'];
  let textarea = null;

  // 1. ページ内に存在するテキストエリアを探す
  for (let id of ids) {
    const el = document.getElementById(id);
    if (el) {
      textarea = el;
      break;
    }
  }

  const lineNumbers = document.getElementById('lineNumbers');
  // どちらかが見つからない場合は処理を中断
  if (!textarea || !lineNumbers) return;

  // 2. 改行の数を数えて行番号を生成
  const lines = textarea.value.split('\n').length;

  // 文字列連結を繰り返すより、配列を join する方がブラウザの処理が速くなります
  const numberArray = [];
  for (let i = 1; i <= lines; i++) {
    numberArray.push(i);
  }

  lineNumbers.innerHTML = numberArray.join('<br>');
}

function syncScroll() {
  const ids = ['textExtract', 'textFormat', 'textMulti'];
  let textarea = null;

  // 1. 存在するIDを探す
  for (let id of ids) {
    const el = document.getElementById(id);
    if (el) {
      textarea = el;
      break;
    }
  }

  // 2. 見つからなければ終了
  const lineNumbers = document.getElementById('lineNumbers');
  if (!textarea || !lineNumbers) return;

  // 3. スクロール位置を同期
  lineNumbers.scrollTop = textarea.scrollTop;
}


// ==========================================
// 4. セリフ抽出・整形ロジック
// ==========================================
function applyExtract(rules) {
  const area = document.getElementById('textExtract');
  const areabefore = document.getElementById('textExtractBefore');
  if (!area || !area.value) return;

  let text = area.value;
  areabefore.value = text;
  updateCharCount('textExtractBefore', 'countExtractBefore');

  // 全体に対する一括カッコ統一（基本処理）
  text = text.replace(/\(/g, "（").replace(/\)/g, "）");

  const commentRule = rules[0];
  if (commentRule && commentRule.pattern === 'delete_comment' && commentRule.active) {
    text = text.replace(/%%%[\s\S]*?%%%/g, "");
  }

  let lines = text.split('\n');
  lines = lines.map(line => {
    // まずは前後の不要な空白だけ消す（装飾ライン判定のため）
    let newLine = line.trim();

    rules.forEach((rule, index) => {
      // 1番目(コメント削除)と非アクティブ、特殊ルールはスキップ
      if (index === 0 || !rule.active || !rule.pattern || rule.isSpecial) return;
      if (newLine === "") return; // 既に空行ならスキップ

      // --- 通常ルール（正規表現） ---
      try {
        const re = new RegExp(rule.pattern, 'g');
        if (rule.pattern.startsWith('^')) {
          if (re.test(newLine)) newLine = "";
        } else {
          newLine = newLine.replace(re, '');
        }
      } catch (e) { }
    });
    return newLine;
  });

  // 空行などを整理して反映
  area.value = lines.filter(l => l !== null).join('\n').trim();
  updateCharCount('textExtract', 'countExtract');
  //alert("完了しました");

  //保存用
  area.dispatchEvent(new Event('input'));
  areabefore.dispatchEvent(new Event('input'));
}

function runPreview() {
  const area = document.getElementById('previewArea');
  if (!area) return;

  let text = document.getElementById('textFormat')?.value || "";

  // 1. コメントルールを探す
  const commentRule = formatRules.find(r => r.pattern === 'format_comment' && r.active);

  // 2. コメント区間をマーク（改行を含む全一致）
  if (commentRule) {
    text = text.replace(/%%%[\s\S]*?%%%/g, (match) => {
      // 内部の各行にマークを付ける
      return match.split('\n').map(l => `__C_L__${l}`).join('\n');
    });
  }

  const lines = text.split('\n');
  area.innerHTML = lines.map(line => {
    let matched = null;
    let isCommentLine = line.startsWith('__C_L__');
    let displayLine = isCommentLine ? line.replace('__C_L__', '') : line;
    let trimmed = displayLine.trim();

    if (!trimmed && !isCommentLine) return "<div>&nbsp;</div>";

    if (isCommentLine) {
      matched = commentRule;
    } else {
      // --- 【重要】ここを修正：r.pattern が空でないかチェック ---
      matched = formatRules.find(r =>
        r.active &&
        r.pattern && // 空文字でないこと
        r.pattern.length > 0 &&
        !r.isSpecial &&
        new RegExp(r.pattern).test(trimmed)
      );
    }

    const style = getStyle(matched);
    return `<div style="${style}">${escapeHtml(displayLine) || '&nbsp;'}</div>`;
  }).join('');

  updateFormatDialogueCount();
}

/**
 * 複数人プレビュー：シンプル順次判定版
 */
function runMultiPreview() {
  const area = document.getElementById('previewAreaMulti');
  if (!area) return;

  let text = document.getElementById('textMulti')?.value || "";

  // 1. コメントルール(%%%)の処理
  const commentRule = typeof formatRules !== 'undefined' ? formatRules.find(r => r.pattern === 'format_comment' && r.active) : null;
  if (commentRule) {
    text = text.replace(/%%%[\s\S]*?%%%/g, (match) => {
      return match.split('\n').map(l => `__C_L__${l}`).join('\n');
    });
  }

  const heroineNames = Array.from(document.querySelectorAll('.heroine-name')).map(i => i.value.trim());
  const lines = text.split('\n');

  let currentTargetIdx = -1; // 現在誰のターンか（初期値は未定）
  let htmlResult = [];

  for (let index = 0; index < lines.length; index++) {
    let line = lines[index];
    let isCommentLine = line.startsWith('__C_L__');
    let displayLine = isCommentLine ? line.replace('__C_L__', '') : line;
    let trimmed = displayLine.trim();

    // 空行・コメント行の処理
    if (!trimmed && !isCommentLine) {
      htmlResult.push("<div style='height:1em;'>&nbsp;</div>");
      continue;
    }
    if (isCommentLine) {
      htmlResult.push(`<div style="${getStyle(commentRule)}">${escapeHtml(displayLine)}</div>`);
      continue;
    }

    // --- A. ヒロイン判定の更新 ---
    // 行頭が「//名前：」の場合、currentTargetIdx をその人のインデックスに更新する
    let nameDefMatch = trimmed.match(/^\/\/([^：: \t\n]+)[:：]/);
    if (nameDefMatch) {
      let foundIdx = heroineNames.indexOf(nameDefMatch[1].trim());
      if (foundIdx !== -1) {
        currentTargetIdx = foundIdx;
      }
    }

    // ★以前あった「startsWith('◇') || startsWith('□')」の時のループ先読み処理は完全に削除しました。
    // これにより、◇や□の指示はその瞬間の currentTargetIdx（直前の//名前：）に準拠します。

    // --- B. スタイル適用 ---

    // 1. ループ指示行（（名前｜ループ：）の形式）の判定
    // これは行内に名前が含まれるため、currentTargetIdxに関わらず指定キャラの色を適用
    let loopMatch = trimmed.match(/[（(]([^｜|]+)｜ループ：/);
    let tempTargetIdx = -1;
    if (loopMatch) {
      tempTargetIdx = heroineNames.indexOf(loopMatch[1].trim());
    }
    if (tempTargetIdx !== -1) {
      const colors = heroineColorPairs[tempTargetIdx];
      let style = `color:${colors.fg}; background-color:${colors.bg}; padding:0 4px; border-radius:2px;`;
      htmlResult.push(`<div style="${style}">${escapeHtml(displayLine)}</div>`);
      continue;
    }

    // 2. 演出指示（絶対的デフォルトルール：SEや同時など）
    // heroineTargetLabelsに含まれないものは、キャラのターンに関わらず共通色にする
    let commonRuleMatch = defaultFormat.find(r =>
      r.active && r.pattern &&
      !heroineTargetLabels.includes(r.label) &&
      new RegExp(r.pattern).test(trimmed)
    );
    if (commonRuleMatch) {
      htmlResult.push(`<div style="${getStyle(commonRuleMatch)}">${escapeHtml(displayLine)}</div>`);
      continue;
    }

    // 3. ヒロインカラー適用（音声・演技・セリフなど）
    let targetRule = defaultFormat.find(r =>
      r.active && r.pattern &&
      heroineTargetLabels.includes(r.label) &&
      new RegExp(r.pattern).test(trimmed)
    );

    if (currentTargetIdx !== -1 && targetRule) {
      const colors = heroineColorPairs[currentTargetIdx];
      let style = `color:${colors.fg};`;

      // ★メンテナンス性を高めるポイント：
      // 設定リストから、今のルール(targetRule.label)に対応する「タイプ」を検索する
      const setting = heroineTargetSettings.find(s => s.label === targetRule.label);
      const displayType = setting ? setting.type : 'normal'; // 見つからなければ通常色のみ

      if (displayType === 'bold') {
        // 【太字】
        style += `font-weight:bold;`;
      }
      else if (displayType === 'normal') {
        // 【標準】（色は付くが太くしない）
        style += `font-weight:normal;`;
      }
      else if (displayType === 'bg') {
        // 【背景色】（背景色）
        style += `background-color:${colors.bg}; padding:0 4px; border-radius:2px;`;
      }

      htmlResult.push(`<div style="${style}">${escapeHtml(displayLine)}</div>`);

    } else {
      // --- 4. それ以外（ヒロイン未確定、またはヒロイン対象外のラベル） ---
      // ここに以前の「fallbackMatch」のロジックを入れます。
      // これにより、SE（◆）やコメント（%%%）などの標準色が適用されます。
      let fallbackMatch = defaultFormat.find(r => r.active && r.pattern && new RegExp(r.pattern).test(trimmed));

      // どのルールにも当てはまらない場合は、普通の黒文字にする
      let fallbackStyle = getStyle(fallbackMatch || { fgColor: '#000000' });
      htmlResult.push(`<div style="${fallbackStyle}">${escapeHtml(displayLine)}</div>`);
    }

  }

  area.innerHTML = htmlResult.join('');
  updateCharacterDialogueCounts();
}

/**
 * 本文から名前を抽出して設定欄にセットする
 */
function autoFillHeroineNames() {
  const text = document.getElementById('textMulti')?.value || "";
  // 修正した名前抽出ロジック：//名前：形式
  const regex = /\/\/([^：: \t\n]+)[:：]/g;
  let matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const name = match[1].trim();
    if (name && !matches.includes(name)) {
      matches.push(name);
    }
    if (matches.length >= 10) break;
  }

  // 3人以上なら必要な入力欄を増やす
  const neededInputs = Math.min(matches.length, 10);
  let inputs = document.querySelectorAll('.heroine-name');
  if (neededInputs >= 3) {
    while (inputs.length < neededInputs && heroineCount < 10) {
      addHeroineInput();
      inputs = document.querySelectorAll('.heroine-name');
    }
  }

  // 入力欄を取得してセット
  inputs.forEach((input, i) => {
    if (matches[i]) {
      input.value = matches[i];
    }
  });

  // セットした後にプレビューを更新
  runMultiPreview();
}

// ==========================================
// 5. 設定管理 (UI描画・保存)
// ==========================================
function renderAllRules() {
  renderList('ruleListExtract', extractRules, 'ext');
  renderList('ruleListFormat', formatRules, 'fmt');
  renderList('ruleListMulti', multiRules, 'multi');
}

function renderList(id, rules, type) {
  const container = document.getElementById(id);
  if (!container) return;

  container.innerHTML = rules.map((r, i) => {
    let paletteHtml = "";
    if (type === 'fmt' || type === 'multi') {
      // --- 文字色・背景色のチップ生成（既存のコードと同じ） ---
      const fgOptions = [...heroineColors, "#000000"];
      let fgHtml = `<div class="palette-group"><span class="palette-label">文字:</span>`;
      fgOptions.forEach(color => {
        const isSelected = (r.fgColor && r.fgColor.toUpperCase() === color.toUpperCase());
        fgHtml += `<button class="color-chip ${isSelected ? 'selected' : ''}" style="background-color:${color};" onclick="updateRule('${type}', ${i}, 'fgColor', '${color}')" title="${color}"></button>`;
      });
      fgHtml += `</div>`;

      const bgOptions = [...heroineColorPairs.map(p => p.bg), "#FFFF00", "none"];
      let bgHtml = `<div class="palette-group"><span class="palette-label">背景:</span>`;
      bgOptions.forEach(color => {
        const isSelected = String(r.bgColor || "").toUpperCase() === String(color || "").toUpperCase();
        const displayColor = (color === 'none' ? '#ffffff' : color);
        bgHtml += `<button class="color-chip ${isSelected ? 'selected' : ''} ${color === 'none' ? 'chip-none' : ''}" style="background-color:${displayColor};" onclick="updateRule('${type}', ${i}, 'bgColor', '${color}')" title="${color}"></button>`;
      });
      bgHtml += `</div>`;
      paletteHtml = `<div class="dual-palette">${fgHtml}${bgHtml}</div>`;
    }

    return `
      <div class="rule-card" data-index="${i}">
          <div class="rule-header">
            <div class="handle" style="cursor: grab; color: #ccc; margin-right: 10px; font-size: 20px; user-select: none;">☰</div>
            
            <input type="checkbox" ${r.active ? 'checked' : ''} onchange="updateRule('${type}',${i},'active',this.checked)">
            
            <div class="rule-info">
              <input type="text" class="rule-label-input" placeholder="ラベル" value="${r.label}" onchange="updateRule('${type}',${i},'label',this.value)">
              <input type="text" class="rule-pattern" placeholder="正規表現パターン" value="${r.pattern || ''}" onchange="updateRule('${type}',${i},'pattern',this.value)" ${r.isSpecial ? 'disabled' : ''}>
            </div>
            ${paletteHtml}
            <button class="btn-danger" onclick="deleteRule('${type}',${i})" title="削除">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
    `;
  }).join('');

  // リスト描画後に SortableJS を適用
  initSortableForList(id, type);
}

/*条件リストの並べ替え実行関数*/

function initSortableForList(id, type) {
  const el = document.getElementById(id);
  if (!el || typeof Sortable === 'undefined') return;

  Sortable.create(el, {
    handle: '.handle', // ☰ 部分でのみドラッグ可能
    ghostClass: 'ghost',
    onEnd: function () {
      // 1. DOMの現在の並びから、元の配列のどのインデックスがどの順になったか取得
      const newOrder = Array.from(el.children).map(item => parseInt(item.getAttribute('data-index')));

      // 2. 対象となる配列を特定
      let targetArray;
      if (type === 'ext') targetArray = extractRules;
      else if (type === 'fmt') targetArray = formatRules;
      else if (type === 'multi') targetArray = multiRules;

      // 3. 配列を新しい順番に再構築
      const reordered = newOrder.map(oldIdx => targetArray[oldIdx]);

      // 4. 元のグローバル変数を更新
      if (type === 'ext') extractRules = reordered;
      else if (type === 'fmt') formatRules = reordered;
      else if (type === 'multi') multiRules = reordered;

      // 5. インデックス（data-index）を正しく振り直すために再描画
      renderList(id, reordered, type);

      // 6. 設定を保存し、プレビューを更新
      saveSettings(type);
      if (type === 'fmt') runPreview();
      if (type === 'multi') runMultiPreview();
    }
  });
}

// ボタンクリック時に文字色と背景色を同時に更新する関数
function applyColorPattern(type, index, fg, bg) {
  const list = type === 'ext' ? extractRules : type === 'fmt' ? formatRules : multiRules;
  list[index].fgColor = fg;
  list[index].bgColor = bg;

  saveSettings(type);
  renderAllRules(); // 見た目を更新
  if (type === 'fmt') runPreview();
  if (type === 'multi') runMultiPreview();
}

function updateRule(type, i, key, val) {
  const list = type === 'ext' ? extractRules : type === 'fmt' ? formatRules : multiRules;
  list[i][key] = val;
  saveSettings(type);
  renderAllRules();
  if (type === 'fmt') runPreview();
  if (type === 'multi') runMultiPreview();
}

function saveSettings(type) {
  const list = type === 'ext' ? extractRules : type === 'fmt' ? formatRules : multiRules;
  localStorage.setItem('rules_' + type, JSON.stringify(list));
}

function deleteRule(type, i) {
  const list = type === 'ext' ? extractRules : type === 'fmt' ? formatRules : multiRules;
  list.splice(i, 1);
  renderAllRules();
  saveSettings(type);
}

// 新しいルールを追加する関数
function addNewRule(type) {
  const list = type === 'ext' ? extractRules : type === 'fmt' ? formatRules : multiRules;

  // デフォルトの新規ルール構造
  const newRule = {
    label: '新規ルール',
    pattern: '',
    active: true,
    bgColor: 'none',
    fgColor: '#000000',
    bold: false,
    fontSize: '11'
  };

  list.push(newRule);

  // 画面を再描画して保存
  renderAllRules();
  saveSettings(type);
}

// 設定をデフォルトに戻す関数
function resetToDefault(type) {

  if (type === 'ext') {
    // 抽出ルールをデフォルトコピーに戻す
    extractRules = JSON.parse(JSON.stringify(defaultExtract));
    saveSettings('ext');
  } else if (type === 'fmt') {
    // 一人用書式をデフォルトコピーに戻す
    formatRules = JSON.parse(JSON.stringify(defaultFormat));
    saveSettings('fmt');
    runPreview(); // プレビュー更新
  } else if (type === 'multi') {
    // 複数人用書式をデフォルトコピーに戻す
    multiRules = JSON.parse(JSON.stringify(defaultFormat));
    saveSettings('multi');
    runMultiPreview(); // プレビュー更新
  }

  // 画面のリスト表示を更新
  renderAllRules();
  alert("デフォルトに戻しました。");
}

/**
 * 規定の書式をクリップボードにコピー
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // 簡易的な通知（お好みでトースト通知などに変えてください）
    //console.log("Copied: " + text);
  }).catch(err => {
    //console.error("Copy failed", err);
  });
}

/**
 * テキストエリアから「//名前：」を抽出してボタンを生成
 */
function updateNameButtons(ID) {

  const textarea = document.getElementById(ID);
  const container = document.getElementById('dynamicNameButtons');

  // textarea（上で定義した変数）から値を取得
  const text = textarea.value;
  //console.log("現在のテキスト内容(先頭20文字):", text.substring(0, 20));

  if (!container) return;

  // 「//名前：〇〇」を検索（最大5個）
  const regex = /\/\/([^：: \t\n]+)[:：]/g;
  let matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const name = match[1].trim();
    if (name && !matches.includes(name)) {
      matches.push(name);
      //console.log("名前を検出:", name);
    }
    if (matches.length >= 5) break;
  }

  // ボタンを生成
  if (matches.length === 0) {
    container.innerHTML = "";
  } else {
    container.innerHTML = matches.map(name => `
      <div class="name-button-group">
        <button class="btn-copy btn-name" onclick="copyToClipboard('//${name}：')">//${name}：</button>
        <button class="btn-copy btn-name" onclick="copyToClipboard('（${name}｜ループ：　ここから）')">（${name}）ループ始</button>
        <button class="btn-copy btn-name" onclick="copyToClipboard('（${name}｜ループ：　ここまで）')">（${name}）ループ終</button>
      </div>
    `).join('');
  }
}

// テキスト入力のたびに名前ボタンを更新するように、既存のoninputに繋げる
// 既存の updateCharCount や runPreview と一緒に実行してください

// ==========================================
// データクリア　処理
// ==========================================

/**
 * テキストエリアとプレビューをリセットする関数
 * @param {string} type - 'extract' (抽出用), 'fmt' (一人用), 'multi' (複数用)
 */
function clearData(type) {
  // ユーザーに確認
  //if (!confirm("入力されたテキストとプレビューを消去しますか？")) {return;}

  const checkArea = document.getElementById('textCheck');
  if (checkArea) {
    checkArea.value = "";
    checkArea.style.color = "black"; // 文字色もデフォルト（黒）に戻しておく
    checkArea.dispatchEvent(new Event('input'));
  }

  if (type === 'extract') {
    const textArea = document.getElementById('textExtract');
    const textAreaBefore = document.getElementById('textExtractBefore');
    if (textArea) textArea.value = '';
    if (textAreaBefore) textAreaBefore.value = '';
    textAreaBefore.style.color = "black";
    refreshAllCounts(type);
    updateCharCount('textExtractBefore', 'countExtractBefore');
    textArea.dispatchEvent(new Event('input'));
    textAreaBefore.dispatchEvent(new Event('input'));
  }
  else if (type === 'fmt') {
    const textArea = document.getElementById('textFormat');
    const previewArea = document.getElementById('previewArea');
    if (textArea) textArea.value = '';
    if (previewArea) previewArea.innerHTML = '';
    // ★重要：プレビュー更新関数を呼び出して、画面をリフレッシュする
    if (typeof runPreview === 'function') { runPreview(); }
    // 文字数カウントもリセット
    refreshAllCounts(type);
    if (typeof updateFormatDialogueCount === 'function') { updateFormatDialogueCount(); }
    textArea.dispatchEvent(new Event('input'));
  }
  else if (type === 'multi') {
    const textArea = document.getElementById('textMulti');
    const previewArea = document.getElementById('previewAreaMulti');

    // メインテキストエリアとプレビューのクリア
    if (textArea) textArea.value = '';
    if (previewArea) previewArea.innerHTML = '';

    // ヒロイン名入力欄をすべて空にする
    const heroineInputs = document.querySelectorAll('#heroineInputs .heroine-name');
    heroineInputs.forEach(input => {
      input.value = '';
    });

    refreshAllCounts(type);
    if (typeof updateCharacterDialogueCounts === 'function') { updateCharacterDialogueCounts(); }
    textArea.dispatchEvent(new Event('input'));
  }
  else if (type === 'plot') {
    // 基本項目
    ['p-title', 'p-summary', 'p-summary-long', 'p-hero-setting', 'p-concept', 'p-thumbnail', 'plotResult'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    // 動的項目
    document.getElementById('plot-chars').innerHTML = "";
    document.getElementById('plot-tracks').innerHTML = "";
    // 初期枠の作成
    addPlotChar();
    for (let i = 0; i < 1; i++) addPlotTrack();
    // 文字数表示をすべて 0 に
    refreshAllCounts();
  }
}

// ==========================================
// 台本チェック　処理
// ==========================================

/**
 * 1. ここから　ここまで　チェック
 */

//テキストの取得
function runScriptCheck() {
  // 1. 対象のテキストエリアを探す
  const ids = ['textExtract', 'textFormat', 'textMulti'];
  let targetElement = null;

  for (let id of ids) {
    const el = document.getElementById(id);
    if (el) {
      targetElement = el;
      break;
    }
  }

  // 結果出力先の textarea を取得
  const outputArea = document.getElementById('textExtractBefore') || document.getElementById('textCheck');

  if (!targetElement || !outputArea) {
    console.error("入力元または出力先の要素が見つかりません");
    return;
  }

  const scriptText = targetElement.value;

  // 出力先がない場合のエラー回避
  if (!outputArea) {
    console.error("出力先の textarea (id='textCheck') が見つかりません");
    return;
  }

  // 4. 空チェック（出力先に書き込む）
  if (!scriptText.trim()) {
    outputArea.value = "【エラー】テキストを入力してください。";
    outputArea.style.color = "red"; // 任意：エラー時に文字色を変える
    return;
  }

  // 5. 本体でチェックを実行
  const result = checkDelimitedSections(scriptText);

  // 6. 結果の書き込み
  if (!result.isValid) {
    // エラーがある場合
    outputArea.value = "【構成エラー】\n" + result.errors.join('\n');
    outputArea.style.color = "red";
  } else {
    // 成功時
    outputArea.value = "チェック完了！\n「ここから・ここまで」のペアは完璧です。";
    outputArea.style.color = "blue"; // 任意：成功時に文字色を変える
  }
  outputArea.dispatchEvent(new Event('input'));
}

//チェック関数の本体
function checkDelimitedSections(text) {
  const lines = text.split('\n');
  let openSections = []; // スタックではなく、現在開いているセクションの配列
  const errors = [];

  const indicatorRegex = /^[（(◆◇【\[■□※＊《()（）[\]】》]/;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const rowNum = index + 1;

    if (!indicatorRegex.test(trimmedLine)) return;

    // 「ここから」判定
    if (trimmedLine.includes('ここから')) {
      let label = trimmedLine.split('ここから')[0]
        .replace(/[()（）◆◇■□【】\[\]※＊《》]/g, '')
        .trim();
      // 開いているリストに追加
      openSections.push({ label, line: rowNum, fullText: trimmedLine });
    }
    // 「ここまで」判定
    else if (trimmedLine.includes('ここまで')) {
      let endLabel = trimmedLine.split('ここまで')[0]
        .replace(/[()（）◆◇■□【】\[\]※＊《》]/g, '')
        .trim();

      // 現在開いているリストの中から、ラベルが一致するものを探す（後ろから探すのが安全）
      const foundIndex = openSections.findLastIndex(item => isLabelMatch(item.label, endLabel));

      if (foundIndex === -1) {
        errors.push(`行 ${rowNum}: 「ここから」がないか、ラベルが不一致な「${trimmedLine}」があります。`);
      } else {
        // 一致するものが見つかったら、その要素だけを削除（交差を許容）
        openSections.splice(foundIndex, 1);
      }
    }
  });

  // 閉じ忘れチェック
  openSections.forEach(unclosed => {
    errors.push(`行 ${unclosed.line}: 「${unclosed.fullText}」が閉じられていません。`);
  });

  return { isValid: errors.length === 0, errors };
}

function isLabelMatch(startLabel, endLabel) {
  // 仕様③：「ループ：上記」対応
  // 「：上記」や末尾の「：」を無視して比較
  const normalize = (s) => {
    return s
      .replace(/上記/g, '') // 「上記」という文字をどこにあっても消す
      .replace(/[：:]/g, '') // 全角・半角のコロンを消す
      .trim();              // 前後の空白を消す
  };

  return normalize(startLabel) === normalize(endLabel);
}
/**
 * 2. アドリブ抽出
 */

function extractAdlibCommands() {
  const ids = ['textMulti', 'textFormat', 'textExtract'];
  let targetElement = null;
  let sourceId = "";

  for (let id of ids) {
    const el = document.getElementById(id);
    if (el && el.value.trim() !== "") {
      targetElement = el;
      sourceId = id;
      break;
    }
  }

  const outputArea = document.getElementById('textExtractBefore') || document.getElementById('textCheck');
  if (!targetElement || !outputArea) return;

  // --- 入力欄のチェック ---
  let heroineInputs = document.querySelectorAll('#heroineInputs .heroine-name');
  let orderedHeroineNames = Array.from(heroineInputs).map(i => i.value.trim()).filter(n => n !== "");

  // ★改良：ヒロイン名が一つも入力されていない場合
  if (sourceId === 'textMulti' && orderedHeroineNames.length === 0) {
    // 1. 自動入力関数を実行
    autoFillHeroineNames();

    // 2. 補完された名前をすぐに再取得
    heroineInputs = document.querySelectorAll('#heroineInputs .heroine-name');
    orderedHeroineNames = Array.from(heroineInputs).map(i => i.value.trim()).filter(n => n !== "");

    // ユーザーに優しく通知（オプション：不要なら消してもOK）
    console.log("キャラ名が空だったため、自動補完（キャラ1...）を適用しました。");
  }

  const scriptText = targetElement.value;
  const lines = scriptText.split('\n');
  const adlibRegex = /＊[^(\n]*?(秒|回)[^\n]*/g;

  let resultText = "";

  if (sourceId === 'textMulti') {
    let currentHeroine = "共通/未特定";
    let adlibsByHeroine = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      let nameDefMatch = trimmed.match(/^\/\/([^：: \t\n]+)[:：]/);
      if (nameDefMatch) {
        currentHeroine = nameDefMatch[1].trim();
        return;
      }

      const matches = line.match(adlibRegex);
      if (matches) {
        if (!adlibsByHeroine[currentHeroine]) adlibsByHeroine[currentHeroine] = [];
        matches.forEach(m => adlibsByHeroine[currentHeroine].push(m.trim()));
      }
    });

    // --- 修正：入力欄の順番（orderedHeroineNames）に従って出力を作る ---

    // 1. まず「共通/未特定」があれば最初に出す
    if (adlibsByHeroine["共通/未特定"]) {
      resultText += `【共通/未特定】\n` + adlibsByHeroine["共通/未特定"].join('\n') + '\n\n';
    }

    // 2. 入力欄に並んでいる名前の順に、抽出したデータを結合する
    orderedHeroineNames.forEach(name => {
      if (adlibsByHeroine[name]) {
        resultText += `【${name}】\n` + adlibsByHeroine[name].join('\n') + '\n\n';
      }
    });

  } else {
    let allMatches = [];
    lines.forEach(line => {
      const matches = line.match(adlibRegex);
      if (matches) {
        matches.forEach(m => allMatches.push(m.trim()));
      }
    });
    resultText = allMatches.join('\n');
  }

  // （抽出ループが終わった後の出力部分）
  let headerNote = "";
  if (sourceId === 'textMulti') {
    headerNote = `【自動判定】キャラ名（${orderedHeroineNames.join('、')}）で抽出しました。\n`;
  }

  outputArea.value = resultText
    ? `=== アドリブ抽出結果 ===\n${headerNote}\n` + resultText.trim()
    : "アドリブ指示（＊〜秒/回）は見つかりませんでした。";

  outputArea.style.color = "black";
  outputArea.dispatchEvent(new Event('input'));
}

// ==========================================
// 台本整形ツールのセリフカウント
// ==========================================

/**
 * 1. 【解析】セリフデータを集計する共通関数
 * この関数は画面を書き換えません。純粋に計算結果（データ）だけを返します。
 */
function analyzeDialogueData(inputText) {
  if (!inputText) return { total: 0, byCharacter: {} };

  let text = inputText;

  // 1. カッコ統一 (applyExtractと同じ)
  text = text.replace(/\(/g, "（").replace(/\)/g, "）");

  // 2. コメントブロックの完全削除 (%%%...%%%)
  text = text.replace(/%%%[\s\S]*?%%%/g, "");

  const lines = text.split('\n');
  const stats = { total: 0, byCharacter: {} };
  let currentName = "メイン";

  lines.forEach(line => {
    let newLine = line.trim();
    if (!newLine) return;

    // 話者判定（//名前：）
    const nameMatch = newLine.match(/^\/\/(.*?)[:：]/);
    if (nameMatch) {
      currentName = nameMatch[1].trim();
      return;
    }

    // 3. defaultExtractを順番に適用して文字を削る
    defaultExtract.forEach((rule) => {
      if (!rule.active || !rule.pattern) return;

      try {
        const re = new RegExp(rule.pattern, 'g');
        // Extractルールなので、見つけたら「空文字」に置換（消去）
        newLine = newLine.replace(re, '');
      } catch (e) {
        console.error("Regex error in defaultExtract:", e);
      }
    });

    // 4. 生き残った文字をカウント
    const finalTrimmed = newLine.trim();
    if (finalTrimmed !== "") {
      const len = finalTrimmed.length;
      stats.total += len;
      stats.byCharacter[currentName] = (stats.byCharacter[currentName] || 0) + len;
    }
  });

  return stats;
}

/*
 * 上記の解析関数を呼び出して、画面に反映させる
*/

//一人台本用
function updateFormatDialogueCount() {
  const input = document.getElementById('textFormat').value;
  const display = document.getElementById('formatDialogueCount');
  // display要素がない時だけ中断する（inputが空でも処理を続行する）
  if (!display) return;

  // inputが空の場合は、解析せずに「0 文字」にする
  if (!input || input.trim() === "") {
    display.innerText = `セリフ：0 文字`;
    return;
  }

  const stats = analyzeDialogueData(input);
  display.innerText = `セリフ：${stats.total} 文字`;
}

//複数人台本用
function updateCharacterDialogueCounts() {
  const input = document.getElementById('textMulti').value;
  const totalDisplay = document.getElementById('multiDialogueCount');
  const breakdownDisplay = document.getElementById('characterBreakdown');

  if (!input) {
    if (totalDisplay) totalDisplay.innerText = "合計セリフ：0 文字";
    if (breakdownDisplay) breakdownDisplay.style.display = 'none';
    return;
  }

  // 解析関数を呼び出す
  const stats = analyzeDialogueData(input);

  // 全体表示
  totalDisplay.innerHTML = `合計セリフ：<strong>${stats.total}</strong> 文字 <small style="display: block; font-size: 0.8em; color: #999; margin-top: 2px;">※「①セリフのみ抽出」の保存済み条件を適用</small>`;

  // キャラ別内訳
  const names = Object.keys(stats.byCharacter);
  if (names.length > 0) {
    breakdownDisplay.style.display = 'block';
    breakdownDisplay.innerHTML = "<strong>【キャラ別内訳】</strong><br>" +
      names.map(name => `・${name}：${stats.byCharacter[name]} 文字`).join(' ／ ');
  } else {
    breakdownDisplay.style.display = 'none';
  }
}

function formatNumberWithComma(value) {
  return Number(value).toLocaleString('ja-JP');
}

function formatPercent(part, total) {
  if (!total) return '0%';
  const percent = (part / total) * 100;
  return `${percent.toFixed(1).replace(/\.0$/, '')}%`;
}

function parseTrackTitle(line, index) {
  const cleaned = line.replace(/＝＊＝/g, '').replace(/[\s　]+/g, ' ').trim();
  const match = cleaned.match(/(トラック|ＴＲＡＣＫ|Track)(.*)/i);
  if (!match) {
    return `トラック${String(index).padStart(2, '0')}`;
  }

  const suffix = match[2].trim();
  if (!suffix) {
    return `トラック${String(index).padStart(2, '0')}`;
  }

  return `${match[1]}${suffix}`;
}

function extractTrackSections(inputText) {
  const lines = inputText.split(/\r?\n/);
  const trackPattern = /^(トラック|ＴＲＡＣＫ|Track)/i;
  const sections = [];
  let current = null;
  let trackIndex = 0;
  let isInCommentBlock = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.includes('%%%')) {
      const count = (trimmed.match(/%%%/g) || []).length;
      if (count % 2 === 1) {
        isInCommentBlock = !isInCommentBlock;
      }
    }

    if (!isInCommentBlock && trackPattern.test(trimmed)) {
      trackIndex += 1;
      if (current) {
        sections.push(current);
      }
      current = {
        title: parseTrackTitle(trimmed, trackIndex),
        text: ''
      };
      return;
    }

    if (current) {
      current.text += `${line}\n`;
    }
  });

  if (current) {
    sections.push(current);
  }

  if (sections.length === 0) {
    sections.push({ title: 'トラック01', text: inputText });
  }

  return sections;
}

function countCharactersByTrack() {
  const textareaIds = ['textFormat', 'textMulti'];
  let textarea = null;
  for (const id of textareaIds) {
    const el = document.getElementById(id);
    if (el && el.value.trim() !== '') {
      textarea = el;
      break;
    }
  }

  if (!textarea) {
    alert('台本を入力してください。');
    return;
  }

  const outputArea = document.getElementById('textCheck');
  if (!outputArea) return;

  const inputText = textarea.value;
  const overallStats = analyzeDialogueData(inputText);
  const sections = extractTrackSections(inputText);
  let result = '';
  let cumulativeTotal = 0;

  // heroineInputs から順番を取得
  let heroineInputs = document.querySelectorAll('#heroineInputs .heroine-name');
  let orderedHeroineNames = Array.from(heroineInputs).map(i => i.value.trim()).filter(n => n !== "");

  // 全体の統計を最初に追加
  const allOverallNames = Object.keys(overallStats.byCharacter);
  const orderedOverallNames = orderedHeroineNames.filter(name => allOverallNames.includes(name));
  const remainingOverallNames = allOverallNames.filter(name => !orderedHeroineNames.includes(name)).sort((a, b) => overallStats.byCharacter[b] - overallStats.byCharacter[a]);
  const overallNames = [...orderedOverallNames, ...remainingOverallNames];
  const overallCharacterParts = overallNames.length > 0
    ? overallNames.map(name => `${name}：${formatNumberWithComma(overallStats.byCharacter[name])}`).join('｜')
    : 'なし';
  result += `・全体｜${formatNumberWithComma(overallStats.total)}文字\n　${overallCharacterParts}\n\n`;

  sections.forEach((section) => {
    const sectionStats = analyzeDialogueData(section.text);
    const allNames = Object.keys(sectionStats.byCharacter);
    const orderedNames = orderedHeroineNames.filter(name => allNames.includes(name));
    const remainingNames = allNames.filter(name => !orderedHeroineNames.includes(name)).sort((a, b) => sectionStats.byCharacter[b] - sectionStats.byCharacter[a]);
    const names = [...orderedNames, ...remainingNames];
    cumulativeTotal += sectionStats.total;

    const characterParts = names.length > 0
      ? names.map(name => `${name}：${formatNumberWithComma(sectionStats.byCharacter[name])}`).join('｜')
      : 'なし';

    //result += `・${section.title}｜${formatNumberWithComma(sectionStats.total)}文字（${formatPercent(sectionStats.total, overallStats.total)}）｜累計：${formatNumberWithComma(cumulativeTotal)}（${formatPercent(cumulativeTotal, overallStats.total)}）\n　→${characterParts}\n`;

    result += `・${section.title}｜${formatNumberWithComma(sectionStats.total)}文字｜累計：${formatNumberWithComma(cumulativeTotal)}（${formatPercent(cumulativeTotal, overallStats.total)}）→${characterParts}\n`;
  });

  outputArea.value = result.trim();
  outputArea.dispatchEvent(new Event('input'));
}

// ==========================================
// セリフカウント詳細
// ==========================================

function executeReplace() {
  const area = document.getElementById('textExtract');
  const areabefore = document.getElementById('textExtractBefore');
  const b = document.getElementById('replaceBefore').value;
  const a = document.getElementById('replaceAfter').value;

  if (!b) return;
  areabefore.value = area.value;
  updateCharCount('textExtractBefore', 'countExtractBefore');

  const re = new RegExp(b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  area.value = area.value.replace(re, a);
  updateCharCount('textExtract', 'countExtract');

  //保存処理
  area.dispatchEvent(new Event('input'));
  areabefore.dispatchEvent(new Event('input'));
}

function shrinkBlankLines(id) {
  if (id === 'textExtract') {
    const area = document.getElementById('textExtract');
    const areabefore = document.getElementById('textExtractBefore');
    let text = area.value;
    areabefore.value = text;
    updateCharCount('textExtractBefore', 'countExtractBefore');

    //保存処理
    areabefore.dispatchEvent(new Event('input'));
  }
  const a = document.getElementById(id); a.value = a.value.replace(/\n{3,}/g, '\n\n'); runPreview(); runMultiPreview();
  a.dispatchEvent(new Event('input'));
}

/**
 * 同梱用台本データまとめて処理
 */

const Bundlingrules = [
  { label: 'コメント行削除（%%% ~ %%% ）', pattern: 'delete_comment', active: true, isSpecial: true },
  { label: 'ト書き行削除', pattern: '^\\s*(◆|■|※|◇|□|＊).*', active: true },
  { label: 'ト書き行削除', pattern: '^\\s*(SE|SE).*', active: true },
  { label: '【】内削除', pattern: '【[^】]*】', active: true },
  { label: '()内削除', pattern: '[（\\(][^）\\)]*[）\\)]', active: true },
  { label: '《》内削除', pattern: '《[^》]*》', active: true },
  { label: 'スペース削除（文章の途中のスペースも削除）', pattern: '[ 　]', active: true }
];

function makeincluded() {

  // テキストエリアの最初の文字列を保持しておく
  const area = document.getElementById('textExtract');
  const areabefore = document.getElementById('textExtractBefore');
  if (!area || !area.value) return;
  let text = area.value;

  // セリフ出力と空白行詰め関数を順番に回す
  applyExtract(Bundlingrules)
  shrinkBlankLines('textExtract')

  // 変形前台本をbeforeエリアに出力&文字数再カウント&inputイベント処理
  areabefore.value = text;
  updateCharCount('textExtractBefore', 'countExtractBefore');
  areabefore.dispatchEvent(new Event('input'));

}

/**
 * 指定されたtextarea内の空白行をすべて削除して詰める
 */
function removeAllBlankLines(targetId) {
  const area = document.getElementById(targetId);
  if (!area || !area.value) return;

  const areabefore = document.getElementById('textExtractBefore');
  areabefore.value = area.value;
  updateCharCount('textExtractBefore', 'countExtractBefore');

  // 1. 改行を消す
  // 2. 半角スペース・タブ・改行などの空白文字(\s)をすべて消す
  // 3. 全角スペース(　)をすべて消す
  const joinedText = area.value
    .replace(/\r?\n/g, '')     // 改行を削除
    .replace(/[\s　]/g, '');    // 半角/全角スペース・タブを削除

  area.value = joinedText;

  // 文字数カウントも更新しておく
  const countId = targetId === 'textExtract' ? 'countExtract' : 'countFormat';
  updateCharCount(targetId, countId);

  //保存処理
  area.dispatchEvent(new Event('input'));
  areabefore.dispatchEvent(new Event('input'));
}

/**
 * 指定されたtextarea内の空白行（空または空白のみの行）を削除（改行は保持）
 */

function removeBlankLinesOnly(targetId, displayAreaId = null) {
  const area = document.getElementById(targetId);
  if (!area || !area.value) return;

  // 1. 行単位に分割
  const lines = area.value.split('\n');

  // 2. 空白行（空文字列、または空白のみ）を削除
  const filteredLines = lines.filter(line => line.trim() !== '');

  // 3. 改行で再結合
  const result = filteredLines.join('\n');
  area.value = result;

  // 4. 文字数カウントを更新（targetIdに対応するカウント表示IDを自動判定）
  const countIdMap = {
    'textExtract': 'countExtract',
    'textExtractBefore': 'countExtractBefore',
    'textFormat': 'countFormat',
    'textMulti': 'countMulti'
  };
  const countId = countIdMap[targetId] || displayAreaId;
  if (countId) {
    updateCharCount(targetId, countId);
  }

  // 5. 自動保存実行
  area.dispatchEvent(new Event('input'));
}

function updatePlotCharCount(textarea, displayId) {
  const display = document.getElementById(displayId);
  if (display) {
    // 改行を除いて数える場合は .replace(/\n/g, "") を入れる
    const count = textarea.value.replace(/\n/g, "").length;
    display.innerText = count;

    // あらすじ（200〜210字）のバリデーション
    if (displayId === 'p-summary-cnt') {
      if (count >= 205 && count <= 210) {
        // --- 通常（205~210字）：OKな状態 ---
        display.style.color = "#2ecc71"; // 安心感のある緑
        display.style.fontWeight = "bold";
        textarea.style.color = "#333";    // 文字は読みやすく通常色
        textarea.style.borderColor = "#2ecc71"; // 枠線を緑にして「OK」を表現
        textarea.style.backgroundColor = "#fafffa"; // ほんのり緑背景
      } else {
        // --- 205文字より少ない、または 210文字より多い：警告状態 ---
        display.style.color = "red";
        display.style.fontWeight = "bold";
        textarea.style.color = "red";     // 注意を促すため赤
        textarea.style.borderColor = "red";
        textarea.style.backgroundColor = "#fffafb"; // ほんのり赤背景
      }
    }
  }
}

// ==========================================
// 空白行を追加する
// ==========================================

/**
 * 違う種類の記号や指示の間に空行を追加する
 */
function addLineBreaksBetweenTypes() {
  const ids = ['textExtract', 'textFormat', 'textMulti'];
  let targetArea = null;

  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.offsetHeight > 0) {
      targetArea = el;
      break;
    }
  }

  if (!targetArea || !targetArea.value.trim()) return;

  const lines = targetArea.value.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);

    if (i < lines.length - 1) {
      // 外側で定義した共通の getLineType を呼び出す
      const currentType = getLineType(lines[i]);
      const nextType = getLineType(lines[i + 1]);

      if (currentType !== 'empty' && nextType !== 'empty' && currentType !== nextType) {
        result.push('');
      }
    }
  }

  // 連続した空行を1行にまとめる（仕上がりが綺麗になります）
  targetArea.value = result.join('\n').replace(/\n{3,}/g, '\n\n');
  targetArea.dispatchEvent(new Event('input'));
}

/**
 * 【共通ルール】行頭の記号の種類を判定する
 */
const getLineType = (line) => {
  const trimmed = line.trim();
  if (!trimmed) return 'empty';

  if (trimmed.startsWith('//')) return 'name';
  if (trimmed.startsWith('【')) return 'label';
  if (trimmed.startsWith('※')) return 'comp';
  if (trimmed.startsWith('%%%')) return 'comme';
  if (trimmed.startsWith('＊')) return 'ad';
  if (trimmed.startsWith('《')) return 'situation';

  // ◆ と ■ を同じ種類 'se' としてグループ化
  if (trimmed.startsWith('◆') || trimmed.startsWith('■')) return 'se';

  // ◇ と □ を同じ種類 'instruction' としてグループ化
  if (trimmed.startsWith('◇') || trimmed.startsWith('□')) {
    return 'instruction';
  }

  if (trimmed.startsWith('（') || trimmed.startsWith('(')) return 'direction';

  return 'dialogue'; // どれにも当てはまらなければセリフ
};

// ==========================================
// 複数ヒロイン設定
// キャラ名が変更したら都度プレビューを更新する
// ==========================================


function renderHeroineInputs() {
  const container = document.getElementById('heroineInputs');
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < heroineCount; i++) {
    const div = document.createElement('div');
    div.innerHTML = `<label style="font-size:11px">キャラ${i + 1}</label><br>
    <input type="text" class="heroine-name" oninput="runMultiPreview()" style="border:2px solid ${heroineColors[i]}; width:90%; padding:4px;">`;
    container.appendChild(div);
  }
}

function addHeroineInput() { if (heroineCount < 10) { heroineCount++; renderHeroineInputs(); } }

function clearHeroineNames() {
  const inputs = document.querySelectorAll('#heroineInputs .heroine-name');
  inputs.forEach((input) => {
    input.value = "";
    triggerSave(input);
  });
  runMultiPreview();
}

// ==========================================
// 複数ヒロイン設定
// キャラ毎の台本出力
// ==========================================

//ツール使用関数
async function exportAllHeroinesToWord() {
  // --- A. ラジオボタンの状態を取得 ---
  const wordMode = document.querySelector('input[name="wordMode"]:checked').value;
  const isVerticalMode = (wordMode === 'v');

  const textarea = document.getElementById('textMulti');
  const outputArea = document.getElementById('textCheck'); // 通知用のエリア
  if (!textarea || textarea.value.trim() === "") return alert("入力欄にテキストがありません。");

  // --- 0. 名前未入力チェックと自動補完 ---
  let heroineInputs = document.querySelectorAll('#heroineInputs .heroine-name');
  let heroineNames = [...heroineInputs].map(i => i.value.trim()).filter(n => n !== "");

  if (heroineNames.length === 0) {
    // 自動補完を実行
    autoFillHeroineNames();

    // 補完後の名前を再取得
    heroineInputs = document.querySelectorAll('#heroineInputs .heroine-name');
    heroineNames = [...heroineInputs].map(i => i.value.trim()).filter(n => n !== "");

    // 3. 補完結果を箇条書きで textCheck に出力
    if (outputArea) {
      const nameList = heroineNames.map(name => `・ ${name}`).join('\n');
      outputArea.value = `【お知らせ】キャラ名が未入力だったため、以下の名前で自動補完してWordを生成しました。\n\n${nameList}`;
      outputArea.style.color = "red";
    }
  } else {
    // 正常な場合は以前のメッセージを消すか色を戻す（任意）
    if (outputArea) outputArea.style.color = "black";
  }

  // --- 1. 設定データの取得と初期化 ---
  const commentRule = typeof formatRules !== 'undefined' ? formatRules.find(r => r.pattern === 'format_comment' && r.active) : null;

  // Word用にカラーコードを変換（#FFFFFF -> FFFFFF）
  const cleanHex = (hex) => (hex || "#000000").replace('#', '');

  // --- 2. ヒロインごとのメインループ ---
  const lines = getParsedScriptLines(textarea);
  for (let hIdx = 0; hIdx < heroineNames.length; hIdx++) {
    const targetHeroine = heroineNames[hIdx];
    const filteredLines = [];
    let isActiveFlag = false;

    lines.forEach(line => {
      const trimmed = line.text.trim();
      let shouldOutput = false;

      // ① コメントブロック内（全員出力）
      if (line.text.includes("%%%")) {
        shouldOutput = true;
      }
      // ② 共通項目（全員出力）
      else if (trimmed.includes("トラック") || trimmed.includes("Track") || trimmed.includes("＝＊＝") || trimmed.match(/[（(]([^｜|]+)[｜|]ループ\s*[：:]/)) {
        shouldOutput = true;
      }
      // ③ ヒロイン切り替え（//名前：）
      else {
        const nameDefMatch = trimmed.match(/^\/\/([^：: \t\n]+)[:：]/);
        if (nameDefMatch) {
          const foundName = nameDefMatch[1].trim();
          if (foundName === targetHeroine) {
            isActiveFlag = true;
            shouldOutput = true;
          } else if (heroineNames.includes(foundName)) {
            isActiveFlag = false;
            return;
          }
        }

        // ④ 通常セリフ（フラグがONの時だけ出す）
        if (!shouldOutput) {
          if (isActiveFlag) {
            shouldOutput = true;
          } else {
            return;
          }
        }
      }

      if (shouldOutput) {
        filteredLines.push(line);
      }
    });

    // --- 3. Wordファイル生成の実行 ---
    if (filteredLines.length > 0) {
      await generateWordFile(targetHeroine, filteredLines, isVerticalMode);
    }
  }
}

// Word生成サブ関数
async function generateWordFile(heroineName, lines, isVertical = false) {
  const { Document, Packer, Paragraph, TextRun } = docx;

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1701, bottom: 1701, left: 1701, right: 1701 } }
      },
      children: lines.map(line => {
        // --- 縦書きモードなら濁点をずらす ---
        let processedText = line.text || "";
        if (isVertical && processedText !== "") {
          processedText = fixVoicedSoundMark(processedText);
        }

        // タブと文字を分けてハイライトを文字部分のみに適用
        const tabMatch = processedText.match(/^(\t*)(.*)$/);
        const tabs = tabMatch[1];
        const textPart = tabMatch[2];
        const children = [];

        if (tabs) {
          children.push(new TextRun({
            text: tabs,
            color: line.color,
            bold: line.bold || false,
            size: 22,
            font: { eastAsia: "Yu Gothic" },
          }));
        }

        if (textPart) {
          children.push(new TextRun({
            text: textPart,
            color: line.color,
            bold: line.bold || false,
            shading: line.highlight ? {
              type: "clear",
              color: "auto",
              fill: line.highlight,
            } : undefined,
            size: 22,
            font: { eastAsia: "Yu Gothic" },
          }));
        }

        return new Paragraph({
          spacing: {
            line: 400,
            lineRule: "atLeast" // 高さを維持しつつエラーを回避する安全な設定
          },
          children: children,
        });
      }),
    }],
  });

  const blob = await Packer.toBlob(doc);
  // ファイル名にもモードを付記すると親切です
  const suffix = isVertical ? "_縦書き用" : "";
  saveAs(blob, `台本_${heroineName}${suffix}.docx`);
}

// ==========================================
// プロット作成　入力ページ
// ==========================================

// キャラクター詳細項目の定義（出力・入力共通のマスター）
const CHAR_FIELDS = [
  { label: '年齢', class: '.p-c-age', suffix: '歳' },
  { label: '身長', class: '.p-c-height', suffix: 'cm' },
  { label: '体重', class: '.p-c-weight', suffix: 'kg' },
  { label: '職業', class: '.p-c-job' },
  { label: '種族', class: '.p-c-race' },
  { label: '髪色&髪型', class: '.p-c-hair' },
  { label: '瞳', class: '.p-c-eye' },
  { label: '顔立ち', class: '.p-c-face' },
  { label: 'スタイル', class: '.p-c-style' },
  { label: '乳の特徴', class: '.p-c-breast' },
  { label: 'アクセサリー', class: '.p-c-accessory' },
  { label: 'イメージキャラ', class: '.p-c-img-char' },
  { label: '声質', class: '.p-c-voice' }
];


// プロット用の状態管理
let plotCharCount = 0;
let plotTrackCount = 0;

/**
 * キャラクター詳細入力欄の追加
 */
function addPlotChar() {
  const container = document.getElementById('plot-chars');
  const div = document.createElement('div');
  div.className = 'rule-card char-item'; // .char-item クラスが必要
  div.style = "border-left-color: #9b59b6; background: #fffcfd; margin-bottom: 20px;";

  div.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div><label>名前 <span style="color: red;">*</span></label><input type="text" class="p-c-name" style="width:100%" required></div>
      <div><label>ふりがなorスペル <span style="color: red;">*</span></label><input type="text" class="p-c-kana" style="width:100%" required></div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top:10px;">
      <div><label>年齢</label><input type="text" class="p-c-age" placeholder="歳" style="width:100%"></div>
      <div><label>身長 <span style="color: red;">*</span></label><input type="text" class="p-c-height" placeholder="cm" style="width:100%" required></div>
      <div><label>体重</label><input type="text" class="p-c-weight" placeholder="kg" style="width:100%"></div>
    </div>
    <div style="margin-top:10px;">
      <label>スリーサイズ <span style="color: red;">*</span></label>
      <div style="display: flex; gap: 5px; align-items: center; flex-wrap: wrap;">
        <span style="white-space: nowrap; font-size: 12px;">B <input type="text" class="p-c-b" style="width:45px" required=""></span>
        <span style="white-space: nowrap; font-size: 12px;">( <input type="text" class="p-c-cup" style="width:35px" required=""> カップ )</span>
        <span style="white-space: nowrap; font-size: 12px;">W <input type="text" class="p-c-w" style="width:45px" required=""></span>
        <span style="white-space: nowrap; font-size: 12px;">H <input type="text" class="p-c-h" style="width:45px" required=""></span>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top:10px;">
      <input type="text" class="p-c-job" placeholder="職業" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-race" placeholder="種族" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-hair" placeholder="髪色・髪型" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-eye" placeholder="瞳の色" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-face" placeholder="顔立ち" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-style" placeholder="スタイル・体格" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-breast" placeholder="乳の特徴" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-accessory" placeholder="アクセサリー" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-img-char" placeholder="イメージキャラ" style="width: 100%; box-sizing: border-box;">
      <input type="text" class="p-c-voice" placeholder="声質・声優案" style="width: 100%; box-sizing: border-box;">
    </div>
    <div style="margin-top:10px;">
      <label>追記情報（上記項目に無い情報）</label>
      <textarea class="p-c-note" style="height:80px;" placeholder="服装イメージなど"></textarea>
    </div>
    <div style="margin-top:10px;">
      <label>キャラクター紹介文 <span style="color: red;">*</span></label>
      <textarea class="p-c-intro" style="height:80px;" placeholder="性格やストーリー上の役割など" required></textarea>
    </div>
    <button class="btn-danger" style="margin-top:5px; padding:2px 10px;" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined">delete</span>
    </button>
  `;
  container.appendChild(div);
}

/**
 * トラック詳細入力欄の追加
 */
function addPlotTrack() {
  const container = document.getElementById('plot-tracks');
  // 現在のトラック数を取得してカウント（表示用）
  const currentCount = container.querySelectorAll('.plot-track-item').length + 1;

  const div = document.createElement('div');
  div.className = 'rule-card plot-track-item'; // .plot-track-item クラスが必要
  div.style = "border-left-color: #e67e22; margin-bottom: 15px;";

  div.innerHTML = `
    <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
      <label style="white-space: nowrap;">Track番号 <span style="color: red;">*</span></label>
      <input type="text" class="p-t-num" value="${String(currentCount).padStart(2, '0')}" placeholder="01" style="width: 70px; box-sizing: border-box;" required>
      <label>タイトル <span style="color: red;">*</span></label>
      <input type="text" class="p-t-title" placeholder="トラックタイトル" style="flex: 1 1 auto; min-width: 180px; margin-top: 5px; box-sizing: border-box;" required>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
      <div style="grid-column: 1 / span 2;">
        <label>プレイ内容 <span style="color: red;">*</span></label>
        <input type="text" class="p-t-play" placeholder="プロローグ、キス責め etc..." style="width: 100%; margin-top: 5px; box-sizing: border-box;" required>
      </div>
      
      <div>
        <label>登場キャラ</label>
        <input type="text" class="p-t-chars" placeholder="キャラ" style="width: 100%; box-sizing: border-box;">
      </div>
      <div>
        <label>目安文字数</label>
        <input type="text" class="p-t-len" placeholder="文字数" style="width: 100%; box-sizing: border-box;">
      </div>
    </div>
    
    <div style="margin-top: 10px;">
      <label>トラックあらすじ <span style="color: red;">*</span></label>
      <textarea class="p-t-story" style="width: 100%; height: 60px; margin-top: 5px; box-sizing: border-box;" placeholder="あらすじを記述してください" required></textarea>
    </div>

    <button class="btn-danger" style="margin-top: 5px; padding: 2px 10px;" 
            onclick="this.parentElement.remove(); reindexTracks();">
      <span class="material-symbols-outlined" style="font-size: 14px;">delete</span>
    </button>
  `;
  container.appendChild(div);
}

function reindexTracks() {
  const tracks = document.querySelectorAll('#plot-tracks .plot-track-item');
  tracks.forEach((t, i) => {
    const numberInput = t.querySelector('.p-t-num');
    if (numberInput) {
      const val = numberInput.value.trim();
      if (!val) {
        numberInput.value = String(i + 1).padStart(2, '0');
      }
    }
  });
}

// ==========================================
// プロット生成・出力・取り込み処理
// ==========================================

/**
 * 1. プロットテキスト生成
 */
function generatePlotText() {
  let res = "【作品プロット案】\n\n";

  // ヘルパー：値がある時だけラベル付きで追加する
  const addSection = (label, id) => {
    const val = document.getElementById(id)?.value.trim();
    if (val) res += `■${label}\n${val}\n\n`;
  };

  // 基本情報
  addSection('タイトル（仮）', 'p-title');
  addSection('あらすじ', 'p-summary');
  addSection('長めのあらすじ', 'p-summary-long');

  // --- キャラクター設定 ---
  const charCards = document.querySelectorAll('.char-item');
  if (charCards.length > 0) {
    let charRes = "";
    charCards.forEach(card => {
      const name = card.querySelector('.p-c-name')?.value.trim();
      if (!name) return;

      const kana = card.querySelector('.p-c-kana')?.value.trim();
      charRes += `・名前：${name}${kana ? ` / ${kana}` : ''}\n`;

      // スリーサイズ
      const b = card.querySelector('.p-c-b')?.value.trim();
      const c = card.querySelector('.p-c-cup')?.value.trim();
      const w = card.querySelector('.p-c-w')?.value.trim();
      const h = card.querySelector('.p-c-h')?.value.trim();
      if (b || c || w || h) {
        charRes += `・スリーサイズ：B${b || '-'}(${c || '-'}カップ) W${w || '-'} H${h || '-'}\n`;
      }

      // 詳細スペック (CHAR_FIELDS)
      CHAR_FIELDS.forEach(f => {
        const val = card.querySelector(f.class)?.value.trim();
        if (val) charRes += `・${f.label}：${val}${f.suffix || ''}\n`;
      });

      // 追記情報
      const note = card.querySelector('.p-c-note')?.value.trim();
      if (note) {
        charRes += `\n【追記情報】\n${note}\n`;
      }

      // 紹介文
      const intro = card.querySelector('.p-c-intro')?.value.trim();
      if (intro) {
        charRes += `\n【キャラクター紹介文】\n${intro}\n`;
      }
      charRes += "\n\n";
    });
    if (charRes) res += "■キャラクター設定\n" + charRes;
  }

  // --- トラックリスト ---
  const tracks = document.querySelectorAll('.plot-track-item');
  let trackRes = "";
  tracks.forEach((t, i) => {
    const tTitle = t.querySelector('.p-t-title')?.value.trim();
    if (!tTitle) return; // タイトルがないトラックはスキップ

    let num = t.querySelector('.p-t-num')?.value.trim();
    if (!num) {
      num = String(i + 1).padStart(2, '0');
    } else if (/^\d+$/.test(num)) {
      num = String(Number(num)).padStart(2, '0');
    }
    // 非数字文字列はそのまま維持（アルファベットや記号も可）
    const tPlay = t.querySelector('.p-t-play')?.value.trim();
    const tChars = t.querySelector('.p-t-chars')?.value.trim();
    const tLen = t.querySelector('.p-t-len')?.value.trim();
    const tStory = t.querySelector('.p-t-story')?.value.trim();

    trackRes += `・Track${num}：${tTitle}${tPlay ? `（${tPlay}）` : ''}${tChars ? ` ＜${tChars}＞` : ''}\n`;
    if (tLen) trackRes += `【${tLen}字】\n`;
    if (tStory) trackRes += `${tStory}\n`;
    trackRes += "\n";
  });
  if (trackRes) res += "■トラックリスト\n" + trackRes;

  // 残りの項目
  addSection('主人公の設定', 'p-hero-setting');
  addSection('その他１', 'p-concept');
  addSection('その他２', 'p-thumbnail');
  //addSection('コンセプト・推しポイント', 'p-concept');
  //addSection('サムネイル案', 'p-thumbnail');

  document.getElementById('plotResult').value = res.trim();
}

/**
 * テキストファイルを解析して、一旦クリアしてから各フォームに流し込む
 */
function parseAndFillPlot(text) {
  // --- 1. 既存データを完全にクリアする ---
  // 固定項目のクリア
  const basicIds = ['p-title', 'p-summary', 'p-summary-long', 'p-hero-setting', 'p-concept', 'p-thumbnail', 'plotResult'];
  basicIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // 動的項目のクリア
  document.getElementById('plot-chars').innerHTML = '';
  document.getElementById('plot-tracks').innerHTML = '';

  // カウンタ変数のリセット（変数が存在する場合）
  if (typeof plotCharCount !== 'undefined') plotCharCount = 0;
  if (typeof plotTrackCount !== 'undefined') plotTrackCount = 0;

  // --- 2. テキストの解析と流し込み ---
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    let line = lines[i].trim();
    if (!line) { i++; continue; }

    // 基本項目の判定（■ラベル名 で判定）
    if (line.includes('■タイトル')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-title').value = data.content;
      i = data.lastIndex;
    } else if (line.includes('■あらすじ')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-summary').value = data.content;
      i = data.lastIndex;
    } else if (line.includes('■長めのあらすじ')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-summary-long').value = data.content;
      i = data.lastIndex;
    } else if (line.includes('■主人公の設定')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-hero-setting').value = data.content;
      i = data.lastIndex;
    } else if (line.includes('■その他１')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-concept').value = data.content;
      i = data.lastIndex;
    } else if (line.includes('■その他２')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-thumbnail').value = data.content;
      i = data.lastIndex;
    }

    // --- キャラクター設定の詳細解析 ---
    else if (line.startsWith('・名前：')) {
      addPlotChar(); // 枠を追加
      const card = document.querySelector('#plot-chars .char-item:last-child');

      const nameParts = line.replace('・名前：', '').split('/');
      if (card.querySelector('.p-c-name')) card.querySelector('.p-c-name').value = nameParts[0].trim();
      if (nameParts[1] && card.querySelector('.p-c-kana')) card.querySelector('.p-c-kana').value = nameParts[1].trim();

      let j = i + 1;
      let introLines = [];

      // キャラクターループ内の解析部分
      // --- キャラクター詳細パラメータの解析（強化版） ---
      while (j < lines.length) {
        let subLine = lines[j].trim();

        // 次のセクションに移ったらループ終了
        if (subLine.startsWith('■') || subLine.startsWith('・名前：') || subLine.startsWith('・Track')) break;
        if (subLine === "") { j++; continue; } // 空行は飛ばす

        let matched = false;

        // 1. スリーサイズの解析（特殊な形なので個別判定）
        if (subLine.startsWith('・スリーサイズ：')) {
          //console.log("✅ [スリーサイズ] 一致:", subLine);
          const m = subLine.match(/B(.*?)\((.*?)カップ\)\s*W(.*?)\s*H(.*)/);
          if (m) {
            card.querySelector('.p-c-b').value = m[1].trim() === '-' ? '' : m[1].trim();
            card.querySelector('.p-c-cup').value = m[2].trim() === '-' ? '' : m[2].trim();
            card.querySelector('.p-c-w').value = m[3].trim() === '-' ? '' : m[3].trim();
            card.querySelector('.p-c-h').value = m[4].trim() === '-' ? '' : m[4].trim();
          }
          matched = true;
        }

        // 2. 追記情報
        if (!matched && subLine.includes('【追記情報】')) {
          const data = getSectionContent(lines, j);
          card.querySelector('.p-c-note').value = data.content;
          j = data.lastIndex;
          matched = true;
        }

        // 3. 紹介文
        if (!matched && subLine.includes('【キャラクター紹介文】')) {
          const data = getSectionContent(lines, j);
          card.querySelector('.p-c-intro').value = data.content;
          j = data.lastIndex;
          matched = true;
        }

        // 2. 固定項目マスター(CHAR_FIELDS)と照合
        if (!matched) {
          CHAR_FIELDS.forEach(f => {
            const prefix = `・${f.label}：`;
            if (subLine.startsWith(prefix)) {
              //console.log(`✅ [${f.label}] 一致:`, subLine); // ここで項目名が出るはず
              let val = subLine.replace(prefix, '');
              if (f.suffix) val = val.replace(f.suffix, ''); // '歳'などを除去
              const targetInput = card.querySelector(f.class);
              if (targetInput) {
                targetInput.value = val.trim();
                matched = true; // マッチしたフラグを立てる
              }
            }
          });
        }

        // 3. どの固定ラベルにも当てはまらない行だけを「紹介文」とする
        if (!matched) {
          //console.warn("⚠️ [紹介文へ] 一致するラベルなし:", subLine);
          introLines.push(lines[j]);
        }
        j++;
      }
      // ラベルに合致しなかった行（introLines）がある場合、紹介文の末尾に追記する
      if (introLines.length > 0 && card.querySelector('.p-c-intro')) {
        const currentVal = card.querySelector('.p-c-intro').value;
        const extraText = introLines.join('\n').trim();
        // すでに【キャラクター紹介文】で読み込んだ値がある場合は改行して足す
        card.querySelector('.p-c-intro').value = currentVal ? currentVal + '\n' + extraText : extraText;
      }

      i = j - 1;
    }

    // --- トラックリストの解析 ---
    else if (line.startsWith('・Track')) {
      addPlotTrack();
      const card = document.querySelector('#plot-tracks .plot-track-item:last-child');
      const trackRegex = /Track([^：]+)：(.*?)(?:（(.*?)）)?(?:\s*＜(.*?)＞)?$/;
      const match = line.match(trackRegex);
      if (match) {
        card.querySelector('.p-t-num').value = match[1]?.trim() || '';
        card.querySelector('.p-t-title').value = match[2]?.trim() || '';
        card.querySelector('.p-t-play').value = match[3]?.trim() || '';
        card.querySelector('.p-t-chars').value = match[4]?.trim() || '';
      }

      let k = i + 1;
      let storyLines = [];
      while (k < lines.length && !lines[k].trim().startsWith('・') && !lines[k].trim().startsWith('■')) {
        let subLine = lines[k].trim();
        if (subLine.startsWith('【') && subLine.includes('字】')) {
          card.querySelector('.p-t-len').value = subLine.replace(/[【】字]/g, '').trim();
        } else {
          storyLines.push(lines[k]);
        }
        k++;
      }
      card.querySelector('.p-t-story').value = storyLines.join('\n').trim();
      i = k - 1;
    }
    i++;
  }

  refreshAllCounts();
  alert("データをクリアし、取り込みを完了しました。");
}

/**
 * 改良版：次の見出しが出るまでの全テキストを取得するヘルパー
 * (これがないとタイトルやあらすじの解析で止まります)
 */
function getSectionContent(lines, currentIndex) {
  let j = currentIndex + 1;
  let contentLines = [];
  while (j < lines.length) {
    let line = lines[j];
    // 次の見出し（■ または ・）が出てきたら終了
    if (line.trim().startsWith('■') || line.trim().startsWith('・') || line.trim().startsWith('【')) {
      break;
    }
    contentLines.push(line);
    j++;
  }
  return {
    content: contentLines.join('\n').trim(),
    lastIndex: j - 1
  };
}

/**
 * 2. txt出力 (ダウンロード機能)
 */
function downloadTxt() {
  const content = document.getElementById('plotResult').value;
  if (!content) {
    alert("出力する内容がありません。先に「プロットテキスト生成」を押してください。");
    return;
  }
  const title = document.getElementById('p-title').value || "作品プロット案";
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title}.txt`;
  link.click();
}

/**
 * 3. データ取り込み (ファイル読み込み)
 */
function importPlotText(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    parseAndFillPlot(e.target.result);
  };
  reader.readAsText(file);
  input.value = ""; // 同じファイルを再度選べるようにリセット
}

// ==========================================
// 7. Word / Text 出力機能 (ブラウザ完結型)
// ==========================================

// 判定して適切な関数を呼ぶラッパー
async function handleExport(type) {
  const mode = document.querySelector('input[name="wordMode"]:checked').value;
  const isVertical = (mode === 'v');

  if (type === 'word') {
    if (isVertical) {
      await exportWordVertical();
    } else {
      await exportWordHorizontal();
    }
  } else if (type === 'txt') {
    // 自動検知モードで実行
    exportTextAreaToTxt(isVertical);
  }
}


// 共通：画面からデータを解析して配列で返す
function getParsedScriptLines(textareaElement = null) {
  let preview = null;
  const multiArea = document.getElementById('previewAreaMulti');
  const singleArea = document.getElementById('previewArea');
  const textArea = textareaElement || document.getElementById('textExtract');

  if (multiArea && multiArea.offsetHeight > 0 && multiArea.innerHTML.trim() !== "") {
    preview = multiArea;
  } else if (singleArea && singleArea.offsetHeight > 0 && singleArea.innerHTML.trim() !== "") {
    preview = singleArea;
  }

  let lines = [];
  // --- 1. 事前チェック：台本全体にキャラ名定義があるか確認 ---
  let scriptBody = "";
  if (preview) {
    scriptBody = preview.innerText;
  } else if (textArea) {
    scriptBody = textArea.value;
  }

  // 台本全体の中に「//名前：」という形式が含まれているか
  const hasAnyHeroineDef = /^\/\/([^：: \t\n]+)[:：]/m.test(scriptBody);

  let isInCommentBlock = false;
  let hasMetHeroine = false; // これは「今その行以降か」の判定用

  // 2. プレビューエリア（HTML）がある場合の処理
  if (preview) {
    Array.from(preview.childNodes).forEach(node => {
      if (node.nodeType === 1) { // <div>などの要素
        pushLine(node);
      } else if (node.nodeType === 3) { // 直接のテキスト
        const text = node.textContent.trim();
        if (text === "" && node.textContent.includes('\n')) {
          // 何もない改行だけのノード（空行として扱う）
          lines.push({ text: "", color: "000000", highlight: null });
        } else if (text !== "") {
          // タグに囲まれていない文字があった場合
          lines.push({ text: text, color: "000000", highlight: null });
        }
      }
    });

    function pushLine(el) {
      let text = el.innerText.replace(/\u00A0/g, " ").trim();

      // %%% 判定
      if (text.includes("%%%")) {
        const count = (text.match(/%%%/g) || []).length;
        if (count === 1) isInCommentBlock = !isInCommentBlock;
      }

      if (text !== "") {
        const isHeroineName = /^\/\/([^：: \t\n]+)[:：]/.test(text);
        const isTrackBorder = text.includes("＝＊＝") || text.includes("トラック") || text.includes("Track");

        // --- 条件をシンプルに修正 ---
        // 1. 台本内にキャラ定義が1つでも存在する (hasAnyHeroineDef)
        // 2. この行自体が除外対象（名前行、トラック行、コメント内）ではない
        if (hasAnyHeroineDef && !isHeroineName && !isTrackBorder && !isInCommentBlock && !text.includes("%%%")) {
          text = "\t" + text;
        }
      }

      lines.push({
        text: text,
        color: rgbToHex(el.style.color) || "000000",
        highlight: rgbToHex(el.style.backgroundColor) || null,
        bold: el.style.fontWeight === "bold" || el.style.fontWeight >= 700
      });
    }
  }

  // 3. 【追加】プレビューがなく、テキストエリアに文字がある場合（セリフ抽出時など）
  else if (textArea && textArea.value.trim() !== "") {
    let isInCommentTextArea = false;

    // 事前チェックの結果 (hasAnyHeroineDef) が true の場合のみインデントを検討する
    textArea.value.split('\n').forEach(rawLine => {
      let text = rawLine.trim();

      // コメントブロック判定
      if (text.includes("%%%")) {
        const count = (text.match(/%%%/g) || []).length;
        if (count === 1) isInCommentTextArea = !isInCommentTextArea;
      }

      if (text !== "") {
        const isHeroineName = /^\/\/([^：: \t\n]+)[:：]/.test(text);
        const isTrackBorder = text.includes("＝＊＝") || text.includes("トラック") || text.includes("Track");

        // 【改良】台本全体にキャラ名定義があり、かつ除外行ではない場合のみタブを挿入
        if (hasAnyHeroineDef && !isHeroineName && !isTrackBorder && !isInCommentTextArea && !text.includes("%%%")) {
          text = "\t" + text;
        }
      }

      lines.push({
        text: text,
        color: "000000",
        highlight: null
      });
    });
  }

  if (lines.length === 0) return alert("出力する内容がありません。");
  return lines;
}

function rgbToHex(rgb) {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return null;
  const res = rgb.match(/\d+/g);
  if (!res) return null;
  return res.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

// 共通部品：濁点ずらし
function fixVoicedSoundMark(text) {
  if (!text) return "";
  let normalized = text.replace(/ﾞ/g, '゛');
  return normalized.replace(/(.)(゛)/g, '$2$1');
}

// A. 通常の横書き出力
async function exportWordHorizontal() {
  const lines = await getParsedScriptLines();
  if (!lines) return;
  await generateDocx(lines, false, "横書き台本");
}

// B. 縦書き用（濁点ずらし）出力
async function exportWordVertical() {
  const lines = await getParsedScriptLines();
  if (!lines) return;
  // 縦書き用なので true を渡す
  await generateDocx(lines, true, "縦書き用台本");
}

/**
 * 実際のDocx生成を担う関数
 * @param {Array} lines 解析済みの行データ
 * @param {Boolean} useFix 濁点ずらしを行うかどうか
 * @param {String} fileNamePrefix ファイル名の接頭辞
 */
async function generateDocx(lines, useFix, fileNamePrefix) {
  const { Document, Packer, Paragraph, TextRun, ShadingType } = docx;

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1985, bottom: 1701, left: 1701, right: 1701 },
        },
      },
      children: lines.map(line => {
        const isBlank = !line.text || line.text === "";

        // 縦書き用なら濁点処理を適用
        let processedText = line.text;
        if (useFix && !isBlank) {
          processedText = fixVoicedSoundMark(line.text);
        }

        return new Paragraph({
          spacing: { line: 480, before: 0, after: 0 },
          children: isBlank ? [] : (() => {
            const runs = [];
            if (processedText.startsWith("\t")) {
              runs.push(new TextRun({
                text: "\t",
                size: 22,
                font: { eastAsia: "Yu Gothic" },
              }));
            }

            const contentText = processedText.replace(/^\t/, "");
            runs.push(new TextRun({
              text: contentText,
              color: line.color,
              bold: line.bold,
              shading: line.highlight ? {
                type: ShadingType.CLEAR,
                color: "auto",
                fill: line.highlight,
              } : undefined,
              size: 22,
              font: { eastAsia: "Yu Gothic" },
            }));
            return runs;
          })(),
        });
      }),
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileNamePrefix}.docx`);
}

/**
 * テキストエリアの内容を.txtファイルとして保存する
 */
/**
 * 開いている（または内容がある）テキストエリアを自動判別して保存する
 */
function exportTextAreaToTxt(isVertical = false) {
  // 取得候補のIDを優先順位順に並べる
  const targetIds = ['textExtract', 'textMulti', 'textFormat'];
  let targetArea = null;
  let activeId = "";

  // 1. 表示されており、かつ中身があるテキストエリアを探す
  for (const id of targetIds) {
    const el = document.getElementById(id);
    if (el && el.offsetHeight > 0 && el.value.trim() !== "") {
      targetArea = el;
      activeId = id;
      break;
    }
  }

  if (!targetArea) {
    alert("保存する内容が見つかりません。");
    return;
  }

  // 2. 内容の取得と濁点処理
  let finalContent = targetArea.value;
  if (isVertical) {
    finalContent = finalContent
      .split('\n')
      .map(line => fixVoicedSoundMark(line))
      .join('\n');
  }

  // 3. IDに基づいたファイル名prefixの決定（お好みで調整してください）
  const prefixMap = {
    'textExtract': '台本',
    'textMulti': '台本',
    'textFormat': '台本'
  };
  const fileNamePrefix = prefixMap[activeId] || "script";
  const fileName = isVertical ? `${fileNamePrefix}_縦書き用.txt` : `${fileNamePrefix}.txt`;

  // 4. ダウンロード処理
  const blob = new Blob([finalContent], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}