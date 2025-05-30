import GUI from 'lil-gui';

type Mode = 'circle' | 'leaf';

// パフォルトパラメータ
const DEFAULT_PARAMS = {
  // 共通パラメータ
  backgroundColor: '#948d86',    // 背景色
  showCenterCircle: true,        // 中心円の表示/非表示
  clipOutsideCenter: false,      // 中心円で切り抜き

  // アニメーション設定
  animationEnabled: true,        // アニメーション有効/無効
  animationSpeed: 1,             // アニメーション速度
  backgroundColorAnim: true,     // 背景色アニメーション
  centerRadiusAnim: true,        // 中心円アニメーション
  outerDistanceAnim: true,       // 外周円距離アニメーション
  outerRotationAnim: true,       // 外周円回転アニメーション
  outerRadiusAnim: true,         // 外周円半径アニメーション
  outerAngleStepAnim: true,      // 外周円回転角度アニメーション
  
  // アニメーション強度
  backgroundColorIntensity: 0.5, // 背景色変化の強度
  centerRadiusIntensity: 0.3,    // 中心円の半径変化の強度
  outerDistanceIntensity: 0.3,   // 外周円の距離変化の強度
  outerRotationSpeed: 1.0,       // 外周円の回転速度
  outerRadiusIntensity: 0.3,     // 外周円の半径変化の強度
  outerAngleStepIntensity: 0.3,  // 外周円の回転角度変化の強度

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

// モバイル対応のための状態管理
let isMobileView = window.innerWidth < 768;

// メニューの状態管理
interface MenuState {
  isPresetSidebarVisible: boolean;
  isParamsMenuVisible: boolean;
}

const menuState: MenuState = {
  isPresetSidebarVisible: false,  // 初期状態で非表示
  isParamsMenuVisible: false      // 初期状態で非表示
};

// メニューを閉じる関数
function hideMenus() {
  const presetSidebar = document.getElementById('preset-sidebar');
  const presetToggle = document.getElementById('preset-toggle');
  const paramsMenu = document.getElementById('params-menu');
  const paramsToggle = document.getElementById('params-toggle');

  if (presetSidebar && presetToggle && paramsMenu && paramsToggle) {
    // プリセットサイドバーを非表示
    menuState.isPresetSidebarVisible = false;
    presetSidebar.style.transform = 'translateX(-100%)';
    presetToggle.style.transform = 'rotate(0deg)';

    // パラメーターメニューを非表示
    menuState.isParamsMenuVisible = false;
    paramsMenu.style.transform = 'translateX(100%)';
    paramsToggle.style.transform = 'rotate(0deg)';
  }
}

// メニュー制御の初期化
function initializeMenuControls() {
  const presetSidebar = document.getElementById('preset-sidebar');
  const presetToggle = document.getElementById('preset-toggle');
  const paramsMenu = document.getElementById('params-menu');
  const paramsToggle = document.getElementById('params-toggle');
  const canvasContainer = document.getElementById('canvas-container');
  const saveButton = document.getElementById('save-button');

  // パラメータメニューの位置調整
  if (paramsMenu) {
    paramsMenu.style.marginTop = '60px';  // トップメニューの高さ分を確保
  }

  if (presetSidebar && presetToggle && paramsMenu && paramsToggle) {
    // プリセットサイドバーの制御
    presetToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuState.isPresetSidebarVisible = !menuState.isPresetSidebarVisible;
      presetSidebar.style.transform = menuState.isPresetSidebarVisible ? 'translateX(0)' : 'translateX(-100%)';
      presetToggle.style.transform = menuState.isPresetSidebarVisible ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    // パラメーターメニューの制御
    paramsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuState.isParamsMenuVisible = !menuState.isParamsMenuVisible;
      paramsMenu.style.transform = menuState.isParamsMenuVisible ? 'translateX(0)' : 'translateX(100%)';
      paramsToggle.style.transform = menuState.isParamsMenuVisible ? 'rotate(-180deg)' : 'rotate(0deg)';
    });

    // メニュー自体のクリックイベントの伝播を停止
    presetSidebar.addEventListener('click', (e) => e.stopPropagation());
    paramsMenu.addEventListener('click', (e) => e.stopPropagation());

    // キャンバスコンテナのクリックでメニューを閉じる
    if (canvasContainer) {
      canvasContainer.addEventListener('click', (e) => {
        if (menuState.isPresetSidebarVisible || menuState.isParamsMenuVisible) {
          e.stopPropagation();
          hideMenus();
        }
      });
    }

    // Save ボタンの機能を実装
    if (saveButton) {
      // クリックとタッチイベントの両方に対応
      const saveHandler = (e: Event) => {
        e.preventDefault();  // デフォルトの動作を防止
        e.stopPropagation();
        saveCurrentPreset();
      };

      saveButton.addEventListener('click', saveHandler);
      saveButton.addEventListener('touchend', saveHandler);
      
      // タッチデバイスでのゴーストクリック防止
      saveButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
      });
    }

    // ドキュメント全体のクリックでメニューを閉じる
    document.addEventListener('click', () => {
      if (menuState.isPresetSidebarVisible || menuState.isParamsMenuVisible) {
        hideMenus();
      }
    });
  }

  // アニメーション設定
  const animationFolder = gui.addFolder('Animation Settings');
  animationFolder.add(params, 'animationEnabled').name('Animation ON/OFF');
  animationFolder.add(params, 'animationSpeed', 0.1, 5).name('Speed');
  animationFolder.add(params, 'backgroundColorAnim').name('Background Color');
  animationFolder.add(params, 'centerRadiusAnim').name('Center Radius');
  animationFolder.add(params, 'outerDistanceAnim').name('Outer Distance');
  animationFolder.add(params, 'outerRotationAnim').name('Outer Rotation');
  animationFolder.add(params, 'outerRadiusAnim').name('Outer Radius');
  animationFolder.add(params, 'outerAngleStepAnim').name('Outer Angle Step');

  const animIntensityFolder = animationFolder.addFolder('Animation Intensity');
  animIntensityFolder.add(params, 'backgroundColorIntensity', 0, 1).name('Background Color');
  animIntensityFolder.add(params, 'centerRadiusIntensity', 0, 1).name('Center Radius');
  animIntensityFolder.add(params, 'outerDistanceIntensity', 0, 1).name('Outer Distance');
  animIntensityFolder.add(params, 'outerRotationSpeed', 0.1, 5).name('Outer Rotation Speed');
  animIntensityFolder.add(params, 'outerRadiusIntensity', 0, 1).name('Outer Radius');
  animIntensityFolder.add(params, 'outerAngleStepIntensity', 0, 1).name('Outer Angle Step');
}

