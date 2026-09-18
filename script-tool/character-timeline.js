const SAMPLE_SCRIPT = `Track01：町での会話

//アオイ：
◇音声：右　上　近く
こんにちは。待たせちゃった？
今日は一緒に出かけよう。

//ミナ：
◇音声：左　上　近く
私もいるよ。どこから行こうか？

【同時　ここから】
//アオイ：
せーの！
//ミナ：
出発！
【同時　ここまで】

Track02：休憩

//ミナ：
◇音声：正面　近く
＊M1　楽しそうな鼻歌　10秒
（ミナ｜ループ：M1鼻歌　ここから）

//アオイ：
◇音声：右　密着
少し休んでから次へ行こう。
飲み物も買ってきたよ。

（ミナ｜ループ：M1鼻歌　ここまで）`;

const elements = {
  input: document.getElementById('scriptInput'),
  analyze: document.getElementById('analyzeBtn'),
  sample: document.getElementById('sampleBtn'),
  clear: document.getElementById('clearBtn'),
  results: document.getElementById('resultArea'),
  summary: document.getElementById('summary'),
  overview: document.getElementById('overview'),
  characterLegend: document.getElementById('characterLegend'),
  trackSelect: document.getElementById('trackSelect'),
  positionTracker: document.getElementById('positionTracker'),
  timeline: document.getElementById('timeline'),
  warnings: document.getElementById('warningPanel'),
  warningList: document.getElementById('warningList')
};

let currentAnalysis = null;

const POSITION_LANES = [
  { key: 'left', label: '左' },
  { key: 'front-left', label: '正面左寄り' },
  { key: 'front', label: '正面' },
  { key: 'front-right', label: '正面右寄り' },
  { key: 'right', label: '右' },
  { key: 'unknown', label: '背後・後方' }
];
const CHARACTER_COLORS = ['#E50000', '#0000FF', '#008000', '#8A2BE2', '#D2691E', '#FF1493', '#00CED1', '#FFD700', '#FF8C00', '#2F4F4F'];
const CHARACTER_SOFT_COLORS = ['#FFDADA', '#D1F5FF', '#D1FFD1', '#E6D1FF', '#F5E0D1', '#FFD6EC', '#D6F7F9', '#FFF5CC', '#FFE5CC', '#DDE5E5'];

function characterColor(name, characters) {
  return CHARACTER_COLORS[Math.max(0, characters.indexOf(name)) % CHARACTER_COLORS.length];
}

function characterSoftColor(name, characters) {
  return CHARACTER_SOFT_COLORS[Math.max(0, characters.indexOf(name)) % CHARACTER_SOFT_COLORS.length];
}

function positionVisual(position) {
  const value = String(position || '').normalize('NFKC').replace(/\s/g, '');
  let lane = 'unknown';
  if (/背後|後方/.test(value)) lane = 'unknown';
  else if (/正面左寄り|正面左|左寄り/.test(value)) lane = 'front-left';
  else if (/正面右寄り|正面右|右寄り/.test(value)) lane = 'front-right';
  else if (/正面/.test(value)) lane = 'front';
  else if (/左/.test(value)) lane = 'left';
  else if (/右/.test(value)) lane = 'right';

  const vertical = /(?:上|↑)/.test(value) ? '↑' : /(?:下|↓)/.test(value) ? '↓' : '';
  let distance = '通常';
  let strength = 55;
  if (/密着|至近/.test(value)) { distance = '密着'; strength = 100; }
  else if (/近く|近距離|近め/.test(value)) { distance = '近'; strength = 76; }
  else if (/遠く|遠距離|遠め/.test(value)) { distance = '遠'; strength = 30; }
  return { lane, vertical, distance, strength };
}

function normalizeTrackName(line, order) {
  const normalized = line.normalize('NFKC').replace(/[＝=]+/g, '').trim();
  const prefix = normalized.match(/^(?:トラック|track|tr)\s*/i);
  const suffix = prefix ? normalized.slice(prefix[0].length).trim() : normalized;
  const bonus = suffix.match(/^(?:特典|bonus|ボーナス)(?:[\s：:_-]*([0-9]+))?/i);
  if (bonus) return `TR特典${bonus[1] ? String(Number(bonus[1])).padStart(2, '0') : ''}`;
  if (/^小説/i.test(suffix)) return 'TR小説';
  const number = suffix.match(/^(?:第\s*)?([0-9]+)/);
  return number ? `TR${String(Number(number[1])).padStart(2, '0')}` : `TR${String(order).padStart(2, '0')}`;
}

