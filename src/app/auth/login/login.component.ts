import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

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

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
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

  ngOnInit() {
    this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          'saved-login-form',
          JSON.stringify({ email: value.email })
        );
      },
    });
  }

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
