import GUI from 'lil-gui';

type Mode = 'circle' | 'leaf';

// パフォルトパラメータ
const DEFAULT_PARAMS = {
  // 共通パラメータ
  backgroundColor: '#948d86',    // 背景色
  showCenterCircle: true,        // 中心円の表示/非表示

  // 中心円のパラメータ
  centerRadius: 150,             // 中心の円の半径
  centerStrokeColor: '#ffffff',  // 中心の円の線の色
  centerStrokeWeight: 2,         // 中心の円の線の太さ

  // 外周円のパラメータ（Circleモード）
  outerCircleDistance: 150,      // 中心からの距離
  outerCircleAngleStep: 30,      // 回転角度
  outerCircleRotation: 0,        // 全体の回転角度
  outerCircleStrokeColor: '#ffffff',  // 円の線の色
  outerCircleRadius: 150,        // 円の半径
  outerCircleStrokeWeight: 2,    // 線の太さ

  // 外周葉のパラメータ（Leafモード）
  outerLeafDistance: 150,        // 中心からの距離
  outerLeafAngleStep: 30,        // 回転角度
  outerLeafRotation: -90,        // 葉の向き
  outerLeafGlobalRotation: 0,    // 全体の回転角度
  outerLeafStrokeColor: '#ffffff',  // 葉の線の色
  outerLeafRadius: 150,          // 葉の大きさ
  outerLeafStrokeWeight: 2,      // 線の太さ
  outerLeafWidth: 0.8,           // 葉の幅
  outerLeafAngle: 60             // 葉の角度
};

// パラメータの設定
const params = { ...DEFAULT_PARAMS };

// 現在のモード
let currentMode: Mode = 'circle';

// キャンバスのサイズを保持する変数
let canvasWidth: number;
let canvasHeight: number;

// GUIの設定
const gui = new GUI();

// 共通設定フォルダー
const commonFolder = gui.addFolder('共通パラメータ');
commonFolder.addColor(params, 'backgroundColor').name('背景色');
commonFolder.add(params, 'showCenterCircle').name('中心円を表示');

// 中心円の設定フォルダー
const centerFolder = gui.addFolder('中心円');
centerFolder.add(params, 'centerRadius', 50, 200).name('中心の円の半径');
centerFolder.addColor(params, 'centerStrokeColor').name('中心の円の線の色');
centerFolder.add(params, 'centerStrokeWeight', 0.5, 5).name('中心の円の線の太さ');

// 外周円の設定フォルダー（Circleモード）
const outerCircleFolder = gui.addFolder('外周円');
outerCircleFolder.add(params, 'outerCircleDistance', 0, 250).name('中心からの距離');
outerCircleFolder.add(params, 'outerCircleAngleStep', 1, 90).name('回転角度');
outerCircleFolder.add(params, 'outerCircleRotation', 0, 360).name('全体の回転角度');
outerCircleFolder.addColor(params, 'outerCircleStrokeColor').name('円の線の色');
outerCircleFolder.add(params, 'outerCircleRadius', 50, 200).name('円の半径');
outerCircleFolder.add(params, 'outerCircleStrokeWeight', 0.5, 5).name('線の太さ');

// 外周葉の設定フォルダー（Leafモード）
const outerLeafFolder = gui.addFolder('外周葉');
outerLeafFolder.add(params, 'outerLeafDistance', 0, 250).name('中心からの距離');
outerLeafFolder.add(params, 'outerLeafAngleStep', 1, 90).name('回転角度');
outerLeafFolder.add(params, 'outerLeafGlobalRotation', 0, 360).name('全体の回転角度');
outerLeafFolder.addColor(params, 'outerLeafStrokeColor').name('葉の線の色');
outerLeafFolder.add(params, 'outerLeafRadius', 50, 200).name('葉の大きさ');
outerLeafFolder.add(params, 'outerLeafStrokeWeight', 0.5, 5).name('線の太さ');
outerLeafFolder.add(params, 'outerLeafWidth', 0.1, 1).name('葉の幅');
outerLeafFolder.add(params, 'outerLeafRotation', -180, 180).name('葉の向き');
outerLeafFolder.add(params, 'outerLeafAngle', 1, 90).name('葉の角度');

// Resetボタンの追加
gui.add({
  reset: () => {
    // すべてのパラメータをデフォルト値に戻す
    Object.assign(params, DEFAULT_PARAMS);
    // GUIを更新
    gui.controllers.forEach(controller => controller.updateDisplay());
  }
}, 'reset').name('Reset');

// プリセットの型定義
type Preset = {
  id: string;
  name: string;
  params: typeof params;
  mode: Mode;
};

// プリセットを保存する配列
let presets: Preset[] = [];

// プリセットカウンター
let presetCounter = 1;

