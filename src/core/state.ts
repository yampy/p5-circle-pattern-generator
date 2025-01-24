import { Mode, Params, MenuState, Preset } from './types';
import { DEFAULT_PARAMS } from './constants';

// グローバル状態
export const params: Params = { ...DEFAULT_PARAMS };
export let currentMode: Mode = 'circle';
export let canvasWidth: number;
export let canvasHeight: number;
export let isMobileView = window.innerWidth < 768;
export let p5Instance: any = null;
export let presetCounter = 1;
export let presets: Preset[] = [];

export const menuState: MenuState = {
  isPresetSidebarVisible: false,
  isParamsMenuVisible: false
};

// GUI関連の状態
export let gui: any;
export let commonFolder: any;
export let centerFolder: any;
export let outerFolder: any;
export let outerCircleFolder: any;
export let outerLeafFolder: any;

// 状態更新関数
export function incrementPresetCounter(): number {
  return presetCounter++;
}

export function setCurrentMode(mode: Mode) {
  currentMode = mode;
}

export function updatePresets(newPresets: Preset[]) {
  presets = newPresets;
} 