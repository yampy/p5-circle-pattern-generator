import { params } from '../core/state';

export function drawCircles(p: any) {
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

export function drawCirclesTo(buffer: any) {
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