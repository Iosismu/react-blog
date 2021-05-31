import { call, put, select, takeEvery } from "@redux-saga/core/effects";
import { push } from "connected-react-router";
import { Action, createActions, handleActions } from "redux-actions";
import TokenService from "../../services/TokenService";
import UserService from "../../services/UserService";
import { AuthState, LoginReqType } from "../../types";

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

const prefix = "my-books/auth"; // createActions할때 경로 지정할 변수

// createActions로 만들어진 변수에는 액션 생성함수가 들어간다.
export const { pending, success, fail } = createActions(
  "PENDING",
  "SUCCESS",
  "FAIL",
  { prefix }
); // 마지막에 prefix를 넣어주면 PENDING앞에 "my-books/auth"가 달린다.

// 리듀서
const reducer = handleActions<AuthState, string>(
  {
    PENDING: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => ({
      // action의 payload로 token이 들어오기 때문에 actions 추가
      token: action.payload,
      loading: false,
      error: null,
    }),
    FAIL: (state, action: any) => ({
      // action의 payload로 token이 들어오기 때문에 actions 추가
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
  { prefix }
);

export default reducer;

// saga
// login이라는 action이 dispatch 되면 밑에 loginSaga함수가 실행, logout은 logoutSaga함수
export const { login, logout } = createActions("LOGIN", "LOGOUT", { prefix });

function* loginSaga(action: Action<LoginReqType>) {
  try {
    yield put(pending());
    const token: string = yield call(UserService.login, action.payload);
    // localstorage
    TokenService.set(token);
    yield put(success(token));
    // push 이동
    yield put(push("/"));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || "UNKNOWN_ERROR")));
  }
}
function* logoutSaga() {
  try {
    yield put(pending());
    const token: string = yield select((state) => state.auth.token);
    yield call(UserService.logout, token);
    TokenService.set(token);
  } catch (error) {
  } finally {
    TokenService.remove();
    yield put(success(null));
  }
}

export function* authSaga() {
  yield takeEvery(`${prefix}/LOGIN`, loginSaga);
  yield takeEvery(`${prefix}/LOGOUT`, logoutSaga);
}
