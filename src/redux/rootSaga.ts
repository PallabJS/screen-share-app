import { all } from "redux-saga/effects";
import { watchScreenShare } from "./store/screenSharing/saga";

export default function* rootSaga() {
  yield all([watchScreenShare()]);
}
