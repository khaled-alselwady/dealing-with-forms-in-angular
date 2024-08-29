import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  private isInvalidControl(control: 'email' | 'password') {
    return (
      this.form.controls[control].touched &&
      this.form.controls[control].dirty &&
      this.form.controls[control].invalid
    );
  }

  get isEmailInvalid() {
    return this.isInvalidControl('email');
  }

  get isPasswordInvalid() {
    return this.isInvalidControl('password');
  }

  onSubmit() {
    console.log(this.form);
  }
}
