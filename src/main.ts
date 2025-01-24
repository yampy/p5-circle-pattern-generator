import GUI from 'lil-gui';

type Mode = 'circle' | 'leaf';

// パフォルトパラメータ
const DEFAULT_PARAMS = {
  // 共通パラメータ
  backgroundColor: '#948d86',    // 背景色
  showCenterCircle: true,        // 中心円の表示/非表示
  clipOutsideCenter: false,      // 中心円で切り抜き

  // 中心円のパラメータ
  centerRadius: 150,             // 中心の円の半径
  centerStrokeColor: '#ffffff',  // 中心の円の線の色
  centerStrokeWeight: 2,         // 中心の円の線の太さ

  // 外周設定
  outerMode: 'circle',           // 外周のモード（circle/leaf）
  
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
commonFolder.add(params, 'clipOutsideCenter').name('中心円で切り抜き');

// 中心円の設定フォルダー
const centerFolder = gui.addFolder('中心円');
centerFolder.add(params, 'centerRadius', 50, 200).name('中心の円の半径');
centerFolder.addColor(params, 'centerStrokeColor').name('中心の円の線の色');
centerFolder.add(params, 'centerStrokeWeight', 0.5, 5).name('中心の円の線の太さ');

// 外周設定フォルダー
const outerFolder = gui.addFolder('外周設定');
outerFolder.add(params, 'outerMode', { 'Circle': 'circle', 'Leaf': 'leaf' })
  .name('外周のモード')
  .onChange((value: Mode) => {
    currentMode = value;
    if (value === 'circle') {
      outerLeafFolder.hide();
      outerCircleFolder.show();
    } else {
      outerCircleFolder.hide();
      outerLeafFolder.show();
    }
  });

// 外周円の設定フォルダー（Circleモード）
const outerCircleFolder = outerFolder.addFolder('円の設定');
outerCircleFolder.add(params, 'outerCircleDistance', 0, 250).name('中心からの距離');
outerCircleFolder.add(params, 'outerCircleAngleStep', 1, 90).name('回転角度');
outerCircleFolder.add(params, 'outerCircleRotation', 0, 360).name('全体の回転角度');
outerCircleFolder.addColor(params, 'outerCircleStrokeColor').name('円の線の色');
outerCircleFolder.add(params, 'outerCircleRadius', 50, 200).name('円の半径');
outerCircleFolder.add(params, 'outerCircleStrokeWeight', 0.5, 5).name('線の太さ');

// 外周葉の設定フォルダー（Leafモード）
const outerLeafFolder = outerFolder.addFolder('葉の設定');
outerLeafFolder.add(params, 'outerLeafDistance', 0, 250).name('中心からの距離');
outerLeafFolder.add(params, 'outerLeafAngleStep', 1, 90).name('回転角度');
outerLeafFolder.add(params, 'outerLeafGlobalRotation', 0, 360).name('全体の回転角度');
outerLeafFolder.addColor(params, 'outerLeafStrokeColor').name('葉の線の色');
outerLeafFolder.add(params, 'outerLeafRadius', 50, 200).name('葉の大きさ');
outerLeafFolder.add(params, 'outerLeafStrokeWeight', 0.5, 5).name('線の太さ');
outerLeafFolder.add(params, 'outerLeafWidth', 0.1, 1).name('葉の幅');
outerLeafFolder.add(params, 'outerLeafRotation', -180, 180).name('葉の向き');
outerLeafFolder.add(params, 'outerLeafAngle', 1, 90).name('葉の角度');

// 初期状態でLeafフォルダーを非表示
if (params.outerMode === 'circle') {
  outerLeafFolder.hide();
} else {
  outerCircleFolder.hide();
}

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
    
    const nameContainer = document.createElement('div');
    nameContainer.className = 'preset-name';
    
    const nameInput = document.createElement('input');
    nameInput.className = 'preset-name-input';
    nameInput.value = preset.name;
    nameInput.readOnly = true;
    
    // シングルクリックでプリセット読み込み
    nameInput.onclick = () => {
      if (nameInput.readOnly) {
        loadPreset(preset);
      }
    };
    
    // ダブルクリックで編集モード
    nameInput.ondblclick = (e) => {
      e.stopPropagation();
      nameInput.readOnly = false;
      nameInput.focus();
      nameInput.select();
    };
    
    // 編集完了時の処理
    nameInput.onblur = () => {
      if (!nameInput.readOnly) {
        nameInput.readOnly = true;
        preset.name = nameInput.value;
      }
    };
    
    // Enterキーで編集完了
    nameInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        nameInput.blur();
      } else if (e.key === 'Escape') {
        nameInput.value = preset.name; // 元の値に戻す
        nameInput.blur();
      }
    };
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-preset';
    deleteButton.textContent = '×';
    deleteButton.onclick = (e) => {
      e.stopPropagation();
      deletePreset(preset.id);
    };

    nameContainer.appendChild(nameInput);
    item.appendChild(nameContainer);
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