// GUIの設定を更新
const gui = new GUI({
  container: document.getElementById('params-menu') || undefined,
  title: 'Pattern Settings',
  closeFolders: true
});

// GUIコンテナのスタイル調整
const guiContainer = document.querySelector('.lil-gui.root') as HTMLElement;
if (guiContainer) {
  guiContainer.style.marginTop = '80px';  // 上部の余白を増やす
  guiContainer.style.height = 'calc(100% - 80px)';  // 高さを調整
  guiContainer.style.overflow = 'auto';  // スクロール可能に
}

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

let p5Instance: any = null;

// パターンのスケールを計算する関数
function updatePatternScale() {
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  const baseScale = minDimension / 1000;  // 基準サイズ1000pxに対する比率
  
  // 各パラメータをスケーリング
  params.centerRadius = DEFAULT_PARAMS.centerRadius * baseScale;
  params.outerCircleDistance = DEFAULT_PARAMS.outerCircleDistance * baseScale;
  params.outerCircleRadius = DEFAULT_PARAMS.outerCircleRadius * baseScale;
  params.outerLeafDistance = DEFAULT_PARAMS.outerLeafDistance * baseScale;
  params.outerLeafRadius = DEFAULT_PARAMS.outerLeafRadius * baseScale;
  
  // GUIの更新
  gui.controllers.forEach((controller: any) => {
    if (controller.property === 'centerRadius' ||
        controller.property === 'outerCircleDistance' ||
        controller.property === 'outerCircleRadius' ||
        controller.property === 'outerLeafDistance' ||
        controller.property === 'outerLeafRadius') {
      controller.updateDisplay();
    }
  });
}

