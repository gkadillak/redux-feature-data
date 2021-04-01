import { reducer, actions, ResourceStatus } from "./featureSlice";

describe("featureSlice", () => {
  describe("reducers", () => {
    describe("onCreateEntitySuccess", () => {
      it("should merge objects and concat arrays", () => {
        const initialState = {
          app: {
            data: {
              posts: [1, 2],
            },
          },
          entities: {
            posts: {
              1: { id: 1 },
              2: { id: 2 },
            },
            authors: {
              1: { id: 1, name: "Thomas" },
              2: { id: 2, name: "Wanda" },
            },
          },
        };
        const action = {
          name: "app",
          data: { posts: [5] },
          entities: {
            posts: { 5: { id: 5 } },
            authors: { 17: { id: 17, name: "Oddball" } },
          },
        };
        const output = reducer(
          initialState,
          actions.onCreateEntitySuccess(action)
        );
        expect(output).toEqual({
          app: {
            status: ResourceStatus.HAS_CREATED_SUCCESS,
            data: {
              posts: [1, 2, 5],
            },
          },
          entities: {
            posts: {
              1: { id: 1 },
              2: { id: 2 },
              5: { id: 5 },
            },
            authors: {
              1: { id: 1, name: "Thomas" },
              2: { id: 2, name: "Wanda" },
              17: { id: 17, name: "Oddball" },
            },
          },
        });
      });
    });
  });
});
