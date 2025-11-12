import { successResponse, errorResponse } from "../src/utils/response.js";

describe("Response Utility Tests", () => {
  describe("successResponse structure", () => {
    test("should be a function", () => {
      expect(typeof successResponse).toBe("function");
    });

    test("should be exported correctly", () => {
      expect(successResponse).toBeDefined();
    });
  });

  describe("errorResponse structure", () => {
    test("should be a function", () => {
      expect(typeof errorResponse).toBe("function");
    });

    test("should be exported correctly", () => {
      expect(errorResponse).toBeDefined();
    });
  });

  describe("response format validation", () => {
    test("successResponse should accept correct parameters", () => {
      const mockRes = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.body = data;
          return this;
        },
      };

      successResponse(mockRes, 0, "Test message", { test: "data" });

      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        status: 0,
        message: "Test message",
        data: { test: "data" },
      });
    });

    test("errorResponse should accept correct parameters", () => {
      const mockRes = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.body = data;
          return this;
        },
      };

      errorResponse(mockRes, 400, 102, "Error message");

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.body).toEqual({
        status: 102,
        message: "Error message",
        data: null,
      });
    });
  });
});