// プリセットリストを更新する関数
function updatePresetList() {
  const presetList = document.getElementById('preset-list');
  if (!presetList) return;

  presetList.innerHTML = '';
  // プリセットを新しい順（IDの降順）にソート
  const sortedPresets = [...presets].sort((a, b) => 
    parseInt(b.id) - parseInt(a.id)
  );
  
  sortedPresets.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = preset.name;
    nameSpan.onclick = () => loadPreset(preset);
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-preset';
    deleteButton.textContent = '×';
    deleteButton.onclick = (e) => {
      e.stopPropagation();
      deletePreset(preset.id);
    };

    item.appendChild(nameSpan);
    item.appendChild(deleteButton);
    presetList.appendChild(item);
  });
}

// プリセットを読み込む関数
function loadPreset(preset: Preset) {
  // パラメーターの復元
  Object.assign(params, preset.params);
  
  // モードの復元
  currentMode = preset.mode;
  const circleButton = document.getElementById('circle-mode');
  const leafButton = document.getElementById('leaf-mode');
  
  if (circleButton && leafButton) {
    if (currentMode === 'circle') {
      circleButton.classList.add('active');
      leafButton.classList.remove('active');
      outerLeafFolder.hide();
      outerCircleFolder.show();
    } else {
      leafButton.classList.add('active');
      circleButton.classList.remove('active');
      outerCircleFolder.hide();
      outerLeafFolder.show();
    }
  }
}

// プリセットを削除する関数
function deletePreset(id: string) {
  presets = presets.filter(p => p.id !== id);
  updatePresetList();
}

// 日時をフォーマットする関数
function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}

