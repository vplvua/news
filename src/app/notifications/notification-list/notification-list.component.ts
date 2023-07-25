import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationsService } from '../notifications.service';
import { Command } from '../notifications.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
})
export class NotificationListComponent {
  messages: Observable<Command[]>;

  constructor(private notificationsService: NotificationsService) {
    this.messages = this.notificationsService.messagesOutput;
  }

  clearMessage(id: number) {
    this.notificationsService.clearMessage(id);
  }
}
