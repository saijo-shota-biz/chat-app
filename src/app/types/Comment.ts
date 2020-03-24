import 'firebase/app';
import { firestore } from 'firebase';
import { LocalStorageUtil } from '../utils/LocalStorageUtil';

interface IComment {
  userId: string;
  content: string;
  roomId: string;
}

export class Comment implements IComment {
  public static readonly COLLECTION_NAME: string = "comments";

  public userId: string;
  public content: string;
  public roomId: string;
  public timestamp: firestore.FieldValue;

  constructor(content: string) {
    this.userId = LocalStorageUtil.getMyId();
    this.content = content;
    this.roomId = LocalStorageUtil.getCurrentRoomId();
    this.timestamp = firestore.FieldValue.serverTimestamp();
  }

  public isMyComment(): boolean {
    return this.userId === LocalStorageUtil.getMyId();
  }

  public isYourComment(): boolean {
    return !this.isMyComment();
  }

  public clone(): Comment {
    return Object.assign({}, this);
  }
}