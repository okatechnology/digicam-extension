/**
 *  ページから離れる時のPOPUPをOFFにする
 */
export const syncInitData = () => {
  const scriptElement = document.createElement('script');
  scriptElement.text = 'initData = collectData();';
  document.documentElement.appendChild(scriptElement);
};
