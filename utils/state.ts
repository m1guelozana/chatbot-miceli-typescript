let isRestarting = false;

export function getIsRestarting(): boolean {
  return isRestarting;
}

export function setIsRestarting(value: boolean): void {
  isRestarting = value;
}
