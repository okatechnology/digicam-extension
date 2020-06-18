export const debounce = (cb: ([...arg]: any) => void, timeout: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(cb, timeout);
  };
};
