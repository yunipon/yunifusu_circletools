<!DOCTYPE html>
<html lang="ja">

<head>
  <?php include __DIR__ . '/headertools.php'; ?>
  <style>
    /* 親コンテナの設定 */
    .bpm-container {
      display: flex;
      flex-wrap: wrap;
      /* 幅が足りない時は自動で改行する */
      justify-content: center;
      /* 中央寄せ */
      gap: 20px;
      /* ボックス同士の隙間 */
      margin: 30px auto;
      max-width: 1500px;
      /* 全体の最大幅 */
    }

    /* 各ボックスの幅調整 */
    .bpm-tool {
      flex: 0 1 300px;
      /* 基本300px幅、画面が狭ければ縮む */
      background: #fff;
      color: var(--text-color);
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    /* スマホ用の調整（画面幅が狭い時） */
    @media screen and (max-width: 600px) {
      .bpm-container {
        flex-direction: column;
        /* 縦に積む */
        align-items: center;
      }

      .bpm-tool {
        width: 90%;
        /* スマホでは画面いっぱいに近くする */
        flex: none;
      }
    }

    .bpm-display input {
      background: transparent;
      border: none;
      color: var(--text-color);
      font-size: 48px;
      font-weight: bold;
      width: 100px;
      text-align: center;
    }

    .slider {
      width: 100%;
      margin: 20px 0;
      cursor: pointer;
    }

    .start-stop {
      background: var(--accent-color);
      border: none;
      color: white;
      padding: 10px 40px;
      margin-top: 10px;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.2s;
    }

    .start-stop:hover {
      opacity: 0.8;
    }

    .start-stop.playing {
      background: #555;
    }
  </style>
</head>

<body>
  <?php include __DIR__ . '/../menu.php'; ?>

  <div class="main-content">

    <h2>BPMスピード確認</h2>

    <div class="bpm-container">
      <div class="bpm-tool">
        <div class="bpm-display">
          <input type="number" class="bpm-number" value="60" min="1" max="300">
          <span>BPM</span>
        </div>
        <input type="range" class="bpm-range" min="1" max="300" value="60">
        <div class="controls">
          <button class="start-stop">START</button>
        </div>
      </div>

      <div class="bpm-tool">
        <div class="bpm-display">
          <input type="number" class="bpm-number" value="110" min="1" max="300">
          <span>BPM</span>
        </div>
        <input type="range" class="bpm-range" min="1" max="300" value="110">
        <div class="controls">
          <button class="start-stop">START</button>
        </div>
      </div>

      <div class="bpm-tool">
        <div class="bpm-display">
          <input type="number" class="bpm-number" value="170" min="1" max="300">
          <span>BPM</span>
        </div>
        <input type="range" class="bpm-range" min="1" max="300" value="170">
        <div class="controls">
          <button class="start-stop">START</button>
        </div>
      </div>

    </div>


  </div>

  <?php include __DIR__ . '/../footer.php'; ?>

  <script>
    class Metronome {
      constructor(element) {
        this.element = element;
        this.audioContext = null;
        this.nextTickTime = 0;
        this.timerID = null;
        this.isPlaying = false;

        // パーツの取得
        this.startStopBtn = element.querySelector('.start-stop');
        this.bpmRange = element.querySelector('.bpm-range');
        this.bpmNumber = element.querySelector('.bpm-number');
        this.bpm = parseInt(this.bpmNumber.value);

        // イベント登録
        this.startStopBtn.addEventListener('click', () => this.toggle());
        this.bpmRange.addEventListener('input', (e) => this.updateBpm(e.target.value));
        this.bpmNumber.addEventListener('input', (e) => this.updateBpm(e.target.value));
      }

      updateBpm(val) {
        this.bpm = val;
        this.bpmRange.value = val;
        this.bpmNumber.value = val;
      }

      playClick(time) {
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        envelope.gain.value = 1;
        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);
        osc.start(time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.stop(time + 0.1);
      }

      scheduler() {
        while (this.nextTickTime < this.audioContext.currentTime + 0.1) {
          this.playClick(this.nextTickTime);
          this.nextTickTime += 60.0 / this.bpm;
        }
        this.timerID = setTimeout(() => this.scheduler(), 25);
      }

      toggle() {
        if (!this.audioContext) this.audioContext = new(window.AudioContext || window.webkitAudioContext)();

        if (this.isPlaying) {
          this.isPlaying = false;
          clearTimeout(this.timerID);
          this.startStopBtn.textContent = 'START';
          this.startStopBtn.classList.remove('playing');
        } else {
          this.isPlaying = true;
          this.nextTickTime = this.audioContext.currentTime;
          this.scheduler();
          this.startStopBtn.textContent = 'STOP';
          this.startStopBtn.classList.add('playing');
        }
      }
    }

    // ページ内のすべての.bpm-toolにメトロノーム機能を適用
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.bpm-tool').forEach(el => new Metronome(el));
    });
  </script>

</body>

</html>