const sketch = (p: any) => {
  let startTime: number;
  let baseBackgroundColor: any;
  let drawBuffer: any; // p5.Graphics | undefined;
  let maskBuffer: any; // p5.Graphics | undefined;

  p.setup = () => {
    startTime = p.millis();
    baseBackgroundColor = p.color(params.backgroundColor);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    p.createCanvas(canvasWidth, canvasHeight);
    p.angleMode(p.DEGREES);
    updatePatternScale();

    // グラフィックバッファの初期化
    drawBuffer = p.createGraphics(p.width, p.height);
    maskBuffer = p.createGraphics(p.width, p.height);
  };

  // アニメーションの更新を行う関数
  function updateAnimations() {
    if (!params.animationEnabled) return;

    const currentTime = p.millis();
    const elapsed = (currentTime - startTime) / 1000; // 秒単位の経過時間
    const animSpeed = params.animationSpeed;

    // 背景色のアニメーション
    if (params.backgroundColorAnim) {
      const hueShift = p.sin(elapsed * 30 * animSpeed) * 180 * params.backgroundColorIntensity;
      const baseHue = p.hue(baseBackgroundColor);
      const baseSaturation = p.saturation(baseBackgroundColor);
      const baseLightness = p.lightness(baseBackgroundColor);
      p.colorMode(p.HSL);
      params.backgroundColor = p.color((baseHue + hueShift) % 360, baseSaturation, baseLightness).toString('#rrggbb');
      p.colorMode(p.RGB);
    }

    // 中心円の半径アニメーション
    if (params.centerRadiusAnim) {
      const baseRadius = DEFAULT_PARAMS.centerRadius;
      const radiusChange = p.sin(elapsed * 45 * animSpeed) * baseRadius * params.centerRadiusIntensity;
      params.centerRadius = baseRadius + radiusChange;
    }

    // 外周円の距離アニメーション
    if (params.outerDistanceAnim) {
      const baseDistance = DEFAULT_PARAMS.outerCircleDistance;
      const distanceChange = p.sin(elapsed * 60 * animSpeed) * baseDistance * params.outerDistanceIntensity;
      params.outerCircleDistance = baseDistance + distanceChange;
    }

    // 外周円の回転アニメーション
    if (params.outerRotationAnim) {
      // 連続的な回転（Sin関数ではなく線形に回転）
      params.outerCircleRotation = (elapsed * 30 * animSpeed * params.outerRotationSpeed) % 360;
      
      // Leafモードの場合は全体の回転も更新
      if (currentMode === 'leaf') {
        params.outerLeafGlobalRotation = params.outerCircleRotation;
      }
    }

    // 外周円の半径アニメーション
    if (params.outerRadiusAnim) {
      const baseRadius = DEFAULT_PARAMS.outerCircleRadius;
      const radiusChange = p.sin(elapsed * 45 * animSpeed) * baseRadius * params.outerRadiusIntensity;
      params.outerCircleRadius = baseRadius + radiusChange;
    }

    // 外周円の回転角度アニメーション
    if (params.outerAngleStepAnim) {
      const baseAngleStep = DEFAULT_PARAMS.outerCircleAngleStep;
      const angleStepChange = p.sin(elapsed * 45 * animSpeed) * baseAngleStep * params.outerAngleStepIntensity;
      params.outerCircleAngleStep = baseAngleStep + angleStepChange;
    }

    // GUIの更新
    gui.controllers.forEach((controller: any) => {
      if (controller.property === 'backgroundColor' ||
          controller.property === 'centerRadius' ||
          controller.property === 'outerCircleDistance' ||
          controller.property === 'outerCircleRotation' ||
          controller.property === 'outerLeafGlobalRotation' ||
          controller.property === 'outerCircleRadius' ||
          controller.property === 'outerCircleAngleStep') {
        controller.updateDisplay();
      }
    });
  }

  p.draw = () => {
    // アニメーションの更新
    updateAnimations();

    const bgColor = p.color(params.backgroundColor);
    // p.background(bgColor); // メインキャンバスの背景描画はバッファ描画後に移動
    // p.translate(p.width / 2, p.height / 2); // メインキャンバスのtranslateも同様

    if (params.clipOutsideCenter) {
      // マスク用バッファの準備
      maskBuffer.clear(); // バッファをクリア
      maskBuffer.background(0); // 透明部分を黒に
      maskBuffer.translate(maskBuffer.width / 2, maskBuffer.height / 2);
      maskBuffer.fill(255); // マスク部分を白に
      maskBuffer.noStroke();
      maskBuffer.circle(0, 0, params.centerRadius * 2);
      maskBuffer.resetMatrix(); // translateをリセット

      // 描画用バッファの準備
      drawBuffer.clear(); // バッファをクリア
      drawBuffer.background(bgColor);
      drawBuffer.translate(drawBuffer.width / 2, drawBuffer.height / 2);
      drawBuffer.angleMode(p.DEGREES);
      // drawBuffer.background(bgColor); // クリア後に背景描画済み

      // 図形を描画
      if (currentMode === 'circle') {
        drawCirclesTo(drawBuffer);
      } else {
        drawLeavesTo(drawBuffer);
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
      drawBuffer.resetMatrix(); // translateをリセット

      // メインキャンバスへの描画
      p.background(bgColor); // ここでメインキャンバスの背景を描画
      p.image(drawBuffer, 0, 0); // バッファを左上に描画 (translateはバッファ内で行う)

    } else {
      // 通常の描画
      p.background(bgColor);
      p.translate(p.width / 2, p.height / 2);

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

  p.windowResized = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    p.resizeCanvas(canvasWidth, canvasHeight);
    updatePatternScale();

    // グラフィックバッファもリサイズ
    drawBuffer = p.createGraphics(p.width, p.height);
    maskBuffer = p.createGraphics(p.width, p.height);
  };
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  initializeMenuControls();
  p5Instance = new p5(sketch);  // インスタンスを保持
  initializeDownloadButtons();  // ダウンロードボタンの初期化
  initializeAnimationButton();  // アニメーションボタンの初期化
});

// アニメーションボタンの初期化
function initializeAnimationButton() {
  const animationButton = document.getElementById('animation-button');
  if (animationButton) {
    // 初期状態を反映
    if (params.animationEnabled) {
      animationButton.classList.add('active');
    }

    // クリックイベントの処理
    animationButton.addEventListener('click', () => {
      params.animationEnabled = !params.animationEnabled;
      if (params.animationEnabled) {
        animationButton.classList.add('active');
      } else {
        animationButton.classList.remove('active');
      }
    });
  }
}

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

// プリセットを保存する関数（パラメータ指定版）
function savePreset(presetParams: typeof params, modeName: Mode, name: string) {
  const preset: Preset = {
    id: String(presetCounter++),
    name,
    params: { ...presetParams },
    mode: modeName
  };
  presets.push(preset);
  updatePresetList();
}

// 現在の設定をプリセットとして保存する関数
function saveCurrentPreset() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const presetName = `${timestamp}`;
  
  const preset: Preset = {
    id: String(presetCounter++),
    name: presetName,
    params: { ...params },
    mode: currentMode
  };
  
  presets.push(preset);
  updatePresetList();
}