// p5.jsのスケッチ定義
const sketch = (p: any) => {
  p.setup = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    p.createCanvas(canvasWidth, canvasHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    const bgColor = p.color(params.backgroundColor);
    p.background(bgColor);
    p.translate(p.width / 2, p.height / 2);

    if (params.clipOutsideCenter) {
      // マスク用のグラフィックスバッファを作成
      const maskBuffer = p.createGraphics(p.width, p.height);
      maskBuffer.background(0);
      maskBuffer.translate(maskBuffer.width / 2, maskBuffer.height / 2);
      maskBuffer.fill(255);
      maskBuffer.noStroke();
      maskBuffer.circle(0, 0, params.centerRadius * 2);

      // 描画用のグラフィックスバッファを作成
      const drawBuffer = p.createGraphics(p.width, p.height);
      drawBuffer.translate(drawBuffer.width / 2, drawBuffer.height / 2);
      drawBuffer.angleMode(p.DEGREES);
      drawBuffer.background(bgColor);

      // 図形を描画
      if (currentMode === 'circle') {
        drawCircles();
      } else {
        drawLeaves();
      }

      // 中心円を描画（表示設定がONの場合）
      if (params.showCenterCircle) {
        drawBuffer.noFill();
        drawBuffer.stroke(params.centerStrokeColor);
        drawBuffer.strokeWeight(params.centerStrokeWeight);
        drawBuffer.circle(0, 0, params.centerRadius * 2);
      }

      // マスクを適用
      drawBuffer.loadPixels();
      maskBuffer.loadPixels();
      
      for (let i = 0; i < drawBuffer.pixels.length; i += 4) {
        // マスクのアルファ値（白=255、黒=0）を使用
        const maskAlpha = maskBuffer.pixels[i];
        if (maskAlpha === 0) {
          // マスクが黒の部分は完全に透明にする
          drawBuffer.pixels[i + 3] = 0;
        }
      }
      
      drawBuffer.updatePixels();

      // 背景を描画
      p.background(0);

      // マスクされた図形を描画
      p.image(drawBuffer, -p.width / 2, -p.height / 2);
    } else {
      // 通常の描画
      if (currentMode === 'circle') {
        drawCircles();
      } else {
        drawLeaves();
      }

      // 中心円の描画
      if (params.showCenterCircle) {
        p.noFill();
        p.stroke(params.centerStrokeColor);
        p.strokeWeight(params.centerStrokeWeight);
        p.circle(0, 0, params.centerRadius * 2);
      }
    }
  };

  // 円を描画する関数
  function drawCircles() {
    p.noFill();
    for (let angle = 0; angle < 360; angle += params.outerCircleAngleStep) {
      const rotatedAngle = angle + params.outerCircleRotation;
      const x = params.outerCircleDistance * p.cos(rotatedAngle);
      const y = params.outerCircleDistance * p.sin(rotatedAngle);
      
      p.stroke(params.outerCircleStrokeColor);
      p.strokeWeight(params.outerCircleStrokeWeight);
      p.circle(x, y, params.outerCircleRadius * 2);
    }
  }

  // 葉を描画する関数
  function drawLeaves() {
    p.noFill();
    for (let angle = 0; angle < 360; angle += params.outerLeafAngleStep) {
      const rotatedAngle = angle + params.outerLeafGlobalRotation;
      const x = params.outerLeafDistance * p.cos(rotatedAngle);
      const y = params.outerLeafDistance * p.sin(rotatedAngle);
      
      p.stroke(params.outerLeafStrokeColor);
      p.strokeWeight(params.outerLeafStrokeWeight);
      drawLeaf(x, y, rotatedAngle);
    }
  }

  // 個々の葉を描画する関数
  function drawLeaf(x: number, y: number, angle: number) {
    p.push();
    p.translate(x, y);
    p.rotate(angle + params.outerLeafRotation);
    
    const leafLength = params.outerLeafRadius;
    const leafAngle = params.outerLeafAngle;
    
    p.beginShape();
    for (let t = -leafAngle; t <= leafAngle; t++) {
      const r = leafLength * p.cos(t * (90 / leafAngle));
      const xPos = r * p.cos(t);
      const yPos = r * p.sin(t) * params.outerLeafWidth;
      p.vertex(xPos, yPos);
    }
    p.endShape();
    
    p.pop();
  }

  // バッファに円を描画する関数
  function drawCirclesTo(buffer: any) {
    buffer.noFill();
    for (let angle = 0; angle < 360; angle += params.outerCircleAngleStep) {
      const rotatedAngle = angle + params.outerCircleRotation;
      const x = params.outerCircleDistance * buffer.cos(rotatedAngle);
      const y = params.outerCircleDistance * buffer.sin(rotatedAngle);
      
      buffer.stroke(params.outerCircleStrokeColor);
      buffer.strokeWeight(params.outerCircleStrokeWeight);
      buffer.circle(x, y, params.outerCircleRadius * 2);
    }
  }

  // バッファに葉を描画する関数
  function drawLeavesTo(buffer: any) {
    buffer.noFill();
    for (let angle = 0; angle < 360; angle += params.outerLeafAngleStep) {
      const rotatedAngle = angle + params.outerLeafGlobalRotation;
      const x = params.outerLeafDistance * buffer.cos(rotatedAngle);
      const y = params.outerLeafDistance * buffer.sin(rotatedAngle);
      
      buffer.stroke(params.outerLeafStrokeColor);
      buffer.strokeWeight(params.outerLeafStrokeWeight);
      drawLeafTo(buffer, x, y, rotatedAngle);
    }
  }

  // バッファに個々の葉を描画する関数
  function drawLeafTo(buffer: any, x: number, y: number, angle: number) {
    buffer.push();
    buffer.translate(x, y);
    buffer.rotate(angle + params.outerLeafRotation);
    
    const leafLength = params.outerLeafRadius;
    const leafAngle = params.outerLeafAngle;
    
    buffer.beginShape();
    for (let t = -leafAngle; t <= leafAngle; t++) {
      const r = leafLength * buffer.cos(t * (90 / leafAngle));
      const xPos = r * buffer.cos(t);
      const yPos = r * buffer.sin(t) * params.outerLeafWidth;
      buffer.vertex(xPos, yPos);
    }
    buffer.endShape();
    
    buffer.pop();
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
    createGraphics: (w: number, h: number) => any;
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
    beginContour: () => void;
    endContour: () => void;
    vertex: (x: number, y: number) => void;
    CLOSE: any;
    width: number;
    height: number;
    rect: (x: number, y: number, w: number, h: number) => void;
    image: (img: any, x: number, y: number) => void;
    loadPixels: () => void;
    updatePixels: () => void;
    pixels: Uint8Array;
    drawingContext: {
      save: () => void;
      restore: () => void;
      globalCompositeOperation: string;
    };
  }
}

