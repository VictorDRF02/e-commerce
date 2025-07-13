import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
})
export class AccountComponent {
  authService = inject(AuthService);
  location = inject(Location);
  user: User | null = this.authService.user;
}
