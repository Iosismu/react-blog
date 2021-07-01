import { all } from "redux-saga/effects";
import { authSaga } from "./auth";
import { booksSaga } from "./books";

// authSaga, booksSaga안에 우리가 필요한 함수를 정의하면
// Store에서 사용가능하다

export default function* rootSaga() {
  yield all([authSaga(), booksSaga()]);
}
