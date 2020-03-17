import { Component, OnInit } from '@angular/core';
import { Room } from '../types/Room';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public rooms: Room[];

  public isOpenModal: boolean = false;

  public newRoom: Room = {
    id: "",
    name: "",
    description: "",
    private: false,
    tags: [],
    password: ""
  };

  public tag: string = "";

  constructor(private afs: AngularFirestore) {
    afs.collection<Room>('rooms', ref => ref.orderBy('id').limit(20)).valueChanges()
      .subscribe(rooms => this.rooms = rooms);
  }

  ngOnInit(): void {}

  public search(searchInput: string) {
    const queryFn = searchInput ?
      ref => ref.limit(20).orderBy('id') :
      ref => ref.where('tags', 'array-contains', searchInput).orderBy('id').limit(20);
    this.afs.collection<Room>('rooms', queryFn).valueChanges()
        .subscribe(rooms => this.rooms = rooms);
  }

  public searchMore() {
    const queryFn = ref => ref.orderBy('id')
                              .startAfter(this.rooms[this.rooms.length - 1].id)
                              .limit(20)
    this.afs.collection<Room>('rooms', queryFn).valueChanges()
      .subscribe(rooms => this.rooms.push(...rooms));
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

  public save(): void {
    this.newRoom.id = uuidv4();
    this.afs.collection<Room>('rooms').add(this.newRoom)
      .then(() => this.newRoom = {
        id: '',
        name: '',
        description: '',
        private: false,
        tags: [],
        password: ''
      })
      .then(() => this.isOpenModal = false);
  }

}
