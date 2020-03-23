import { Component, OnInit } from '@angular/core';
import { Room } from '../types/Room';
import { AngularFirestore, CollectionReference, Query, AngularFirestoreDocument } from '@angular/fire/firestore';
import 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { firestore } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private static readonly MY_ID_KEY: string = "chat-app-myId";

  public rooms: Room[];

  public myId: string;

  public searchInput: string = "";

  public isOpenModal: boolean = false;

  public isOpenPasswordForm: boolean = false;

  public newRoom: Room = {
    id: "",
    name: "",
    description: "",
    private: false,
    tags: [],
    password: "",
    favs: []
  };

  public currentRoom: Room = null;

  public password: string = "";

  public tag: string = "";

  constructor(private afs: AngularFirestore, private route: Router) {
    afs.collection<Room>('rooms', ref => this.getQueryFn(ref)).valueChanges()
      .subscribe(rooms => this.rooms = rooms);

      const myId = localStorage.getItem(HomeComponent.MY_ID_KEY);
      if (myId) {
        this.myId = myId;
      } else {
        const newId = uuidv4();
        localStorage.setItem(HomeComponent.MY_ID_KEY, newId);
        this.myId = newId;
      }
  }

  ngOnInit(): void {}

  private getQueryFn(ref: CollectionReference, isSetStartAfter: boolean = false): Query {
    let query: CollectionReference | Query = ref;
    
    if (this.searchInput) {
      query = query.where('tags', 'array-contains', this.searchInput);
    }
    
    query = query.orderBy('id');
    
    if (isSetStartAfter) {
      query = query.startAfter(this.rooms[this.rooms.length - 1].id)
    }
    
    query = query.limit(20);
    
    return query;
  }

  public search(searchInput: string) {
    this.searchInput = searchInput;
    this.afs.collection<Room>('rooms', ref => this.getQueryFn(ref)).valueChanges()
        .subscribe(rooms => this.rooms = rooms);
  }

  public toggleFav(room: Room) {
    const doc = this.afs.collection<Room>('rooms').doc(room.id);
    if (room.favs.includes(this.myId)) {
      doc.update({
        favs: firestore.FieldValue.arrayRemove(this.myId)
      });
    } else {
      doc.update({
        favs: firestore.FieldValue.arrayUnion(this.myId)
      });
    }
  }

  public searchMore() {
    this.afs.collection<Room>('rooms',  ref => this.getQueryFn(ref, true)).valueChanges()
      .subscribe(rooms => this.rooms.push(...rooms));
  }

  public entryRoom(roomId: string) {
    const privateRoom = this.rooms.find(room => room.id === roomId);
    if (privateRoom.private) {
      this.isOpenPasswordForm = true;
      this.currentRoom = privateRoom;
    } else {
      this.route.navigate(['rooms', roomId, 'chat']);
    }
  }

  public share(room: Room): void {
    const nav: any = window.navigator;

    if (nav.share) {
      nav.share({
        title: `chat app ${room.name}`,
        text: room.description,
        url: `https://chat-app-47a10.web.app/rooms/${room.id}/chat`
      });
    } else {
      alert("sorry not supported.");
    }
  }

  public openModal(): void {
    this.isOpenModal = true;
  }

  public closeModal(): void {
    this.isOpenModal = false;
  }

  public addTag(): void {
    if (!this.newRoom.tags.includes(this.tag)) {
      this.newRoom.tags.push(this.tag);
    }

    this.tag = "";
  }

  public deleteTag(tag: string): void {
    this.newRoom.tags = this.newRoom.tags.filter(t => t !== tag);
  }

  public save(): boolean {
    if (this.newRoom.name === "") {
      window.alert("Name is required.\r\nPlease input Room Name.");
      return false;
    }

    if (this.newRoom.private && !this.newRoom.password) {
      window.alert("Password is required for private room.\r\nPlease input Password or change to public room.");
      return false;
    }

    this.newRoom.id = uuidv4();
    this.afs.collection<Room>('rooms').doc(this.newRoom.id).set(this.newRoom)
      .then(() => this.newRoom = {
        id: '',
        name: '',
        description: '',
        private: false,
        tags: [],
        password: '',
        favs: []
      })
      .then(() => this.isOpenModal = false);
  }

  public closePasswordForm(): void {
    this.isOpenPasswordForm = false;
    this.currentRoom = null;
    this.password = "";
  }

  public entry(password: string): void {
    if (this.currentRoom.password === password) {
      this.route.navigate(['rooms', this.currentRoom.id, 'chat']);
    } else {
      window.alert('password is wrong.');
      this.closePasswordForm();
    }
  }
}
