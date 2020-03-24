import { v4 as uuidv4 } from 'uuid';

export class LocalStorageUtil {
  private static readonly MY_ID_KEY: string = "chat-app-myId";
  private static readonly CURRENT_ROOM_ID_KEY: string = "chat-app-current-room-id";

  constructor() {
  }

  public static getMyId(): string {
    const myId = localStorage.getItem(this.MY_ID_KEY);
    if (!myId) {
      const newId = uuidv4();
      localStorage.setItem(this.MY_ID_KEY, newId);
      return newId;
    }
    return myId;
  }

  public static getCurrentRoomId(): string {
    const roomId = localStorage.getItem(this.CURRENT_ROOM_ID_KEY);
    return roomId || 'help';
  }

  public static setCurrentRoomId(currentRoomId: string): void {
    localStorage.setItem(this.CURRENT_ROOM_ID_KEY, currentRoomId);
  }
}