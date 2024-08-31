import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import type { Role } from './signup.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.setFormState();
  }

  setFormState() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),

      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),

      confirmPassword: new FormControl('', {
        validators: [Validators.required],
      }),

      firstName: new FormControl('', { validators: [Validators.required] }),

      lastName: new FormControl('', { validators: [Validators.required] }),

      street: new FormControl('', { validators: [Validators.required] }),

      number: new FormControl('', { validators: [Validators.required] }),

      postalCode: new FormControl('', { validators: [Validators.required] }),

      city: new FormControl('', { validators: [Validators.required] }),

      role: new FormControl<Role>('student', {
        validators: [Validators.required],
      }),

      agree: new FormControl(false, { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    console.log(this.form);
  }

  onReset() {
    this.form.reset();
  }
}
