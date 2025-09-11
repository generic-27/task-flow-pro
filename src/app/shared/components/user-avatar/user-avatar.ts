import { Component, computed, input } from '@angular/core';
import { User } from '@core/models/task.model';

@Component({
  selector: 'app-user-avatar',
  imports: [],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
})
export class UserAvatar {
  user = input<User | null>(null);
  size = input<'small' | 'medium' | 'large'>('medium');

  initials = computed(() => {
    const userName = this.user()?.name;
    if (!userName) return '?';

    return userName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  });
}
