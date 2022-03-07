export const datePickerFocus = (className: any) => {
  setTimeout(() => {
    const dom = document.querySelector(className)?.children[0]?.children[0]?.children[0]?.children[0]?.children[0];
    if (dom) (dom as any).select();
  }, 0);
}
