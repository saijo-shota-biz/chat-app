import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {

  public static readonly CURRENT_ROOM_ID = "chat-app-current-room-id"

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public getCurrentRoom() {
    const roomId = localStorage.getItem(BottomNavComponent.CURRENT_ROOM_ID);
    return roomId || 'help';
  }

  public isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), false);
  }
}
