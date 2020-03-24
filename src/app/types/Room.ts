import { v4 as uuidv4 } from 'uuid';
import { LocalStorageUtil } from '../utils/LocalStorageUtil';

interface IRoom {
  id: string;
  name: string;
  description: string;
  tags: string[];
  private: boolean;
  password?:string;
  favs: string[];
}

export class Room implements IRoom {
  public static readonly COLLECTION_NAME: string = "rooms";

  public id: string;
  public name: string;
  public description: string;
  public tags: string[];
  public private: boolean;
  public password?:string;
  public favs: string[];

  constructor() {
    this.id = Room.genId();
    this.name = "";
    this.description = "";
    this.tags = [];
    this.private = false;
    this.password = "";
    this.favs = [];
  }

  public static of(room: Room): Room {
    return Object.assign(new Room(), room);
  }

  public static genId(): string {
    return uuidv4();
  }

  public get isFav(): boolean {
    return this.favs.includes(LocalStorageUtil.getMyId());
  }

  public verify(password: string): boolean {
    return this.private || this.password === password;
  }

  public hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  public addTag(tag: string): void {
    this.tags.push(tag);
  }

  public removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  public clone(): Room {
    return Object.assign({}, this);
  }
}
