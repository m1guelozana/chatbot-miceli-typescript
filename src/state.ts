type UserState = {
  lastMessageId: string | null;
  state: string;
};

class StateManager {
  private userStates: { [key: string]: UserState };

  constructor() {
      this.userStates = {};
  }

  getLastMessageId(chatId: string): string | null {
      return this.userStates[chatId]?.lastMessageId || null;
  }

  setLastMessageId(chatId: string, messageId: string): void {
      if (!this.userStates[chatId]) {
          this.userStates[chatId] = { lastMessageId: null, state: 'initial' };
      }
      this.userStates[chatId].lastMessageId = messageId;
  }

  getUserState(chatId: string): string {
      return this.userStates[chatId]?.state || 'initial';
  }

  setUserState(chatId: string, state: string): void {
      if (!this.userStates[chatId]) {
          this.userStates[chatId] = { lastMessageId: null, state: 'initial' };
      }
      this.userStates[chatId].state = state;
  }
}

const stateManager = new StateManager();

export default stateManager;