function isTrackLine(line) {
  return /^(?:トラック|track|tr|特典|bonus|ボーナス|小説)/i.test(line.normalize('NFKC').trim());
}

function loopMarker(line) {
  const match = line.match(/^[（(]([^｜|]+)[｜|]ループ[：:](.*?)(ここから|ここまで)[\s　]*[）)]$/);
  return match ? { character: match[1].trim(), label: match[2].trim(), type: match[3] } : null;
}

function materialCode(value) {
  const normalized = String(value || '').normalize('NFKC').trim().replace(/^[＊*]\s*/, '');
  return normalized.match(/^([A-Z]+[0-9]+)/i)?.[1].toUpperCase() || '';
}

function isDialogueLine(line) {
  const value = line.trim();
  if (!value) return false;
  if (/^(?:\/\/|◇音声[：:]|□演技[：:]|◆SE[：:]|■|※|＊|《|%%%|【同時|[（(].*[｜|]ループ|[＝=]{3,})/.test(value)) return false;
  if (isTrackLine(value)) return false;
  return true;
}

function findSpeakerBlockPosition(lines, speakerLineIndex) {
  for (let index = speakerLineIndex + 1; index < lines.length; index += 1) {
    const value = lines[index].trim();
    if (/^\/\/[^：:\t\n]+[：:]/.test(value) || isTrackLine(value)) break;
    const match = value.match(/^◇音声[：:](.*)$/);
    if (match) return match[1].trim();
  }
  return '';
}

function samePosition(left, right) {
  const normalize = value => String(value || '').normalize('NFKC').replace(/[\s、,]/g, '');
  return normalize(left) === normalize(right);
}

function analyzeScript(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const characters = [];
  const tracks = [];
  const events = [];
  const lineStatuses = lines.map(() => ({}));
  const lineTracks = [];
  const lineKinds = lines.map(() => 'other');
  const lineSpeakers = lines.map(() => '');
  const positionChanges = lines.map(() => ({}));
  const warnings = [];
  const positions = {};
  const activeLoops = new Map();
  const materialDefinitions = new Map();
  let track = 'TR未特定';
  let trackOrder = 0;
  let speaker = '';
  let inComment = false;
  let simultaneous = null;
  let lastEvent = null;

  const rememberCharacter = name => {
    if (name && !characters.includes(name)) characters.push(name);
  };
  const rememberTrack = name => {
    if (!tracks.includes(name)) tracks.push(name);
  };
  const resetAggregation = () => { lastEvent = null; };

  const makeStatuses = (mainSpeaker, mode, mainLines = 1) => {
    const statuses = {};
    if (mainSpeaker) {
      statuses[mainSpeaker] = { mode, position: positions[mainSpeaker] || '位置未指定', lines: mainLines, label: '' };
    }
    activeLoops.forEach((loop, name) => {
      statuses[name] = { mode: 'bgv', position: positions[name] || loop.position || '位置未指定', lines: 1, label: loop.label || 'ループ' };
    });
    return statuses;
  };

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const trimmed = rawLine.trim();
    if (!trimmed) lineKinds[index] = 'blank';
    lineTracks[index] = track;
    activeLoops.forEach((loop, name) => {
      lineStatuses[index][name] = {
        mode: 'bgv', position: loop.position || positions[name] || '位置未指定', label: loop.label || 'ループ'
      };
    });
    if (trimmed.includes('%%%')) {
      lineKinds[index] = 'comment';
      const markers = (trimmed.match(/%%%/g) || []).length;
      if (markers % 2 === 1) inComment = !inComment;
      resetAggregation();
      return;
    }
    if (inComment) {
      lineKinds[index] = 'comment';
      return;
    }

    if (isTrackLine(trimmed)) {
      lineKinds[index] = 'track';
      if (simultaneous) {
        warnings.push(`行${lineNumber}：同時区間が閉じる前に新しいトラックが始まりました。`);
        simultaneous = null;
      }
      activeLoops.forEach((loop, name) => {
        warnings.push(`行${lineNumber}：${name}のループ「${loop.label}」が閉じる前に新しいトラックが始まりました。`);
      });
      activeLoops.clear();
      Object.keys(positions).forEach(name => delete positions[name]);
      lineStatuses[index] = {};
      trackOrder += 1;
      track = normalizeTrackName(trimmed, trackOrder);
      lineTracks[index] = track;
      rememberTrack(track);
      speaker = '';
      resetAggregation();
      return;
    }

    const speakerMatch = trimmed.match(/^\/\/([^：:\t\n]+)[：:]/);
    if (speakerMatch) {
      lineKinds[index] = 'speaker';
      speaker = speakerMatch[1].trim();
      lineSpeakers[index] = speaker;
      rememberCharacter(speaker);
      const blockPosition = findSpeakerBlockPosition(lines, index);
      const previousPosition = positions[speaker];
      if (blockPosition && previousPosition && !samePosition(previousPosition, blockPosition)) {
        positionChanges[index][speaker] = { from: previousPosition, to: blockPosition };
      }
      if (blockPosition) positions[speaker] = blockPosition;
      if (lineStatuses[index][speaker]) {
        lineStatuses[index][speaker].position = positions[speaker] || lineStatuses[index][speaker].position;
      } else {
        lineStatuses[index][speaker] = {
          mode: 'hold', position: positions[speaker] || '位置未指定', label: ''
        };
      }
      if (simultaneous) simultaneous.seenCharacters.add(speaker);
      resetAggregation();
      return;
    }

    const positionMatch = trimmed.match(/^◇音声[：:](.*)$/);
    if (positionMatch && speaker) {
      lineKinds[index] = 'position';
      const nextPosition = positionMatch[1].trim() || '位置未指定';
      const previousPosition = positions[speaker];
      if (previousPosition && !samePosition(previousPosition, nextPosition)) {
        positionChanges[index][speaker] = { from: previousPosition, to: nextPosition };
      }
      positions[speaker] = nextPosition;
      if (!lineStatuses[index][speaker]) {
        lineStatuses[index][speaker] = { mode: 'position', position: positions[speaker], label: '' };
      }
      if (simultaneous) simultaneous.positions[speaker] = positions[speaker];
      resetAggregation();
      return;
    }

    if (/^【同時.*ここから/.test(trimmed)) {
      lineKinds[index] = 'simultaneous-start';
      if (simultaneous) warnings.push(`行${lineNumber}：同時区間が閉じる前に次の同時区間が始まりました。`);
      simultaneous = {
        start: lineNumber,
        track,
        seenCharacters: new Set(),
        dialogueCounts: {},
        loopCharacters: new Map(),
        positions: { ...positions }
      };
      resetAggregation();
      return;
    }

    const loop = loopMarker(trimmed);
    if (loop) {
      lineKinds[index] = loop.type === 'ここから' ? 'loop-start' : 'loop-end';
      rememberCharacter(loop.character);
      if (loop.type === 'ここから') {
        const code = materialCode(loop.label);
        const definition = code ? materialDefinitions.get(`${loop.character}|${code}`) : null;
        const loopPosition = definition?.position || positions[loop.character] || '位置未指定';
        if (code && !definition) warnings.push(`行${lineNumber}：${loop.character}の素材「${code}」の定義が見つかりません。現在位置を使用します。`);
        activeLoops.set(loop.character, { label: loop.label, line: lineNumber, position: loopPosition, code });
        lineStatuses[index][loop.character] = {
          mode: 'bgv', position: loopPosition, label: loop.label || 'ループ'
        };
        if (simultaneous) simultaneous.loopCharacters.set(loop.character, { label: loop.label, position: loopPosition });
      } else if (!activeLoops.has(loop.character)) {
        warnings.push(`行${lineNumber}：${loop.character}のループ開始が見つかりません。`);
      } else {
        activeLoops.delete(loop.character);
      }
      resetAggregation();
      return;
    }

    if (/^【同時.*ここまで/.test(trimmed)) {
      lineKinds[index] = 'simultaneous-end';
      if (!simultaneous) {
        warnings.push(`行${lineNumber}：同時区間の開始が見つかりません。`);
        return;
      }
      const statuses = {};
      simultaneous.seenCharacters.forEach(name => {
        const loopData = simultaneous.loopCharacters.get(name);
        statuses[name] = {
          mode: simultaneous.loopCharacters.has(name) ? 'bgv' : 'simultaneous',
          position: loopData?.position || positions[name] || simultaneous.positions[name] || '位置未指定',
          lines: simultaneous.dialogueCounts[name] || 1,
          label: loopData?.label || ''
        };
      });
      simultaneous.loopCharacters.forEach((loopData, name) => {
        statuses[name] = { mode: 'bgv', position: loopData.position || positions[name] || '位置未指定', lines: 1, label: loopData.label };
      });

      // 同時区間では、区間内に登場する全キャラクターが全行で再生中。
      // ループ/BGVが明示されている行だけはBGV表示を優先する。
      for (let rowIndex = simultaneous.start - 1; rowIndex < lineNumber; rowIndex += 1) {
        Object.entries(statuses).forEach(([name, status]) => {
          const existing = lineStatuses[rowIndex][name];
          if (existing?.mode === 'bgv') return;
          lineStatuses[rowIndex][name] = {
            mode: 'simultaneous',
            position: existing?.position || status.position || '位置未指定',
            label: ''
          };
        });
      }
      events.push({ track: simultaneous.track, start: simultaneous.start, end: lineNumber, statuses });
      simultaneous = null;
      resetAggregation();
      return;
    }

    const normalizedLine = trimmed.normalize('NFKC');
    if (/^[＊*]/.test(normalizedLine) && /\d+(?:\.\d+)?\s*(?:秒|回)/.test(normalizedLine) && speaker) {
      lineKinds[index] = 'material';
      const code = materialCode(normalizedLine);
      if (code) {
        materialDefinitions.set(`${speaker}|${code}`, {
          character: speaker,
          code,
          position: positions[speaker] || '位置未指定',
          line: lineNumber
        });
      }
      if (!lineStatuses[index][speaker]) {
        lineStatuses[index][speaker] = { mode: 'material', position: positions[speaker] || '位置未指定', label: '' };
      }
      resetAggregation();
      return;
    }

    if (!isDialogueLine(rawLine) || !speaker) return;
    lineKinds[index] = 'dialogue';
    rememberTrack(track);
    if (simultaneous) {
      simultaneous.seenCharacters.add(speaker);
      simultaneous.dialogueCounts[speaker] = (simultaneous.dialogueCounts[speaker] || 0) + 1;
      if (!lineStatuses[index][speaker]) {
        lineStatuses[index][speaker] = { mode: 'simultaneous', position: positions[speaker] || '位置未指定', label: '' };
      }
      return;
    }

    if (!lineStatuses[index][speaker]) {
      lineStatuses[index][speaker] = { mode: 'main', position: positions[speaker] || '位置未指定', label: '' };
    }

    const loopSignature = [...activeLoops.entries()].map(([name, data]) => `${name}:${data.label}`).join('|');
    const signature = `${track}|${speaker}|${positions[speaker] || ''}|${loopSignature}`;
    if (lastEvent && lastEvent.signature === signature) {
      lastEvent.end = lineNumber;
      lastEvent.statuses[speaker].lines += 1;
    } else {
      const event = { track, start: lineNumber, end: lineNumber, statuses: makeStatuses(speaker, 'main'), signature };
      events.push(event);
      lastEvent = event;
    }
  });

  if (simultaneous) warnings.push(`行${simultaneous.start}：同時区間が閉じられていません。`);
  activeLoops.forEach((loop, name) => warnings.push(`行${loop.line}：${name}のループ「${loop.label}」が閉じられていません。`));
  if (!characters.length) warnings.push('「//キャラ名：」形式の話者指定が見つかりませんでした。');
  if (!tracks.length) tracks.push('TR未特定');

  const continuousStatuses = [];
  const positionHistory = [];
  const latestPositions = {};
  let foregroundSpeaker = '';
  lineStatuses.forEach((statuses, index) => {
    if (lineKinds[index] === 'track') {
      foregroundSpeaker = '';
      Object.keys(latestPositions).forEach(name => delete latestPositions[name]);
    }
    if (lineSpeakers[index]) foregroundSpeaker = lineSpeakers[index];
    Object.entries(statuses).forEach(([name, status]) => {
      latestPositions[name] = status.position || latestPositions[name] || '位置未指定';
    });
    const row = Object.fromEntries(Object.entries(statuses).map(([name, status]) => [name, { ...status }]));
    if (foregroundSpeaker && !row[foregroundSpeaker]) {
      row[foregroundSpeaker] = {
        mode: 'hold', position: latestPositions[foregroundSpeaker] || '位置未指定', label: ''
      };
    }
    continuousStatuses.push(row);
    positionHistory.push({ ...latestPositions });
  });

  return { lines, characters, tracks, events, warnings, lineStatuses, continuousStatuses, positionHistory, lineTracks, lineKinds, lineSpeakers, positionChanges, materialDefinitions };
}

