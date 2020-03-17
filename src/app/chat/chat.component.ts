import { Component, OnInit } from '@angular/core';
import { Comment } from '../types/Comment';
import { ActivatedRoute } from '@angular/router';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { v4 as uuidv4 } from 'uuid';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public comments: Observable<Comment[]>;

  public myId: string;

  private roomId: string;

  private static readonly MY_ID_KEY: string = "chat-app-myId";

  public message: string = "";

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id");

    localStorage.setItem(BottomNavComponent.CURRENT_ROOM_ID, this.roomId);

    this.comments = this.afs.collection<Comment>('comments', ref => ref.where('roomId', '==', this.roomId).orderBy('timestamp')).valueChanges();

    const myId = localStorage.getItem(ChatComponent.MY_ID_KEY);
    if (myId) {
      this.myId = myId;
    } else {
      const newId = uuidv4();
      localStorage.setItem(ChatComponent.MY_ID_KEY, newId);
      this.myId = newId;
    }
  }

  public send() {
    const comment = {
      userId: this.myId,
      content: this.message,
      roomId: this.roomId,
      timestamp: firestore.FieldValue.serverTimestamp()
    }

    this.afs.collection('comments').add(comment)
      .then(() => this.message = "");
  }

}
