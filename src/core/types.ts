export type Mode = 'circle' | 'leaf';

export interface Params {
  // 共通パラメータ
  backgroundColor: string;
  showCenterCircle: boolean;
  clipOutsideCenter: boolean;

  // 中心円のパラメータ
  centerRadius: number;
  centerStrokeColor: string;
  centerStrokeWeight: number;

  // 外周設定
  outerMode: Mode;
  
  // 外周円のパラメータ（Circleモード）
  outerCircleDistance: number;
  outerCircleAngleStep: number;
  outerCircleRotation: number;
  outerCircleStrokeColor: string;
  outerCircleRadius: number;
  outerCircleStrokeWeight: number;

  // 外周葉のパラメータ（Leafモード）
  outerLeafDistance: number;
  outerLeafAngleStep: number;
  outerLeafRotation: number;
  outerLeafGlobalRotation: number;
  outerLeafStrokeColor: string;
  outerLeafRadius: number;
  outerLeafStrokeWeight: number;
  outerLeafWidth: number;
  outerLeafAngle: number;
}

export interface Preset {
  id: string;
  name: string;
  params: Params;
  mode: Mode;
}

export interface MenuState {
  isPresetSidebarVisible: boolean;
  isParamsMenuVisible: boolean;
} 