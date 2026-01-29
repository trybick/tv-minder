export const getIsMac = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const isMac = /Mac|iPhone|iPad|iPod/i.test(
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? navigator.userAgent
  );
  return isMac;
};