// サイドバーのリサイズ機能
const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('sidebar-resizer');

if (sidebar && resizer) {
  let isResizing = false;
  let startX: number;
  let startWidth: number;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(getComputedStyle(sidebar).width, 10);
    
    document.documentElement.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const width = startWidth + (e.clientX - startX);
    if (width >= 200 && width <= 500) {
      sidebar.style.width = `${width}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.documentElement.style.cursor = '';
  });
}

// プリセットを保存する関数
function savePresetWithParams(presetParams: typeof params, modeName: Mode, name: string) {
  const preset: Preset = {
    id: String(presetCounter++),
    name,
    params: { ...presetParams },
    mode: modeName
  };
  presets.push(preset);
  updatePresetList();
}

// 美しいパターンのプリセットを保存
function saveGeometricPresets() {
  // Preset 1: Golden Circle（黄金比の円）
  savePresetWithParams({
    ...DEFAULT_PARAMS,
    backgroundColor: '#2C3E50',
    centerRadius: 89,
    centerStrokeColor: '#E8E8E8',
    centerStrokeWeight: 1.5,
    outerMode: 'circle',
    outerCircleDistance: 144,
    outerCircleAngleStep: 21.6,
    outerCircleRadius: 55,
    outerCircleStrokeColor: '#E8E8E8',
    outerCircleStrokeWeight: 1.5
  }, 'circle', 'Preset #1: Golden Circle');

  // Preset 2: Organic Leaves（有機的な葉）
  savePresetWithParams({
    ...DEFAULT_PARAMS,
    backgroundColor: '#1A472A',
    centerRadius: 100,
    centerStrokeColor: '#98FB98',
    centerStrokeWeight: 1,
    outerMode: 'leaf',
    outerLeafDistance: 150,
    outerLeafAngleStep: 40,
    outerLeafRotation: -45,
    outerLeafGlobalRotation: 20,
    outerLeafStrokeColor: '#98FB98',
    outerLeafRadius: 120,
    outerLeafWidth: 0.7,
    outerLeafAngle: 45
  }, 'leaf', 'Preset #2: Organic Leaves');

  // Preset 3: Minimal Circles（ミニマルな円）
  savePresetWithParams({
    ...DEFAULT_PARAMS,
    backgroundColor: '#212121',
    centerRadius: 60,
    centerStrokeColor: '#FFFFFF',
    centerStrokeWeight: 1,
    outerMode: 'circle',
    outerCircleDistance: 120,
    outerCircleAngleStep: 30,
    outerCircleRadius: 30,
    outerCircleStrokeColor: '#FFFFFF',
    outerCircleStrokeWeight: 1
  }, 'circle', 'Preset #3: Minimal Circles');

  // Preset 4: Spiral Leaves（螺旋の葉）
  savePresetWithParams({
    ...DEFAULT_PARAMS,
    backgroundColor: '#2C3E50',
    centerRadius: 80,
    centerStrokeColor: '#E74C3C',
    centerStrokeWeight: 1.5,
    outerMode: 'leaf',
    outerLeafDistance: 130,
    outerLeafAngleStep: 20,
    outerLeafRotation: -60,
    outerLeafGlobalRotation: 0,
    outerLeafStrokeColor: '#E74C3C',
    outerLeafRadius: 100,
    outerLeafWidth: 0.6,
    outerLeafAngle: 30
  }, 'leaf', 'Preset #4: Spiral Leaves');

  // Preset 5: Radial Harmony（放射状の調和）
  savePresetWithParams({
    ...DEFAULT_PARAMS,
    backgroundColor: '#34495E',
    centerRadius: 120,
    centerStrokeColor: '#F1C40F',
    centerStrokeWeight: 2,
    outerMode: 'circle',
    outerCircleDistance: 180,
    outerCircleAngleStep: 15,
    outerCircleRadius: 40,
    outerCircleStrokeColor: '#F1C40F',
    outerCircleStrokeWeight: 1.5
  }, 'circle', 'Preset #5: Radial Harmony');
}

// プリセットを保存
saveGeometricPresets();
