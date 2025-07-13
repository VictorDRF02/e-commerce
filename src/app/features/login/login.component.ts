import { Component, inject, signal } from '@angular/core';
import { BaseComponent } from '../../shared/components/base/base.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent {
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router)
  form: FormGroup = this._formBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });
  isSubmitting = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  /**
   * Try to login the user. Check if the form is valid
   */
  login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { username, password } = this.form.value;
    this.isSubmitting.set(true);
    this.authService.login(username, password).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isSubmitting.set(false))
    ).subscribe((res) => {
      if (res) {
        this._router.navigate(['/'])
      }
    });
  }

  /**
   * Updates the password visibility
   */
  togglePassword() {
    this.showPassword.update((v) => !v)
  }
}
