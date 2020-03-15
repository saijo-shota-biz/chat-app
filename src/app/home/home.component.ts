import { Component, OnInit } from '@angular/core';
import { Room } from '../types/Room';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public rooms: Room[] = [];

  public roomCount: number;

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

  constructor() { }

  ngOnInit(): void {
    // TODO roomsの初期値を設定
  }

  public search(searchInput: string) {
    // TODO roomsを検索しなおす
  }

  public searchMore() {
    // TODO roomsを追加する
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
    // TODO Roomを登録する

    this.newRoom = {
      id: '',
      name: '',
      description: '',
      private: false,
      tags: [],
      password: ''
    };
  }

}
