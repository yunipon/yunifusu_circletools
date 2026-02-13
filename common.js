// ==========================================
// 1. グローバル設定・定数
// ==========================================
const heroineColors = ["#E50000", "#0000FF", "#008000", "#8A2BE2", "#D2691E", "#666666"];
const heroineColorPairs = [
  { fg: "#E50000", bg: "#FFDADA" }, { fg: "#0000FF", bg: "#D1F5FF" },
  { fg: "#008000", bg: "#D1FFD1" }, { fg: "#8A2BE2", bg: "#E6D1FF" },
  { fg: "#D2691E", bg: "#F5E0D1" }, { fg: "#666666", bg: "#E0E0E0" }
];

let extractRules = [], formatRules = [], multiRules = [];
let heroineCount = 3;

// デフォルトルール定義
const defaultExtract = [
  { label: 'コメント行削除（%%% ~ %%% ）', pattern: 'delete_comment', active: true, isSpecial: true },
  { label: 'トラック装飾の削除', pattern: '^＝＊＝.*', active: true },
  { label: 'トラック名の削除', pattern: '^(トラック|Track|ＴＲＡＣＫ|TRACK).*', active: true },
  { label: 'ト書き行削除', pattern: '^\\s*(◆|■|※|//|◇|□|＊).*', active: true },
  { label: '【】内削除', pattern: '【[^】]*】', active: true },
  { label: '()内削除', pattern: '[（\\(][^）\\)]*[）\\)]', active: true },
  { label: 'スペース削除（文章の途中のスペースも削除）', pattern: '[ 　]', active: true }
];
//{ label: '《》内削除', pattern: '《[^》]*》', active: true },

const defaultFormat = [
  { label: 'コメント｜%%% ~ %%%', pattern: 'format_comment', active: true, bgColor: 'none', fgColor: '#666666', bold: false, fontSize: '11', isSpecial: true },
  { label: 'トラック名｜トラック or Track or ＴＲＡＣＫ', pattern: '^(トラック|Track|ＴＲＡＣＫ)', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '14' },
  { label: 'SE指示｜◆SE：〜ここから/ここまで', pattern: '^◆SE：.*', active: true, bgColor: '#E0E0E0', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'SE指示方向｜◆SE方向：｜必要であれば使用', pattern: '^◆SE方向：.*', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '編集指示｜■編集：', pattern: '^■編集：.*', active: true, bgColor: '#E0E0E0', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '同時指示｜【同時：〜ここから/ここまで】', pattern: '^\\s*【同時：.*(ここから|ここまで)\\s*】', active: true, bgColor: '#FFFF00', fgColor: '#000000', bold: true, fontSize: '11' },
  { label: '特記事項｜※補足：｜間を開ける指示など', pattern: '^※補足：.*', active: true, bgColor: 'none', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: '状況説明｜《状況：〜》', pattern: '^\s*《状況：.*》', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' },

  { label: '話者｜//キャラ名：', pattern: '^\/\/.*：', active: true, bgColor: 'none', fgColor: '#0000FF', bold: true, fontSize: '11' },
  { label: 'ト書き｜◇音声：｜方向・距離・（有声/無声）', pattern: '^◇音声：', active: true, bgColor: 'none', fgColor: '#0000FF', bold: false, fontSize: '11' },
  { label: 'ト書き｜□演技：)｜必要であれば（ここから/ここまで）指示', pattern: '^□演技：', active: true, bgColor: 'none', fgColor: '#0000FF', bold: false, fontSize: '11' },
  { label: '秒数演技指示｜＊　〜　秒', pattern: '^＊.*', active: true, bgColor: '#D1F5FF', fgColor: '#0000FF', bold: false, fontSize: '11' },
  { label: 'ループ用指示｜（キャラ名｜ループ：〜回/ここから/ここまで）｜回数や開始終了指示など', pattern: '^\\s*[（\\(].*｜ループ：.*\\s*[）\\)]', active: true, bgColor: '#FFFF00', fgColor: '#0000FF', bold: true, fontSize: '11' },

  { label: '補足｜（）｜フェラ、絶頂　など', pattern: '^\\s*[（\\(][^）\\)]*[）\\)]', active: true, bgColor: '#FFFF00', fgColor: '#000000', bold: false, fontSize: '11' },
  { label: 'セリフ (その他)', pattern: '.*', active: true, bgColor: 'none', fgColor: '#000000', bold: true, fontSize: '11' }
];

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

  // 画面描画（要素が存在する場合のみ）
  if (document.getElementById('heroineInputs')) renderHeroineInputs();
  renderAllRules();

  // 初期プレビュー実行
  if (document.getElementById('textFormat')) runPreview();
  if (document.getElementById('textMulti')) runMultiPreview();
});

