import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import type { Role } from './signup.model';
import { ErrorMessageComponent } from '../error-message/error-message.component';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    } else {
      return { notEqualValues: true };
    }
  };
}

function selectAtLeastOneSource(control: AbstractControl) {
  if (control instanceof FormArray) {
    const atLeastSelected = control.controls.some((ctrl) => ctrl.value);

    return atLeastSelected ? null : { notSelectAtLeastOneSource: true };
  }

  return { notSelectAtLeastOneSource: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.setFormState();
  }

  private getPasswordsControl() {
    return this.form.controls['passwords'];
  }

  get isEmailInvalid() {
    const emailControl = this.form.controls['email'];
    return emailControl.touched && emailControl.invalid;
  }

  get isPasswordLengthInvalid() {
    const passwordControl = this.getPasswordsControl().get('password');
    return passwordControl?.touched && passwordControl?.invalid;
  }

  get isConfirmPasswordMismatch() {
    const passwordsControl = this.getPasswordsControl();
    const confirmPasswordControl = passwordsControl.get('confirmPassword');
    const passwordControl = passwordsControl.get('password');
    return (
      (confirmPasswordControl?.touched || passwordControl?.touched) &&
      passwordControl?.value !== confirmPasswordControl?.value
    );
  }

  isNameInvalid(nameToCheck: 'firstName' | 'lastName') {
    const nameControl = this.form.controls['fullName'].get(nameToCheck);
    return nameControl?.touched && nameControl?.invalid;
  }

  get isFirstNameInvalid() {
    return this.isNameInvalid('firstName');
  }

  get isLastNameInvalid() {
    return this.isNameInvalid('lastName');
  }

  setFormState() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),

      passwords: new FormGroup(
        {
          password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
          }),

          confirmPassword: new FormControl('', {
            validators: [Validators.required],
          }),
        },
        {
          validators: [equalValues('password', 'confirmPassword')],
        }
      ),

      fullName: new FormGroup({
        firstName: new FormControl('', { validators: [Validators.required] }),

        lastName: new FormControl('', { validators: [Validators.required] }),
      }),

      address: new FormGroup({
        street: new FormControl('', { validators: [Validators.required] }),

        number: new FormControl('', { validators: [Validators.required] }),

        postalCode: new FormControl('', { validators: [Validators.required] }),

        city: new FormControl('', { validators: [Validators.required] }),
      }),

      role: new FormControl<Role>('student', {
        validators: [Validators.required],
      }),

      source: new FormArray(
        [
          new FormControl(false),
          new FormControl(false),
          new FormControl(false),
        ],
        {
          validators: [selectAtLeastOneSource],
        }
      ),

      agree: new FormControl(false, { validators: [Validators.requiredTrue] }),
    });
  }

  onSubmit() {
    console.log(this.form);
  }

  onReset() {
    this.form.reset();
  }
}
