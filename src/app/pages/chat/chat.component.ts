import { Component, OnInit } from '@angular/core';
import { Comment } from '../../types/Comment';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageUtil } from 'src/app/utils/LocalStorageUtil';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public comments: Comment[] = [];

  public message: string = "";

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get("id");

    LocalStorageUtil.setCurrentRoomId(roomId);

    this.afs.collection<Comment>(Comment.COLLECTION_NAME, ref => ref.where('roomId', '==', roomId).orderBy('timestamp'))
      .valueChanges().subscribe(comments => this.comments = comments.map(c => Object.assign(new Comment(""), c)));
  }

  public send() {
    const comment = new Comment(this.message);

    this.afs.collection(Comment.COLLECTION_NAME)
      .add(comment.clone())
      .then(() => this.message = "");
  }

}
