import { Params } from './types';

export const DEFAULT_PARAMS: Params = {
  // 共通パラメータ
  backgroundColor: '#948d86',
  showCenterCircle: true,
  clipOutsideCenter: false,

  // 中心円のパラメータ
  centerRadius: 150,
  centerStrokeColor: '#ffffff',
  centerStrokeWeight: 2,

  // 外周設定
  outerMode: 'circle',
  
  // 外周円のパラメータ（Circleモード）
  outerCircleDistance: 150,
  outerCircleAngleStep: 30,
  outerCircleRotation: 0,
  outerCircleStrokeColor: '#ffffff',
  outerCircleRadius: 150,
  outerCircleStrokeWeight: 2,

  // 外周葉のパラメータ（Leafモード）
  outerLeafDistance: 150,
  outerLeafAngleStep: 30,
  outerLeafRotation: -90,
  outerLeafGlobalRotation: 0,
  outerLeafStrokeColor: '#ffffff',
  outerLeafRadius: 150,
  outerLeafStrokeWeight: 2,
  outerLeafWidth: 0.8,
  outerLeafAngle: 60
};

export const MOBILE_BREAKPOINT = 768; 