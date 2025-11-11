import { IAnimator } from './interfaces.js';

export class SimpleAnimator extends IAnimator {
  async sequence(steps=[]){
    for(const step of steps){
      const p = step?.();
      if (p && typeof p.then === 'function') await p;
    }
  }
  delay(ms){ return new Promise(res => setTimeout(res, ms)); }
}
