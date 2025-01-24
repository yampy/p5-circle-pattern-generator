import { params, currentMode } from '../core/state';

export function generateSVG(): string {
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

export function downloadSVG(filename: string, content: string) {
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