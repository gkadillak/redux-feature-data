import { schema } from "normalizr";
import * as featureSliceImports from "./featureSlice";
import { makeGetDenormalizedData } from "./featureSelectors";

describe("featureSelectors", () => {
  beforeAll(() => {
    const users = new schema.Entity("users");
    const animals = new schema.Entity("animals");
    // @ts-expect-error
    featureSliceImports.SCHEMA_MAP = { users, animals };
  });
  describe("makeGetDenormalizedData", () => {
    it("should return the denormalized data", () => {
      const featureSlices = {
        entities: {
          users: { 1: { id: 1, name: "Garrett" }, 2: { id: 2, name: "Laura" } },
          animals: { 1: { id: 1, name: "dog" }, 2: { id: 2, name: "cat" } },
        },
        users: {
          data: { users: [1, 2] },
          status: "blah",
        },
        animals: {
          data: { animals: [1, 2] },
          status: "foo",
        },
      };
      const getDenormalizedData = makeGetDenormalizedData({
        name: "users",
        entity: "users",
      });
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
