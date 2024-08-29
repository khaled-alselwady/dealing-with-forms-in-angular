import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }

  return { doesNotContainQuestionMark: true };
}

function isEmailUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }

  return of({ notUnique: true });
}

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
      asyncValidators: [isEmailUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  private isInvalidControl(controlName: 'email' | 'password') {
    const control = this.form.controls[controlName];
    return control.touched && control.dirty && control.invalid;
  }

  private hasError(control: AbstractControl, errorKey: string): boolean {
    return control.hasError(errorKey) && control.touched;
  }

  get isEmailInvalid() {
    return this.isInvalidControl('email');
  }

  get isPasswordLengthInvalid() {
    return this.hasError(this.form.controls['password'], 'minlength');
  }

  get doesNotPasswordContainQuestionMark() {
    return this.hasError(
      this.form.controls['password'],
      'doesNotContainQuestionMark'
    );
  }

  onSubmit() {
    console.log(this.form);
  }
}