// ==========================================
// 3. 共通ユーティリティ
// ==========================================
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m]));
}

function updateCharCount(id, cid) {
  const target = document.getElementById(id);
  if (target) document.getElementById(cid).innerText = target.value.replace(/\n/g, "").length.toLocaleString();
}

function getStyle(r) {
  if (!r) return "";
  return `background-color:${r.bgColor === 'none' ? 'transparent' : r.bgColor}; color:${r.fgColor}; font-weight:${r.bold ? 'bold' : 'normal'}; font-size:11pt;`;
}

/**
 * 指定した種類の文字数を更新する（引数がない場合は全更新）
 * @param {string} type - 'extract', 'fmt', 'multi'
 */
function refreshAllCounts(type) {
  const map = {
    'extract': { text: 'textExtract', display: 'countExtract' },
    'fmt': { text: 'textFormat', display: 'countFormat' },
    'multi': { text: 'textMulti', display: 'countMulti' }
  };

  // typeが指定されていればその一つだけ、なければ全部をループで処理
  const keys = type ? [type] : Object.keys(map);

  keys.forEach(key => {
    const config = map[key];
    const textarea = document.getElementById(config.text);
    const display = document.getElementById(config.display);

    if (textarea && display) {
      display.innerText = textarea.value.length;
    }
  });
}