// p5.jsのスケッチ定義
const sketch = (p: any) => {
  let offscreenCanvas: any;

  p.setup = () => {
    // メインキャンバスの作成
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    p.createCanvas(canvasWidth, canvasHeight);
    
    // オフスクリーンキャンバスの作成
    offscreenCanvas = p.createGraphics(canvasWidth, canvasHeight);
    
    p.angleMode(p.DEGREES);
    setupModeButtons();
    setupDownloadButton();

    // 初期状態でLeafフォルダーを非表示
    if (currentMode === 'circle') {
      outerLeafFolder.hide();
    } else {
      outerCircleFolder.hide();
    }

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      p.resizeCanvas(canvasWidth, canvasHeight);
    });

    // Save ボタンのイベントリスナーを設定
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const now = new Date();
        const preset: Preset = {
          id: Date.now().toString(),
          name: formatDateTime(now),
          params: JSON.parse(JSON.stringify(params)),
          mode: currentMode
        };
        presets.push(preset);
        updatePresetList();
      });
    }
  };

  // モード切り替えボタンの設定
  const setupModeButtons = () => {
    const circleButton = document.getElementById('circle-mode');
    const leafButton = document.getElementById('leaf-mode');

    if (circleButton && leafButton) {
      circleButton.addEventListener('click', () => {
        currentMode = 'circle';
        circleButton.classList.add('active');
        leafButton.classList.remove('active');
        outerLeafFolder.hide();
        outerCircleFolder.show();
      });

      leafButton.addEventListener('click', () => {
        currentMode = 'leaf';
        leafButton.classList.add('active');
        circleButton.classList.remove('active');
        outerCircleFolder.hide();
        outerLeafFolder.show();
      });
    }
  };

  // ダウンロードボタンの設定
  const setupDownloadButton = () => {
    // PNGダウンロードボタン
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) {
      downloadButton.addEventListener('click', () => {
        // オフスクリーンキャンバスに描画
        drawToOffscreen();
        // 画像としてダウンロード
        const timestamp = formatDateTime(new Date()).replace(/[/:]/g, '-');
        offscreenCanvas.save(`pattern-${timestamp}.png`);
      });
    }

    // SVGダウンロードボタン
    const downloadSvgButton = document.getElementById('download-svg-button');
    if (downloadSvgButton) {
      downloadSvgButton.addEventListener('click', () => {
        const timestamp = formatDateTime(new Date()).replace(/[/:]/g, '-');
        downloadSVG(`pattern-${timestamp}.svg`);
      });
    }
  };

  // SVGを生成してダウンロードする関数
  const downloadSVG = (filename: string) => {
    // SVG要素を作成
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', canvasWidth.toString());
    svg.setAttribute('height', canvasHeight.toString());
    svg.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);
    
    // 背景を設定
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', params.backgroundColor);
    svg.appendChild(background);

    // グループ要素を作成（中心に移動するための変換を適用）
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${canvasWidth / 2} ${canvasHeight / 2})`);
    
    // 中心の円を描画
    if (params.showCenterCircle) {
      const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerCircle.setAttribute('cx', '0');
      centerCircle.setAttribute('cy', '0');
      centerCircle.setAttribute('r', params.centerRadius.toString());
      centerCircle.setAttribute('fill', 'none');
      centerCircle.setAttribute('stroke', params.centerStrokeColor);
      centerCircle.setAttribute('stroke-width', params.centerStrokeWeight.toString());
      g.appendChild(centerCircle);
    }

    // パターンの描画
    for (let angle = 0; angle < 360; angle += (currentMode === 'circle' ? params.outerCircleAngleStep : params.outerLeafAngleStep)) {
      const distance = currentMode === 'circle' ? params.outerCircleDistance : params.outerLeafDistance;
      const rotatedAngle = currentMode === 'circle' 
        ? angle + params.outerCircleRotation 
        : angle + params.outerLeafGlobalRotation;
      const x = distance * Math.cos(rotatedAngle * Math.PI / 180);
      const y = distance * Math.sin(rotatedAngle * Math.PI / 180);
      
      if (currentMode === 'circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', params.outerCircleRadius.toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', params.outerCircleStrokeColor);
        circle.setAttribute('stroke-width', params.outerCircleStrokeWeight.toString());
        g.appendChild(circle);
      } else {
        const path = createLeafPath(x, y, rotatedAngle);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', params.outerLeafStrokeColor);
        path.setAttribute('stroke-width', params.outerLeafStrokeWeight.toString());
        g.appendChild(path);
      }
    }

    svg.appendChild(g);

    // SVGをBlobに変換してダウンロード
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 葉のSVGパスを生成する関数
  const createLeafPath = (x: number, y: number, angle: number) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const leafLength = params.outerLeafRadius;
    const leafWidth = params.outerLeafRadius * params.outerLeafWidth;
    const maxAngle = params.outerLeafAngle;
    
    let d = 'M ';
    const points: string[] = [];
    
    // 上半分の曲線
    for (let t = 0; t <= maxAngle; t++) {
      const xPos = -leafLength * Math.cos((t * 180) / maxAngle);
      const yPos = leafWidth * Math.sin((t * 180) / maxAngle) * Math.sin((t * 90) / maxAngle);
      points.push(`${xPos},${yPos}`);
    }
    
    // 下半分の曲線
    for (let t = maxAngle; t >= 0; t--) {
      const xPos = -leafLength * Math.cos((t * 180) / maxAngle);
      const yPos = -leafWidth * Math.sin((t * 180) / maxAngle) * Math.sin((t * 90) / maxAngle);
      points.push(`${xPos},${yPos}`);
    }
    
    d += points.join(' L ') + ' Z';
    path.setAttribute('d', d);
    
    // 位置と回転を設定
    const transform = `translate(${x} ${y}) rotate(${angle - 90 + params.outerLeafRotation})`;
    path.setAttribute('transform', transform);
    
    return path;
  };

  // オフスクリーンキャンバスに描画する関数
  const drawToOffscreen = () => {
    offscreenCanvas.background(params.backgroundColor);
    offscreenCanvas.translate(canvasWidth / 2, canvasHeight / 2);
    
    // 中心の円を描画
    if (params.showCenterCircle) {
      offscreenCanvas.noFill();
      offscreenCanvas.stroke(params.centerStrokeColor);
      offscreenCanvas.strokeWeight(params.centerStrokeWeight);
      offscreenCanvas.circle(0, 0, params.centerRadius * 2);
    }

    // パターンの描画
    for (let angle = 0; angle < 360; angle += (currentMode === 'circle' ? params.outerCircleAngleStep : params.outerLeafAngleStep)) {
      const distance = currentMode === 'circle' ? params.outerCircleDistance : params.outerLeafDistance;
      const rotatedAngle = currentMode === 'circle' 
        ? angle + params.outerCircleRotation 
        : angle + params.outerLeafGlobalRotation;
      const x = distance * p.cos(rotatedAngle);
      const y = distance * p.sin(rotatedAngle);
      
      if (currentMode === 'circle') {
        offscreenCanvas.stroke(params.outerCircleStrokeColor);
        offscreenCanvas.strokeWeight(params.outerCircleStrokeWeight);
        offscreenCanvas.circle(x, y, params.outerCircleRadius * 2);
      } else {
        offscreenCanvas.stroke(params.outerLeafStrokeColor);
        offscreenCanvas.strokeWeight(params.outerLeafStrokeWeight);
        drawLeafToOffscreen(x, y, rotatedAngle);
      }
    }
  };

  // オフスクリーンキャンバスに葉を描画する関数
  const drawLeafToOffscreen = (x: number, y: number, angle: number) => {
    offscreenCanvas.push();
    offscreenCanvas.translate(x, y);
    offscreenCanvas.rotate(angle - 90 + params.outerLeafRotation);

    const leafLength = params.outerLeafRadius;
    const leafWidth = params.outerLeafRadius * params.outerLeafWidth;
    const maxAngle = params.outerLeafAngle;

    offscreenCanvas.beginShape();
    for (let t = 0; t <= maxAngle; t++) {
      const rad = p.radians(t);
      const xPos = -leafLength * p.cos((t * 180) / maxAngle);
      const yPos = leafWidth * p.sin((t * 180) / maxAngle) * p.sin((t * 90) / maxAngle);
      offscreenCanvas.vertex(xPos, yPos);
    }
    for (let t = maxAngle; t >= 0; t--) {
      const rad = p.radians(t);
      const xPos = -leafLength * p.cos((t * 180) / maxAngle);
      const yPos = -leafWidth * p.sin((t * 180) / maxAngle) * p.sin((t * 90) / maxAngle);
      offscreenCanvas.vertex(xPos, yPos);
    }
    offscreenCanvas.endShape(p.CLOSE);
    offscreenCanvas.pop();
  };

  // メインキャンバスに葉を描画する関数
  const drawLeaf = (x: number, y: number, angle: number) => {
    p.push();
    p.translate(x, y);
    p.rotate(angle - 90 + params.outerLeafRotation);

    const leafLength = params.outerLeafRadius;
    const leafWidth = params.outerLeafRadius * params.outerLeafWidth;
    const maxAngle = params.outerLeafAngle;

    p.beginShape();
    for (let t = 0; t <= maxAngle; t++) {
      const rad = p.radians(t);
      const xPos = -leafLength * p.cos((t * 180) / maxAngle);
      const yPos = leafWidth * p.sin((t * 180) / maxAngle) * p.sin((t * 90) / maxAngle);
      p.vertex(xPos, yPos);
    }
    for (let t = maxAngle; t >= 0; t--) {
      const rad = p.radians(t);
      const xPos = -leafLength * p.cos((t * 180) / maxAngle);
      const yPos = -leafWidth * p.sin((t * 180) / maxAngle) * p.sin((t * 90) / maxAngle);
      p.vertex(xPos, yPos);
    }
    p.endShape(p.CLOSE);
    p.pop();
  };

  p.draw = () => {
    const bgColor = p.color(params.backgroundColor);
    
    p.background(bgColor);
    p.translate(canvasWidth / 2, canvasHeight / 2);
    
    // 中心の円を描画（表示設定が有効な場合のみ）
    if (params.showCenterCircle) {
      p.noFill();
      p.stroke(params.centerStrokeColor);
      p.strokeWeight(params.centerStrokeWeight);
      p.circle(0, 0, params.centerRadius * 2);
    }

    // パターンの描画
    for (let angle = 0; angle < 360; angle += (currentMode === 'circle' ? params.outerCircleAngleStep : params.outerLeafAngleStep)) {
      const distance = currentMode === 'circle' ? params.outerCircleDistance : params.outerLeafDistance;
      const rotatedAngle = currentMode === 'circle' 
        ? angle + params.outerCircleRotation 
        : angle + params.outerLeafGlobalRotation;
      const x = distance * p.cos(rotatedAngle);
      const y = distance * p.sin(rotatedAngle);
      
      if (currentMode === 'circle') {
        p.stroke(params.outerCircleStrokeColor);
        p.strokeWeight(params.outerCircleStrokeWeight);
        p.circle(x, y, params.outerCircleRadius * 2);
      } else {
        p.stroke(params.outerLeafStrokeColor);
        p.strokeWeight(params.outerLeafStrokeWeight);
        drawLeaf(x, y, rotatedAngle);
      }
    }
  };
};

// p5.jsのインスタンスを作成
new p5(sketch);

// TypeScriptのグローバル宣言
declare global {
  class p5 {
    constructor(sketch: (p: any) => void);
    setup: () => void;
    draw: () => void;
    createCanvas: (w: number, h: number) => void;
    background: (color: any) => void;
    fill: (r: number, g: number, b: number) => void;
    noFill: () => void;
    stroke: (color: any) => void;
    strokeWeight: (weight: number) => void;
    noStroke: () => void;
    circle: (x: number, y: number, d: number) => void;
    color: (value: string) => any;
    translate: (x: number, y: number) => void;
    angleMode: (mode: any) => void;
    DEGREES: any;
    cos: (angle: number) => number;
    sin: (angle: number) => number;
    radians: (degrees: number) => number;
    push: () => void;
    pop: () => void;
    rotate: (angle: number) => void;
    beginShape: () => void;
    endShape: (mode?: any) => void;
    vertex: (x: number, y: number) => void;
    CLOSE: any;
    width: number;
    height: number;
  }
}
