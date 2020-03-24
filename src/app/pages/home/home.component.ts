import { Component, OnInit } from '@angular/core';
import { Room } from '../../types/Room';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { LocalStorageUtil } from 'src/app/utils/LocalStorageUtil';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public rooms: Room[] = [];

  public searchInput: string = "";

  public isOpenCreateModal: boolean = false;

  public isOpenPasswordModal: boolean = false;

  public currentRoom: Room = null;

  constructor(private afs: AngularFirestore, private route: Router) {
    afs.collection<Room>('rooms', ref => this.getQueryFn(ref)).valueChanges()
      .subscribe(rooms => this.rooms = rooms.map(room => Object.assign(new Room(), room)));
  }

  ngOnInit(): void {}

  private getQueryFn(ref: CollectionReference, isSetStartAfter: boolean = false): Query {
    let query: CollectionReference | Query = ref;
    
    if (this.searchInput) {
      this.searchInput.split(",")
        .map(input => input.trim())
        .filter(input => input !== "")
        .forEach(input => query = query.where('tags', 'array-contains', input))
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
    this.afs.collection<Room>(Room.COLLECTION_NAME, ref => this.getQueryFn(ref)).valueChanges()
        .subscribe(rooms => this.rooms = rooms.map(room => Object.assign(new Room(), room)));
  }

  public toggleFav(room: Room) {
    const doc = this.afs.collection<Room>(Room.COLLECTION_NAME).doc(room.id);
    const myId = LocalStorageUtil.getMyId();
    if (room.isFav) {
      doc.update({
        favs: firestore.FieldValue.arrayRemove(myId)
      });
    } else {
      doc.update({
        favs: firestore.FieldValue.arrayUnion(myId)
      });
    }
  }

  public searchMore() {
    this.afs.collection<Room>(Room.COLLECTION_NAME,  ref => this.getQueryFn(ref, true)).valueChanges()
      .subscribe(rooms => this.rooms.push(...rooms.map(room => Object.assign(new Room(), room))));
  }

  public entryRoom(room: Room) {
    if (room.private) {
      this.isOpenPasswordModal = true;
      this.currentRoom = room;
    } else {
      this.route.navigate(['rooms', room.id, 'chat']);
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
    this.isOpenCreateModal = true;
  }

  public closeModal(): void {
    this.isOpenCreateModal = false;
  }

  public closePasswordModal(): void {
    this.isOpenPasswordModal = false;
    this.currentRoom = null;
  }
}
