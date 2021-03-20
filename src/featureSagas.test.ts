import { expectSaga } from "redux-saga-test-plan";
import { schema } from "normalizr";
import { genericSagaHandler } from "./featureSagas";
import * as featureSliceImports from "./featureSlice";
import { actions } from "./featureSlice";

const { onUpdateMetaData } = actions;

describe("featureSagas", () => {
  beforeAll(() => {
    const users = new schema.Entity("users");
    // @ts-expect-error
    featureSliceImports.SCHEMA_MAP = { users };
  });

  describe("genericSagaHandler", () => {
    it("should normalize data on success", () => {
      const successAction = {
        type: "success",
        payload: {
          name: "fetch",
          callback: async () => ({
            data: {
              users: [
                { id: 1, name: "Garrett" },
                { id: 2, name: "Laura" },
              ],
            },
          }),
          entity: "users",
        },
      };
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = () => {};
      const action = { action: successAction, onSuccessAction, onErrorAction };
      // @ts-expect-error
      return expectSaga(genericSagaHandler, action)
        .put({
          type: "success",
          payload: {
            name: "fetch",
            data: { users: [1, 2] },
            entities: {
              users: {
                1: { id: 1, name: "Garrett" },
                2: { id: 2, name: "Laura" },
              },
            },
          },
        })
        .run();
    });
    it("should format data when supplied parameter", () => {
      const successAction = {
        type: "success",
        payload: {
          name: "fetch",
          callback: async () => ({
            data: {
              users: [{ name: "Garrett" }, { name: "Laura" }],
            },
          }),
          format(data: any) {
            const formattedUsers = data.users.map(
              (item: any, index: number) => ({
                id: index + 1,
                ...item,
              })
            );
            return { users: formattedUsers };
          },
          entity: "users",
        },
      };
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = () => {};
      const action = { action: successAction, onSuccessAction, onErrorAction };
      // @ts-expect-error
      return expectSaga(genericSagaHandler, action)
        .put({
          type: "success",
          payload: {
            name: "fetch",
            data: { users: [1, 2] },
            entities: {
              users: {
                1: { id: 1, name: "Garrett" },
                2: { id: 2, name: "Laura" },
              },
            },
          },
        })
        .run();
    });
    it("should update meta data when callback given", () => {
      const metaData = {
        page: 1,
        totalPages: 159,
      };
      const successAction = {
        type: "success",
        payload: {
          name: "fetch",
          callback: async () => ({
            data: {
              users: [{ name: "Garrett" }, { name: "Laura" }],
              meta: metaData,
            },
          }),
          meta(data: any) {
            return data.meta;
          },
          entity: "users",
        },
      };
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = () => {};
      const action = { action: successAction, onSuccessAction, onErrorAction };
      // @ts-expect-error
      return expectSaga(genericSagaHandler, action)
        .put(onUpdateMetaData({ name: "fetch", metaData }))
        .run();
    });
  });
});
