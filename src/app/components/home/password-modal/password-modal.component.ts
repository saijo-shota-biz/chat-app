import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Room } from 'src/app/types/Room';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css']
})
export class PasswordModalComponent implements OnInit {

  @Input()
  public isOpen: boolean;

  @Input()
  public room: Room;

  @Output()
  public onClose: EventEmitter<void> = new EventEmitter();

  public password: string;

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  public close() {
    this.onClose.emit();
  }

  public entry(): void {
    if (this.room.verify(this.password)) {
      this.route.navigate(['rooms', this.room.id, 'chat']);
    } else {
      window.alert('password is wrong.');
      this.close();
    }
  }

}
