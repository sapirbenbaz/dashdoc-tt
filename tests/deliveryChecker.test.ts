import {
  DeliveryChecker,
  ErrorOutput,
  SuccessOutput,
} from "../deliveryChecker";

describe("DeliveryChecker", () => {
  describe("validatePath", () => {
    test("should return success and the steps for a valid path", () => {
      const expectedOutput: SuccessOutput = {
        status: "success",
        steps: [
          { address: 1, action: "pickup" },
          { address: 2, action: "dropoff" },
          { address: 3, action: "pickup" },
          { address: 4, action: null },
          { address: 5, action: "dropoff" },
        ],
      };

      const deliveries: [number, number][] = [
        [1, 2],
        [3, 5],
      ];
      const path: number[] = [1, 2, 3, 4, 5];
      const deliveryChecker = new DeliveryChecker(path, deliveries);
      const result = deliveryChecker.validatePath();

      expect(result).toEqual(expectedOutput);
    });

    test("should return success and null actions for a valid path but no deliveries", () => {
      const expectedOutput: SuccessOutput = {
        status: "success",
        steps: [
          { address: 1, action: null },
          { address: 2, action: null },
          { address: 3, action: null },
        ],
      };

      const deliveries: [number, number][] = [];
      const path: number[] = [1, 2, 3];
      const deliveryChecker = new DeliveryChecker(path, deliveries);
      const result = deliveryChecker.validatePath();

      expect(result).toEqual(expectedOutput);
    });

    test("should return success and no steps for empty path and no deliveries", () => {
      const expectedOutput: SuccessOutput = {
        status: "success",
        steps: [],
      };

      const deliveries: [number, number][] = [];
      const path: number[] = [];
      const deliveryChecker = new DeliveryChecker(path, deliveries);
      const result = deliveryChecker.validatePath();

      expect(result).toEqual(expectedOutput);
    });

    test("should return error and the error message for invalid path", () => {
      const expectedOutput: ErrorOutput = {
        status: "error",
        error_code: "delivery_dropoff_before_pickup",
        error_message: "Tried dropping off at address 3 before picking up at 2",
      };

      const deliveries: [number, number][] = [
        [1, 4],
        [2, 3],
      ];
      const path: number[] = [1, 3, 2, 4];
      const deliveryChecker = new DeliveryChecker(path, deliveries);
      const result = deliveryChecker.validatePath();

      expect(result).toEqual(expectedOutput);
    });

    test("should return error and  error message for missing addresses in path", () => {
      const expectedOutput: ErrorOutput = {
        status: "error",
        error_code: "delivery_address_not_in_path",
        error_message: "Delivery addresses not in path: [1, 6, 2, 7]",
      };

      const deliveries: [number, number][] = [
        [1, 2],
        [6, 7],
      ];
      const path: number[] = [3, 4, 5];
      const deliveryChecker = new DeliveryChecker(path, deliveries);
      const result = deliveryChecker.validatePath();
      expect(result).toEqual(expectedOutput);
    });
  });
});
