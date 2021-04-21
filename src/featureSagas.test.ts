import { put } from "redux-saga/effects";
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
      const name = "fetch";
      const callback = async () => ({
        data: {
          users: [
            { id: 1, name: "Garrett" },
            { id: 2, name: "Laura" },
          ],
        },
      });
      const entity = "users";
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = (payload: any) => ({ type: "error", payload });
      return expectSaga(genericSagaHandler, {
        callback,
        name,
        entity,
        onSuccessAction: onSuccessAction,
        onErrorAction,
      })
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
      const name = "fetch";
      const callback = async () => ({
        data: {
          users: [{ name: "Garrett" }, { name: "Laura" }],
        },
      });
      function format(data: any) {
        const formattedUsers = data.users.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        return { users: formattedUsers };
      }
      const entity = "users";
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = (payload: any) => ({ type: "error", payload });
      return expectSaga(genericSagaHandler, {
        callback,
        name,
        format,
        entity,
        onSuccessAction,
        onErrorAction,
      })
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
      const name = "fetch";
      const callback = async () => ({
        data: {
          users: [{ name: "Garrett" }, { name: "Laura" }],
          meta: metaData,
        },
      });
      function meta(data: any) {
        return data.meta;
      }
      const entity = "users";
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = (payload: any) => ({ type: "error", payload });
      return expectSaga(genericSagaHandler, {
        callback,
        name,
        meta,
        entity,
        onSuccessAction,
        onErrorAction,
      })
        .put(onUpdateMetaData({ name: "fetch", metaData }))
        .run();
    });

    it("should allow a promise to be included in the format callback", () => {
      const name = "fetch";
      const callback = async () => ({
        data: {
          users: [{ name: "Garrett" }, { name: "Laura" }],
        },
      });
      const format = function* formatData(data: any) {
        yield put({ type: "some_random_action" });
        const formattedUsers = data.users.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        return { users: formattedUsers };
      };
      const entity = "users";
      const onSuccessAction = (payload: any) => ({ type: "success", payload });
      const onErrorAction = (payload: any) => ({ type: "error", payload });
      return expectSaga(genericSagaHandler, {
        name,
        callback,
        format,
        entity,
        onSuccessAction,
        onErrorAction,
      })
        .put({
          type: "some_random_action",
        })
        .run();
    });
  });
});