// ==========================================
// 4. セリフ抽出・整形ロジック
// ==========================================
function applyExtract() {
  const area = document.getElementById('textExtract');
  const areabefore = document.getElementById('textExtractBefore');
  if (!area || !area.value) return;

  let text = area.value;
  areabefore.value = text;
  updateCharCount('textExtractBefore', 'countExtractBefore');

  // 全体に対する一括カッコ統一（基本処理）
  text = text.replace(/\(/g, "（").replace(/\)/g, "）");

  const commentRule = extractRules[0];
  if (commentRule && commentRule.pattern === 'delete_comment' && commentRule.active) {
    text = text.replace(/%%%[\s\S]*?%%%/g, "");
  }

  let lines = text.split('\n');
  lines = lines.map(line => {
    // まずは前後の不要な空白だけ消す（装飾ライン判定のため）
    let newLine = line.trim();

    extractRules.forEach((rule, index) => {
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

function runMultiPreview() {
  const text = document.getElementById('textMulti')?.value;
  const area = document.getElementById('previewAreaMulti');
  //if (!text || !area) return;
  if (!area) return; //textが空でも動くように変更

  const names = Array.from(document.querySelectorAll('.heroine-name')).map(i => i.value.trim());
  const blocks = text.split(/\n\s*\n/);

  area.innerHTML = blocks.map(block => {
    const lines = block.split('\n');
    let targetIdx = -1;
    lines.forEach(line => {
      names.forEach((name, i) => {
        if (name && new RegExp("^(\\/\\/" + name + "[:：]|【" + name + "】)").test(line.trim())) targetIdx = i;
      });
    });

    const renderedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "<div>&nbsp;</div>";
      if (targetIdx !== -1) {
        const colors = heroineColorPairs[targetIdx];
        let style = `color:${colors.fg};`;
        if (/^[（(]/.test(trimmed)) style += `background-color:${colors.bg}; padding:0 4px; border-radius:2px;`;
        else if (/^(\/\/|【)/.test(trimmed)) style += `font-weight:bold;`;
        return `<div style="${style}">${escapeHtml(line)}</div>`;
      }
      let matched = multiRules.find(r => r.active && r.pattern && new RegExp(r.pattern).test(trimmed));
      return `<div style="${getStyle(matched || { fgColor: '#000000' })}">${escapeHtml(line)}</div>`;
    }).join('');
    return `<div style="margin-bottom:1.5em;">${renderedLines}</div>`;
  }).join('');
  updateCharacterDialogueCounts();
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
      // --- 文字色選択用のチップ ---
      const fgOptions = [...heroineColors, "#000000"]; // ヒロイン6色 + 黒
      let fgHtml = `<div class="palette-group"><span class="palette-label">文字:</span>`;
      fgOptions.forEach(color => {
        // 大文字小文字を無視して比較
        const isSelected = (r.fgColor && r.fgColor.toUpperCase() === color.toUpperCase());
        fgHtml += `
          <button class="color-chip ${isSelected ? 'selected' : ''}"
            style="background-color:${color};"
            onclick="updateRule('${type}', ${i}, 'fgColor', '${color}')" title="${color}">
          </button>`;
      });
      fgHtml += `</div>`;

      // --- 背景色選択用のチップ ---
      const bgOptions = [...heroineColorPairs.map(p => p.bg), "#FFFF00", "none"]; // ヒロイン用薄色6色 + 黄 + なし
      let bgHtml = `<div class="palette-group"><span class="palette-label">背景:</span>`;
      bgOptions.forEach(color => {
        // 文字列として比較し、'none' も正しく判定
        const isSelected = String(r.bgColor || "").toUpperCase() === String(color || "").toUpperCase();
        const displayColor = (color === 'none' ? '#ffffff' : color);
        bgHtml += `
          <button class="color-chip ${isSelected ? 'selected' : ''} ${color === 'none' ? 'chip-none' : ''}"
            style="background-color:${displayColor};"
            onclick="updateRule('${type}', ${i}, 'bgColor', '${color}')" title="${color}">
          </button>`;
      });
      bgHtml += `</div>`;

      paletteHtml = `<div class="dual-palette">${fgHtml}${bgHtml}</div>`;
    }

    return `
      <div class="rule-card">
          <div class="rule-header">
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

  if (type === 'extract') {
    const textArea = document.getElementById('textExtract');
    const textAreaBefore = document.getElementById('textExtractBefore');
    if (textArea) textArea.value = '';
    if (textAreaBefore) textAreaBefore.value = '';
    refreshAllCounts(type);
    updateCharCount('textExtractBefore', 'countExtractBefore');
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
  }
  else if (type === 'multi') {
    const textArea = document.getElementById('textMulti');
    const previewArea = document.getElementById('previewAreaMulti');
    if (textArea) textArea.value = '';
    if (previewArea) previewArea.innerHTML = '';
    refreshAllCounts(type);
    if (typeof updateCharacterDialogueCounts === 'function') { updateCharacterDialogueCounts(); }
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
}

function shrinkBlankLines(id) {
  if (id === 'textExtract') {
    const area = document.getElementById('textExtract');
    const areabefore = document.getElementById('textExtractBefore');
    let text = area.value;
    areabefore.value = text;
    updateCharCount('textExtractBefore', 'countExtractBefore');
  }
  const a = document.getElementById(id); a.value = a.value.replace(/\n{3,}/g, '\n\n'); runPreview(); runMultiPreview();
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
}

function updateFormatDialogueCount() {
  const val = document.getElementById('textFormat')?.value || "";
  const count = val.replace(/\n/g, "").length; // 簡易版
  const display = document.getElementById('formatDialogueCount');
  if (display) display.innerText = `セリフ：${count} 文字`;
}

function updateCharacterDialogueCounts() {
  const val = document.getElementById('textMulti')?.value || "";
  const totalDisplay = document.getElementById('multiDialogueCount');
  if (totalDisplay) totalDisplay.innerText = `合計セリフ：${val.replace(/\n/g, "").length} 文字`;
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

function addHeroineInput() { if (heroineCount < 6) { heroineCount++; renderHeroineInputs(); } }

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
  { label: 'アクセサリー', class: '.p-c-accessory' },
  { label: 'イメージキャラ', class: '.p-c-img-char' },
  { label: '声質', class: '.p-c-voice' }
];


// プロット用の状態管理
let plotCharCount = 0;
let plotTrackCount = 0;

/**
 * プロットページの初期化（ページ読み込み時に実行）
 */
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('plotPage')) {
    addPlotChar(); // 最初にキャラ入力欄を1つ出す
    addPlotTrack(); // 最初にトラック入力欄を1つ出す
  }
});

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
    <div style="margin-bottom: 10px;">
      <strong class="track-number">
        Track ${String(currentCount).padStart(2, '0')}
      </strong>
      <label>タイトル <span style="color: red;">*</span></label>
      <input type="text" class="p-t-title" placeholder="トラックタイトル" style="width: 100%; margin-top: 5px; box-sizing: border-box;" required>
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

    const num = String(i + 1).padStart(2, '0');
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
  addSection('コンセプト・推しポイント', 'p-concept');
  addSection('サムネイル案', 'p-thumbnail');

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
    } else if (line.includes('■コンセプト')) {
      const data = getSectionContent(lines, i);
      document.getElementById('p-concept').value = data.content;
      i = data.lastIndex;
    } else if (line.includes('■サムネイル案')) {
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
      const trackRegex = /Track\d+：(.*?)(?:（(.*?)）)?(?:\s*＜(.*?)＞)?$/;
      const match = line.match(trackRegex);
      if (match) {
        card.querySelector('.p-t-title').value = match[1]?.trim() || '';
        card.querySelector('.p-t-play').value = match[2]?.trim() || '';
        card.querySelector('.p-t-chars').value = match[3]?.trim() || '';
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

  if (typeof refreshAllCounts === 'function') refreshAllCounts();
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
async function exportToWord() {
  const multiArea = document.getElementById('previewAreaMulti');
  const singleArea = document.getElementById('previewArea');
  const preview = (multiArea && multiArea.offsetHeight > 0) ? multiArea : singleArea;

  let lines = [];

  if (preview) {
    // 複数ヒロイン（ブロック構造）の場合
    if (preview.id === 'previewAreaMulti') {
      const blocks = preview.querySelectorAll(':scope > div'); // ブロック単位(margin-bottomあり)を取得

      blocks.forEach((block, bIdx) => {
        const rowDivs = block.querySelectorAll('div');
        rowDivs.forEach(div => {
          if (div.querySelector('div') === null) {
            let text = div.innerText.replace(/\u00A0/g, " ").trim();
            lines.push({
              text: text,
              color: rgbToHex(div.style.color) || "000000",
              highlight: rgbToHex(div.style.backgroundColor) || null
            });
          }
        });

        // ★ここがGASの「body.appendParagraph("")」に相当する処理
        // ブロックの最後に、次のブロックとの間の空行を追加する
        if (bIdx < blocks.length - 1) {
          lines.push({ text: "", color: "000000", highlight: null });
        }
      });
    } else {
      // 一人整形（フラット構造）の場合
      const allDivs = preview.querySelectorAll('div');
      allDivs.forEach(div => {
        // ネストされたdivがある場合は親側をスキップし、中身を持つdivのみ処理
        if (div.querySelector('div') === null) {
          let text = div.innerText.replace(/\u00A0/g, " ").trim();

          // 修正ポイント：colorとhighlight(背景色)を両方取得する
          const fgColor = rgbToHex(div.style.color);
          // 背景色が 'transparent' や 'none' ではないか確認して取得
          const bgColor = (div.style.backgroundColor && div.style.backgroundColor !== 'transparent' && div.style.backgroundColor !== 'none')
            ? rgbToHex(div.style.backgroundColor)
            : null;

          lines.push({
            text: text,
            color: fgColor || "000000",
            highlight: bgColor // ここを null ではなく bgColor に変更
          });
        }
      });
    }
  }

  if (lines.length === 0) return alert("出力する内容がありません。");

  const { Document, Packer, Paragraph, TextRun } = docx;

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1985,    // 35.01mm
            bottom: 1701, // 30mm
            left: 1701,   // 30mm
            right: 1701,  // 30mm
          },
        },
      },
      children: lines.map(line => {
        // 行が空（または空白文字のみ）の場合の判定
        const isBlank = !line.text || line.text.trim() === "";

        return new Paragraph({
          spacing: {
            line: 480, // 行間 2.0
            before: 0,
            after: 0,
          },
          children: [
            new TextRun({
              // 空白行なら空文字を、そうでなければテキストを入れる
              text: isBlank ? "" : line.text,
              color: line.color,
              shading: line.highlight ? {
                type: docx.ShadingType.CLEAR,
                color: "auto",
                fill: line.highlight,
              } : undefined,
              size: 22, // 11pt
              font: {
                eastAsia: "Yu Mincho",
                hint: "eastAsia",
              },
            }),
          ],
        });
      }),
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `台本出力_${new Date().getTime()}.docx`);
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

// ==========================================
// 9. サイドバー
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuToggle && sidebar && overlay) {
    // ボタンをクリックしたら開閉
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // 背景（オーバーレイ）をクリックしたら閉じる
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      menuToggle.classList.remove('active');
    });

    // メニュー内のリンクをクリックしたら閉じる（スマホ対策）
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
});