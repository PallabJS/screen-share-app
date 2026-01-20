import { eventChannel, EventChannel } from "redux-saga";
import { call, put, race, take, takeLatest } from "redux-saga/effects";

import { screenShareService } from "@/services/screenShare";
import { SCREEN_SHARE_SAGA_ACTION, screenShareSagaAction } from "./action";
import { screenShareAction } from ".";

enum ScreenShareEvents {
  ENDED = "ENDED",
}

function createScreenShareChannel(
  stream: MediaStream,
): EventChannel<ScreenShareEvents> {
  return eventChannel((emit) => {
    const onEnded = () => emit(ScreenShareEvents.ENDED);

    stream.getVideoTracks().forEach((track) => {
      track.addEventListener("ended", onEnded);
    });

    return () => {
      stream.getVideoTracks().forEach((track) => {
        track.removeEventListener("ended", onEnded);
      });
    };
  });
}

/* ---------------------------------- */
/* Worker saga */
/* ---------------------------------- */

function* startScreenShare() {
  try {
    // 1️⃣ Acquire screen stream
    const stream: MediaStream = yield call(screenShareService.getDisplayMedia);

    // 2️⃣ Create channel (browser stop listener)
    const channel: EventChannel<ScreenShareEvents> = yield call(
      createScreenShareChannel,
      stream,
    );

    // 3️⃣ Save stream in Redux
    yield put(screenShareAction.startShareSuccess(stream));

    yield race({
      browserEnded: take(channel),
      userStopped: take(SCREEN_SHARE_SAGA_ACTION.stopShare),
    });

    // 5️⃣ Cleanup
    channel.close();
    yield put(screenShareAction.stopShare());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Permission denied";
    yield put(screenShareAction.startShareFailure(message));
  }
}

/* ---------------------------------- */
/* Watcher */
/* ---------------------------------- */

export function* watchScreenShare() {
  yield takeLatest(SCREEN_SHARE_SAGA_ACTION.startShare, startScreenShare);
}