// 美しいパターンのプリセット
function saveGeometricPresets() {
  // Preset 1: Fibonacci Spiral（フィボナッチスパイラル）
  savePreset({
    ...DEFAULT_PARAMS,
    backgroundColor: '#1a1a2e',
    centerRadius: 89,
    centerStrokeColor: '#e2e2e2',
    centerStrokeWeight: 1,
    outerMode: 'circle',
    outerCircleDistance: 144,
    outerCircleAngleStep: 13.5,
    outerCircleRotation: 21.6,
    outerCircleRadius: 55,
    outerCircleStrokeColor: '#e2e2e2',
    outerCircleStrokeWeight: 1
  }, 'circle', 'Fibonacci Spiral');

  // Preset 2: Lotus Petals（蓮の花びら）
  savePreset({
    ...DEFAULT_PARAMS,
    backgroundColor: '#2d142c',
    centerRadius: 80,
    centerStrokeColor: '#f2d0e0',
    centerStrokeWeight: 1,
    outerMode: 'leaf',
    outerLeafDistance: 120,
    outerLeafAngleStep: 30,
    outerLeafRotation: -60,
    outerLeafGlobalRotation: 0,
    outerLeafStrokeColor: '#f2d0e0',
    outerLeafRadius: 160,
    outerLeafWidth: 0.4,
    outerLeafAngle: 45
  }, 'leaf', 'Lotus Petals');

  // Preset 3: Sacred Geometry（神聖幾何学）
  savePreset({
    ...DEFAULT_PARAMS,
    backgroundColor: '#0f2027',
    centerRadius: 100,
    centerStrokeColor: '#64ffda',
    centerStrokeWeight: 1,
    outerMode: 'circle',
    outerCircleDistance: 160,
    outerCircleAngleStep: 60,
    outerCircleRotation: 30,
    outerCircleRadius: 100,
    outerCircleStrokeColor: '#64ffda',
    outerCircleStrokeWeight: 1
  }, 'circle', 'Sacred Geometry');

  // Preset 4: Wind Dance（風の舞）
  savePreset({
    ...DEFAULT_PARAMS,
    backgroundColor: '#2c3e50',
    centerRadius: 60,
    centerStrokeColor: '#ecf0f1',
    centerStrokeWeight: 1,
    outerMode: 'leaf',
    outerLeafDistance: 140,
    outerLeafAngleStep: 15,
    outerLeafRotation: -45,
    outerLeafGlobalRotation: 10,
    outerLeafStrokeColor: '#ecf0f1',
    outerLeafRadius: 120,
    outerLeafWidth: 0.3,
    outerLeafAngle: 60
  }, 'leaf', 'Wind Dance');

  // Preset 5: Cosmic Rings（宇宙の輪）
  savePreset({
    ...DEFAULT_PARAMS,
    backgroundColor: '#090909',
    centerRadius: 120,
    centerStrokeColor: '#e6b3cc',
    centerStrokeWeight: 1,
    outerMode: 'circle',
    outerCircleDistance: 180,
    outerCircleAngleStep: 20,
    outerCircleRotation: 9,
    outerCircleRadius: 90,
    outerCircleStrokeColor: '#e6b3cc',
    outerCircleStrokeWeight: 1
  }, 'circle', 'Cosmic Rings');

  // Preset: SATIA
  savePreset({
    ...DEFAULT_PARAMS,
    animationEnabled: false, // アニメーションをOFFに設定
    // 共通パラメータ
    backgroundColor: '#988e79',
    showCenterCircle: true,
    clipOutsideCenter: true,

    // 中心円のパラメータ
    centerRadius: 145.25,
    centerStrokeColor: '#f2e7ce',
    centerStrokeWeight: 3,

    // 外周設定
    outerMode: 'circle',

    // 外周円のパラメータ（Circleモード）
    outerCircleDistance: 92,
    outerCircleAngleStep: 45,
    outerCircleRotation: 0,
    outerCircleStrokeColor: '#f2e7ce',
    outerCircleRadius: 100,
    outerCircleStrokeWeight: 3

    // アニメーションと葉のパラメータはDEFAULT_PARAMSから継承されます
    // (animationEnabled, animationSpeed, etc. will use values from DEFAULT_PARAMS)
    // (outerLeafDistance, outerLeafAngleStep, etc. will use values from DEFAULT_PARAMS)
  }, 'circle', 'SATIA');
}

