import { cloneDeep, merge } from 'lodash';
import { create, all } from 'mathjs';

const defaultOptions = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'BigNumber',
  precision: 14,
  predictable: false,
  randomSeed: null
}

export class MathJax {
  /** mathjs */
  math = null;

  /** opt */
  opt = { };

  decimal = 2;

  constructor(opt = {}, decimal = 2) {
    this.opt = merge(cloneDeep(defaultOptions), opt);
    this.decimal = decimal;
    this.math = create(all, this.opt);
  }

  add() {
    const args = [].slice.call(arguments);
    let currentVal = this.math.add(...args);
    currentVal = this.format(currentVal);
    return currentVal;
  }

  subtract() {
    const args = [].slice.call(arguments);
    let currentVal = args[0];
    for (let i = 1; i < args.length; i++) {
      currentVal = this.format(this.math.subtract(currentVal, args[i]));
    }
    return this.format(currentVal);
  }

  multiply() {
    const args = [].slice.call(arguments);
    const currentVal = args.reduce((total, item) => this.math.multiply(total, item));
    return this.format(currentVal);
  }

  divide() {
    const args = [].slice.call(arguments);
    const currentVal = args.reduce((total, item) => this.math.divide(total, item));
    return this.format(currentVal);
  }

  format(value) {
    if (!value) {
      return 0;
    }
    return Number(Number(this.math.format(value, this.opt)).toFixed(2));
  }
}
