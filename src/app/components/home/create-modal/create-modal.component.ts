import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Room } from 'src/app/types/Room';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.css']
})
export class CreateModalComponent implements OnInit {

  @Input()
  public isOpen: boolean;

  @Output()
  public onClose: EventEmitter<void> = new EventEmitter();

  public tag: string;

  public room: Room;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.room = new Room();
  }

  public close() {
    this.onClose.emit();
  }

  // ==========================
  // Room操作
  // ==========================
  public save() {
    if (this.room.name === "") {
      window.alert("Name is required.\r\nPlease input Room Name.");
      return false;
    }

    if (this.room.private && !this.room.password) {
      window.alert("Password is required for private room.\r\nPlease input Password or change to public room.");
      return false;
    }

    this.room.id = Room.genId();
    this.afs.collection<Room>(Room.COLLECTION_NAME).doc(this.room.id).set(this.room.clone())
      .then(() => this.room = new Room())
      .then(() => this.close());
  }

  // ==========================
  // Tag操作
  // ==========================
  public addTag(tag: string) {
    if (!this.room.hasTag(tag)) {
      this.room.addTag(tag);
    }

    this.tag = "";
  }

  public deleteTag(tag: string) {
    this.room.removeTag(tag);
  }

}
