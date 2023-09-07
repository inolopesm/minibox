export class ClassNames {
  constructor() {
    this.classNames = [];
  }

  add(className) {
    this.classNames.push(className);
    return this;
  }

  addIf(conditional, className) {
    if (conditional) {
      this.classNames.push(className);
    }

    return this;
  }

  toString() {
    return this.classNames.join(" ");
  }
}
