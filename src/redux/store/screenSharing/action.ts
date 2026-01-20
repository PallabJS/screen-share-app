export const SCREEN_SHARE_SAGA_ACTION = {
  startShare: "screenShare/START_SHARE_REQUEST",
  stopShare: "screenShare/STOP_SHARE",
} as const;

const startScreenShare = () => ({
  type: SCREEN_SHARE_SAGA_ACTION.startShare,
  payload: undefined,
});

const stopScreenShare = () => ({
  type: SCREEN_SHARE_SAGA_ACTION.stopShare,
  payload: undefined,
});

export const screenShareSagaAction = {
  startScreenShare,
  stopScreenShare,
};
