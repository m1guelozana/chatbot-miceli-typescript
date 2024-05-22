// state.ts
let isRestarting = false;
const userStates: { [key: string]: string } = {};

export function getIsRestarting(): boolean {
  return isRestarting;
}

export function setIsRestarting(value: boolean): void {
  isRestarting = value;
}

export function getUserState(chatId: string): string {
  return userStates[chatId];
}

export function setUserState(chatId: string, state: string): void {
  userStates[chatId] = state;
}

export function clearUserState(chatId: string): void {
  delete userStates[chatId];
}
