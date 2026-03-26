export function isNearBottom(el: HTMLElement) {
  const threshold = 120
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold
}