function aggregate(analysis) {
  const totals = {};
  const byTrack = {};
  analysis.characters.forEach(name => {
    totals[name] = { main: 0, simultaneous: 0, bgv: 0 };
  });
  analysis.tracks.forEach(track => {
    byTrack[track] = {};
    analysis.characters.forEach(name => { byTrack[track][name] = { main: 0, simultaneous: 0, bgv: 0 }; });
  });
  analysis.events.forEach(event => {
    Object.entries(event.statuses).forEach(([name, status]) => {
      const value = Math.max(1, status.lines || 1);
      if (!totals[name]) totals[name] = { main: 0, simultaneous: 0, bgv: 0 };
      if (!byTrack[event.track]) byTrack[event.track] = {};
      if (!byTrack[event.track][name]) byTrack[event.track][name] = { main: 0, simultaneous: 0, bgv: 0 };
      totals[name][status.mode] += value;
      byTrack[event.track][name][status.mode] += value;
    });
  });
  return { totals, byTrack };
}

function statMarkup(stats) {
  const parts = [];
  if (stats.main) parts.push(`<span class="mini-stat main">通常 ${stats.main}</span>`);
  if (stats.simultaneous) parts.push(`<span class="mini-stat simultaneous">同時 ${stats.simultaneous}</span>`);
  if (stats.bgv) parts.push(`<span class="mini-stat bgv">BGV ${stats.bgv}</span>`);
  return parts.length ? `<div class="overview-stat">${parts.join('')}</div>` : '<div class="empty-cell">—</div>';
}