// プリセットを保存
saveGeometricPresets();

// ウィンドウサイズ変更時の処理を更新
window.addEventListener('resize', () => {
  const newIsMobileView = window.innerWidth < 768;
  
  // モバイルビューの状態が変更された場合
  if (newIsMobileView !== isMobileView) {
    isMobileView = newIsMobileView;
  }

  // キャンバスのリサイズ
  if (p5Instance) {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    p5Instance.resizeCanvas(canvasWidth, canvasHeight);
    updatePatternScale();  // パターンスケールの更新
  }
});

// ダウンロード機能の実装
function initializeDownloadButtons() {
  const pngButton = document.getElementById('download-button');
  const svgButton = document.getElementById('download-svg-button');

  if (pngButton && svgButton) {
    // PNG保存の実装
    pngButton.addEventListener('click', () => {
      if (p5Instance) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        p5Instance.saveCanvas(`geometric-pattern-${timestamp}`, 'png');
      }
    });

    // SVG保存の実装
    svgButton.addEventListener('click', () => {
      if (p5Instance) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const svg = generateSVG();
        downloadSVG(`geometric-pattern-${timestamp}.svg`, svg);
      }
    });
  }
}

// SVGを生成する関数
function generateSVG(): string {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height / 2;

  let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${params.backgroundColor}"/>`;

  // 中心円の描画
  if (params.showCenterCircle) {
    svgContent += `
  <circle cx="${centerX}" cy="${centerY}" r="${params.centerRadius}"
    fill="none" stroke="${params.centerStrokeColor}" stroke-width="${params.centerStrokeWeight}"/>`;
  }

  // 外周の描画
  if (currentMode === 'circle') {
    // 円モードの描画
    for (let angle = 0; angle < 360; angle += params.outerCircleAngleStep) {
      const rotatedAngle = angle + params.outerCircleRotation;
      const x = centerX + params.outerCircleDistance * Math.cos(rotatedAngle * Math.PI / 180);
      const y = centerY + params.outerCircleDistance * Math.sin(rotatedAngle * Math.PI / 180);
      
      svgContent += `
  <circle cx="${x}" cy="${y}" r="${params.outerCircleRadius}"
    fill="none" stroke="${params.outerCircleStrokeColor}" stroke-width="${params.outerCircleStrokeWeight}"/>`;
    }
  } else {
    // 葉モードの描画
    for (let angle = 0; angle < 360; angle += params.outerLeafAngleStep) {
      const rotatedAngle = angle + params.outerLeafGlobalRotation;
      const x = centerX + params.outerLeafDistance * Math.cos(rotatedAngle * Math.PI / 180);
      const y = centerY + params.outerLeafDistance * Math.sin(rotatedAngle * Math.PI / 180);
      
      // 葉の形状を描画
      const leafPoints = generateLeafPoints(x, y, rotatedAngle + params.outerLeafRotation);
      svgContent += `
  <path d="${leafPoints}" fill="none" stroke="${params.outerLeafStrokeColor}" stroke-width="${params.outerLeafStrokeWeight}"/>`;
    }
  }

  svgContent += '\n</svg>';
  return svgContent;
}

// 葉のパスを生成する関数
function generateLeafPoints(centerX: number, centerY: number, rotation: number): string {
  const points: [number, number][] = [];
  const leafLength = params.outerLeafRadius;
  const leafAngle = params.outerLeafAngle;

  for (let t = -leafAngle; t <= leafAngle; t++) {
    const r = leafLength * Math.cos(t * (90 / leafAngle) * Math.PI / 180);
    const x = r * Math.cos(t * Math.PI / 180);
    const y = r * Math.sin(t * Math.PI / 180) * params.outerLeafWidth;
    
    // 回転を適用
    const rotRad = rotation * Math.PI / 180;
    const rotatedX = x * Math.cos(rotRad) - y * Math.sin(rotRad);
    const rotatedY = x * Math.sin(rotRad) + y * Math.cos(rotRad);
    
    points.push([centerX + rotatedX, centerY + rotatedY]);
  }

  return `M ${points[0][0]} ${points[0][1]} ` + 
         points.map(p => `L ${p[0]} ${p[1]}`).join(' ');
}

// SVGファイルをダウンロードする関数
function downloadSVG(filename: string, content: string) {
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
