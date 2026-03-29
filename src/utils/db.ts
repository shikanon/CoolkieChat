import Dexie, { type Table } from 'dexie';
import type { UiMessage } from './imTypes';

export class MyDatabase extends Dexie {
  messages!: Table<UiMessage, string>; // clientMsgId is the primary key

  constructor() {
    super('CoolkieChatDB');
    this.version(1).stores({
      messages: 'clientMsgId, channelId, createdAtServer'
    });
  }
}

export const db = new MyDatabase();