function renderSummary(analysis, totals) {
  elements.summary.innerHTML = analysis.characters.map(name => {
    const stats = totals[name];
    return `<article class="summary-card" style="border-left:4px solid ${characterColor(name, analysis.characters)}"><strong>${escapeHtml(name)}</strong><div class="summary-counts">${statMarkup(stats)}</div></article>`;
  }).join('');
  elements.characterLegend.innerHTML = analysis.characters.map(name => `<span><i style="background:${characterColor(name, analysis.characters)}"></i>${escapeHtml(name)}</span>`).join('');
}

function renderOverview(analysis) {
  const counts = {};
  analysis.tracks.forEach(track => {
    counts[track] = {};
    analysis.characters.forEach(name => { counts[track][name] = { left: 0, right: 0 }; });
  });
  let speaker = '';
  analysis.lines.forEach((line, index) => {
    if (analysis.lineKinds[index] === 'track') speaker = '';
    if (analysis.lineSpeakers[index]) speaker = analysis.lineSpeakers[index];
    if (analysis.lineKinds[index] !== 'position' || !speaker) return;
    const track = analysis.lineTracks[index];
    const instruction = line.trim().match(/^◇音声[：:](.*)$/)?.[1] || '';
    if (!counts[track]?.[speaker]) return;
    if (/左/.test(instruction)) counts[track][speaker].left += 1;
    if (/右/.test(instruction)) counts[track][speaker].right += 1;
  });

  const head = analysis.characters.map(name => `<th>${escapeHtml(name)}</th>`).join('');
  const rows = analysis.tracks.map(track => {
    const cells = analysis.characters.map(name => {
      const value = counts[track][name];
      const leftClass = value.left > 0 ? 'left nonzero' : 'zero';
      const rightClass = value.right > 0 ? 'right nonzero' : 'zero';
      return `<td><div class="direction-count"><span class="${leftClass}">左 <strong>${value.left}</strong></span><span class="${rightClass}">右 <strong>${value.right}</strong></span></div></td>`;
    }).join('');
    return `<tr><td><strong>${escapeHtml(track)}</strong></td>${cells}</tr>`;
  }).join('');
  elements.overview.innerHTML = `<table class="overview-table position-count-table"><thead><tr><th>トラック</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderTrackOptions(analysis) {
  elements.trackSelect.innerHTML = `<option value="all">全トラック</option>${analysis.tracks.map(track => `<option value="${escapeHtml(track)}">${escapeHtml(track)}</option>`).join('')}`;
}

function buildSourcePresentations(analysis) {
  let speaker = '';
  return analysis.lines.map((line, index) => {
    const trimmed = line.trim();
    if (analysis.lineKinds[index] === 'track') speaker = '';
    if (analysis.lineSpeakers[index]) speaker = analysis.lineSpeakers[index];

    if (!trimmed) return { className: '', style: '' };
    if (analysis.lineKinds[index] === 'comment') return { className: 'source-comment', style: '' };
    if (/^[＝=]{3,}/.test(trimmed) || analysis.lineKinds[index] === 'track') return { className: 'source-track', style: '' };
    if (/^◆SE[：:]/.test(trimmed) || /^■編集[：:]/.test(trimmed)) return { className: 'source-common-gray', style: '' };
    if (/^【同時.*(?:ここから|ここまで)/.test(trimmed)) return { className: 'source-simultaneous', style: '' };
    if (/^(?:◆SE方向[：:]|※補足[：:]|《状況[：:])/.test(trimmed)) return { className: '', style: '' };

    const loop = loopMarker(trimmed);
    if (loop && analysis.characters.includes(loop.character)) {
      return {
        className: 'source-character source-loop',
        style: `--source-character:${characterColor(loop.character, analysis.characters)};--source-soft:${characterSoftColor(loop.character, analysis.characters)}`
      };
    }
    if (/^[（(][^）)]*[）)]$/.test(trimmed)) return { className: '', style: '' };

    if (speaker && analysis.characters.includes(speaker)) {
      const isBold = /^(?:\/\/|◇音声[：:]|□演技[：:]|[＊*])/.test(trimmed);
      const isMaterial = /^[＊*]/.test(trimmed.normalize('NFKC'));
      return {
        className: `source-character${isBold ? ' source-bold' : ''}${isMaterial ? ' source-material' : ''}`,
        style: `--source-character:${characterColor(speaker, analysis.characters)};--source-soft:${characterSoftColor(speaker, analysis.characters)}`
      };
    }
    return { className: '', style: '' };
  });
}

function renderTimeline(track) {
  const analysis = currentAnalysis;
  const sourcePresentations = buildSourcePresentations(analysis);
  const indexes = analysis.lines.map((_, index) => index).filter(index => track === 'all' || analysis.lineTracks[index] === track);
  const columns = `52px minmax(300px, 2.6fr) repeat(${POSITION_LANES.length}, minmax(62px, .42fr))`;
  const positionHead = POSITION_LANES.map(position => `<div class="continuous-head character-head">${position.label}</div>`).join('');
  const rows = indexes.map(index => {
    const statuses = analysis.continuousStatuses[index];
    const cells = POSITION_LANES.map(position => {
      const occupants = Object.entries(statuses)
        .filter(([, status]) => positionVisual(status.position).lane === position.key)
        .map(([name, status]) => ({ name, status }));
      occupants.sort((left, right) => {
        return analysis.characters.indexOf(left.name) - analysis.characters.indexOf(right.name);
      });
      const markers = occupants.map(({ name, status }) => {
        const visual = positionVisual(status.position);
        const crowded = occupants.length >= 4;
        const shortDistance = occupants.length >= 3
          ? ({ '密着': '密', '近': '近', '通常': '中', '遠': '遠' }[visual.distance] || visual.distance)
          : visual.distance;
        const details = [visual.vertical, shortDistance].filter(Boolean).join(' ');
        const change = analysis.positionChanges[index][name];
        const changeTitle = change ? `｜${change.from} → ${change.to}` : '';
        const verticalChanged = change && positionVisual(change.from).vertical !== visual.vertical;
        const verticalMarker = !crowded && visual.vertical ? `<b class="${verticalChanged ? 'changed-value' : ''}">${visual.vertical}</b>` : '';
        const distanceMarker = crowded ? '' : `<small>${escapeHtml(details.replace(visual.vertical, '').trim())}</small>`;
        const title = `${name}｜${status.position}${changeTitle}`;
        return `<span class="position-marker ${status.mode}${crowded ? ' compact-band' : ''}" style="--character-color:${characterColor(name, analysis.characters)};--distance-strength:${visual.strength}%" title="${escapeHtml(title)}">${verticalMarker}${distanceMarker}</span>`;
      }).join('');
      return `<div class="continuous-cell position-cell count-${occupants.length}">${markers}</div>`;
    }).join('');
    const source = sourcePresentations[index];
    return `<div class="continuous-row" data-line-index="${index}" style="grid-template-columns:${columns}"><div class="source-number">${index + 1}</div><div class="source-text ${source.className}" style="${source.style}">${escapeHtml(analysis.lines[index]) || '&nbsp;'}</div>${cells}</div>`;
  }).join('');
  elements.timeline.innerHTML = `<div class="continuous-header" style="grid-template-columns:${columns}"><div class="continuous-head">行</div><div class="continuous-head script-head">台本</div>${positionHead}</div>${rows}`;

  const timelineRows = Array.from(elements.timeline.querySelectorAll('.continuous-row'));
  const updateTrackerFromScroll = () => {
    if (!timelineRows.length) {
      renderPositionTracker(-1);
      return;
    }
    const targetOffset = elements.timeline.scrollTop + 42;
    let low = 0;
    let high = timelineRows.length - 1;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      const row = timelineRows[middle];
      if (row.offsetTop + row.offsetHeight <= targetOffset) low = middle + 1;
      else high = middle;
    }
    renderPositionTracker(Number(timelineRows[low].dataset.lineIndex));
  };
  let scrollFrame = 0;
  elements.timeline.onscroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateTrackerFromScroll();
    });
  };
  renderPositionTracker(indexes[0] ?? -1);
}

function renderPositionTracker(lineIndex) {
  if (!currentAnalysis || lineIndex < 0) {
    elements.positionTracker.hidden = true;
    return;
  }
  const positions = currentAnalysis.positionHistory[lineIndex] || {};
  const items = currentAnalysis.characters.filter(name => positions[name]).map(name => {
    return `<span class="tracker-item" title="${escapeHtml(`${name}の最終位置`)}"><i style="background:${characterColor(name, currentAnalysis.characters)}"></i><strong>${escapeHtml(name)}：</strong><span>${escapeHtml(positions[name])}</span></span>`;
  }).join('');
  elements.positionTracker.hidden = !items;
  elements.positionTracker.innerHTML = items
    ? `<span class="tracker-title">各キャラクターの最終位置（${lineIndex + 1}行まで）</span><div class="tracker-items">${items}</div>`
    : '';
}

function renderWarnings(warnings) {
  elements.warnings.hidden = warnings.length === 0;
  elements.warningList.innerHTML = warnings.map(warning => `<li>${escapeHtml(warning)}</li>`).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function runAnalysis() {
  const text = elements.input.value;
  if (!text.trim()) {
    elements.input.focus();
    return;
  }
  currentAnalysis = analyzeScript(text);
  const stats = aggregate(currentAnalysis);
  renderSummary(currentAnalysis, stats.totals);
  renderOverview(currentAnalysis);
  renderTrackOptions(currentAnalysis);
  renderWarnings(currentAnalysis.warnings);
  elements.results.hidden = false;
  renderTimeline('all');
  elements.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

elements.analyze.addEventListener('click', runAnalysis);
elements.sample.addEventListener('click', () => {
  elements.input.value = SAMPLE_SCRIPT;
  runAnalysis();
});
elements.clear.addEventListener('click', () => {
  elements.input.value = '';
  elements.results.hidden = true;
  currentAnalysis = null;
  elements.input.focus();
});
elements.trackSelect.addEventListener('change', event => renderTimeline(event.target.value));
