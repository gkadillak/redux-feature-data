import { schema } from "normalizr";
import * as featureSliceImports from "./featureSlice";
import { makeGetDenormalizedData } from "./featureSelectors";

describe("featureSelectors", () => {
  beforeAll(() => {
    const users = new schema.Entity("users");
    // @ts-expect-error
    featureSliceImports.SCHEMA_MAP = { users };
  });
  describe("makeGetDenormalizedData", () => {
    it("should return the denormalized data", () => {
      const featureSlices = {
        entities: {
          users: { 1: { id: 1, name: "Garrett" }, 2: { id: 2, name: "Laura" } },
        },
        users: {
          data: { users: [1, 2] },

          status: "blah",
        },
      };
      const getDenormalizedData = makeGetDenormalizedData("users", "users");
      const output = getDenormalizedData.resultFunc(featureSlices, true);
      expect(output).toEqual({
        users: [
          { id: 1, name: "Garrett" },
          { id: 2, name: "Laura" },
        ],
      });
    });
  });
});
