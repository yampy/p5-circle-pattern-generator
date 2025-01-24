import { Preset, Mode } from '../../core/types';
import { params, currentMode, presets, gui, outerLeafFolder, outerCircleFolder, incrementPresetCounter, setCurrentMode, updatePresets } from '../../core/state';
import { DEFAULT_PARAMS } from '../../core/constants';

export function saveCurrentPreset() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const presetName = `${timestamp}`;
  
  const preset: Preset = {
    id: String(incrementPresetCounter()),
    name: presetName,
    params: { ...params },
    mode: currentMode
  };
  
  const newPresets = [...presets, preset];
  updatePresets(newPresets);
  updatePresetList();
}

export function savePreset(presetParams: typeof params, modeName: Mode, name: string) {
  const preset: Preset = {
    id: String(incrementPresetCounter()),
    name,
    params: { ...presetParams },
    mode: modeName
  };
  const newPresets = [...presets, preset];
  updatePresets(newPresets);
  updatePresetList();
}

export function loadPreset(preset: Preset) {
  // パラメーターの復元
  Object.assign(params, preset.params);
  
  // モードの復元
  setCurrentMode(preset.mode);
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

  // GUIを更新
  gui.controllers.forEach((controller: any) => controller.updateDisplay());
}

export function deletePreset(id: string) {
  const newPresets = presets.filter(p => p.id !== id);
  updatePresets(newPresets);
  updatePresetList();
}

export function updatePresetList() {
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

// 美しいパターンのプリセット
export function saveGeometricPresets() {
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
} 