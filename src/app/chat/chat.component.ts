import { Component, OnInit } from '@angular/core';
import { Comment } from '../types/Comment';
import { ActivatedRoute } from '@angular/router';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public comments: Comment[] = [];

  public myId: string;

  private roomId: string;

  private static readonly MY_ID_KEY: string = "chat-app-myId";

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id");

    localStorage.setItem(BottomNavComponent.CURRENT_ROOM_ID, this.roomId);

    // TODO commentのsnapShotのリスナーを設定

    const myId = localStorage.getItem(ChatComponent.MY_ID_KEY);
    if (myId) {
      this.myId = myId;
    } else {
      const newId = null;
      localStorage.setItem(ChatComponent.MY_ID_KEY, newId);
      this.myId = newId;
    }
  }

  public send(message: string) {
    // TODO roomIdに送信
    const c: Comment = {
      userId: this.myId,
      content: message,
      roomId: this.roomId
    }
  }

}
