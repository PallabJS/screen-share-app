function getDisplayMedia() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen sharing is not supported");
  }

  return navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: { ideal: 60, max: 60 } },
    audio: false,
  });
}

export const screenShareService = {
  getDisplayMedia,
};
