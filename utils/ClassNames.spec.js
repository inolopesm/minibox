import { describe, expect, it } from "@jest/globals";
import { ClassNames } from "./ClassNames";

describe("ClassNames", () => {
  describe("add", () => {
    it("should add a single className", () => {
      const classNames = new ClassNames();
      classNames.add("class1");
      expect(classNames.toString()).toBe("class1");
    });

    it("should add multiple classNames", () => {
      const classNames = new ClassNames();
      classNames.add("class1").add("class2").add("class3");
      expect(classNames.toString()).toBe("class1 class2 class3");
    });
  });

  describe("addIf", () => {
    it("should add a className if conditional is true", () => {
      const classNames = new ClassNames();
      classNames.addIf(true, "conditionalClass");
      expect(classNames.toString()).toBe("conditionalClass");
    });

    it("should not add a className if conditional is false", () => {
      const classNames = new ClassNames();
      classNames.addIf(false, "conditionalClass");
      expect(classNames.toString()).toBe("");
    });

    it("should chain addIf calls correctly", () => {
      const classNames = new ClassNames();
      classNames.add("alwaysAdded").addIf(true, "conditionallyAdded");
      expect(classNames.toString()).toBe("alwaysAdded conditionallyAdded");
    });
  });

  describe("toString", () => {
    it("should return empty string for an empty list of classNames", () => {
      const classNames = new ClassNames();
      expect(classNames.toString()).toBe("");
    });

    it("should return classNames as a space-separated string", () => {
      const classNames = new ClassNames();
      classNames.add("class1").add("class2").add("class3");
      expect(classNames.toString()).toBe("class1 class2 class3");
    });
  });
});
