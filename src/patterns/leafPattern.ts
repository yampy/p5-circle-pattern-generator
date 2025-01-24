import { params } from '../core/state';

export function drawLeaves(p: any) {
  p.noFill();
  for (let angle = 0; angle < 360; angle += params.outerLeafAngleStep) {
    const rotatedAngle = angle + params.outerLeafGlobalRotation;
    const x = params.outerLeafDistance * p.cos(rotatedAngle);
    const y = params.outerLeafDistance * p.sin(rotatedAngle);
    
    p.stroke(params.outerLeafStrokeColor);
    p.strokeWeight(params.outerLeafStrokeWeight);
    drawLeaf(p, x, y, rotatedAngle);
  }
}

export function drawLeavesTo(buffer: any) {
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

function drawLeaf(p: any, x: number, y: number, angle: number) {
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
} 