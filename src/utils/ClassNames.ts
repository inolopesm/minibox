export class ClassNames {
  private readonly classNames: string[];

  constructor() {
    this.classNames = [];
  }

  add(className: string) {
    this.classNames.push(className);
    return this;
  }

  addIf(conditional: unknown, className: string) {
    if (conditional) this.classNames.push(className);
    return this;
  }

  toString() {
    return this.classNames.join(" ");
  }
}
