import { call, put, takeLatest } from "redux-saga/effects";
import { screenShareAction } from ".";

function getDisplayMedia() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen sharing not supported");
  }

  return navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: { ideal: 60, max: 60 } },
    audio: false,
  });
}

function* startScreenShare() {
  try {
    const stream: MediaStream = yield call(getDisplayMedia);

    // Browser / OS stop handling
    stream.getVideoTracks().forEach((track) => {
      track.onended = () => {
        window.dispatchEvent(new CustomEvent("SCREEN_SHARE_ENDED"));
      };
    });

    yield put(screenShareAction.startShareSuccess(stream));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Permission denied";
    yield put(screenShareAction.startShareFailure(message));
  }
}

export function* watchScreenShare() {
  yield takeLatest(screenShareAction.startShareRequest.type, startScreenShare);
}
