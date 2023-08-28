import { describe, expect, it } from "@jest/globals";
import { Time } from "../../utils/Time";

describe("Time", () => {
  describe("sleep", () => {
    it("should resolve after the specified time", async () => {
      const startTime = Date.now();
      const sleepTime = 1000; // 1 second

      await Time.sleep(sleepTime);

      const endTime = Date.now();
      const elapsed = endTime - startTime;

      // Allow a small deviation due to test execution time
      const deviation = 50; // in milliseconds

      expect(elapsed).toBeGreaterThanOrEqual(sleepTime - deviation);
      expect(elapsed).toBeLessThanOrEqual(sleepTime + deviation);
    });
  });
});
