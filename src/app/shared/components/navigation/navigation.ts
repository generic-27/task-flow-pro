import { Component, computed, effect, HostListener, signal } from '@angular/core';
import { User, UserRole } from '@app/core';
import { RouterLinkActive } from '@angular/router';
import { UserAvatar } from '@app/shared';

@Component({
  selector: 'app-navigation',
  imports: [RouterLinkActive, UserAvatar],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  // Signal-based state
  showUserMenu = signal(false);

  // Signal for current user - in a real app, this would come from an auth service
  currentUser = signal<User>({
    id: 'current-user',
    name: 'John Doe',
    email: 'john@taskflowpro.com',
    role: UserRole.DEVELOPER,
    avatar: undefined,
  });

  // Computed signal for formatted role
  formattedRole = computed(() => {
    return this.currentUser().role.replace('-', ' ');
  });

  constructor() {
    // Effect to handle menu state changes (for debugging or analytics)
    effect(() => {
      if (this.showUserMenu()) {
        console.log('User menu opened');
      }
    });
  }

  // Host listener to close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu');

    if (!userMenu && this.showUserMenu()) {
      this.showUserMenu.set(false);
    }
  }

  // Host listener to close menu on Escape key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showUserMenu()) {
      this.showUserMenu.set(false);
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu.update((current) => !current);
  }

  // Method to update user (for future use with auth service)
  updateUser(user: Partial<User>): void {
    this.currentUser.update((current) => ({ ...current, ...user }));
  }

  // Method to handle logout (for future use)
  logout(): void {
    console.log('Logout clicked');
    this.showUserMenu.set(false);
    // In a real app, this would call an auth service
  }

  // Method to handle profile navigation (for future use)
  navigateToProfile(): void {
    console.log('Navigate to profile');
    this.showUserMenu.set(false);
  }

  // Method to handle settings navigation (for future use)
  navigateToSettings(): void {
    console.log('Navigate to settings');
    this.showUserMenu.set(false);
  }
}
