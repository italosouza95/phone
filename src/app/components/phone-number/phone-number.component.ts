import { AsyncPipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { COUNTRY_LIST } from './countryLista.database';

export interface IPhoneNumber {
  translatedName: {
    en: string,
    fr: string,
    es: string,
    de: string,
    it: string,
    nl: string,
    pt: string
  },
  flag: string,
  prefix: string,
  charLimits: { minLength: number, maxLength: number }
}

export interface ISetupPhoneNumberFields {
  labelFlag: string,
  labelPrefix: string,
  labelPhoneNumber: string,
  translateFieldTo: string,
  idFlag?: string,
  idPrefix?: string,
  idPhoneNumber?: string,
  isDisabled?: boolean,
}

export interface IPhoneNumberValues {
  prefix: string,
  phoneNumber: string,
  phoneNumberIsFrom: string
  isFormValid: boolean
}

@Component({
  selector: 'phone-number',
  standalone: true,
  imports: [TitleCasePipe, AsyncPipe, KeyValuePipe, ReactiveFormsModule],
  templateUrl: './phone-number.component.html',
  styleUrl: './phone-number.component.scss'
})
export class PhoneNumberComponent implements OnInit {
  @Input({ required: true }) data!: ISetupPhoneNumberFields;
  @Output() sendValue = new EventEmitter<IPhoneNumberValues>();

  formBuilder = inject(FormBuilder);
  errorsOnForm!: ValidationErrors

  form: FormGroup = this.formBuilder.group({
    prefix: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(/^\+\d{1,4}$/)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^\d{5,15}$/)]],
  });

  ngOnInit(): void {
    this.form.get('phoneNumber')?.disable();

    this.form.get('prefix')?.valueChanges.subscribe(() => {
      const prefixControl = this.form.get('prefix');
      const phoneNumberControl = this.form.get('phoneNumber');
this.form.get('prefix')?.value
      if (prefixControl?.valid && prefixControl.dirty) {
        phoneNumberControl?.enable();
      } else {
        phoneNumberControl?.disable();
      }
    });

    this.form.valueChanges.subscribe((changes) => {
      if (this.form.valid) {
        this.sendValue.emit({
          prefix: changes.prefix,
          phoneNumber: changes.phoneNumber,
          phoneNumberIsFrom: this.data.translateFieldTo,
          isFormValid: this.form.valid
        });

        console.log({
          prefix: changes.prefix,
          phoneNumber: changes.phoneNumber,
          phoneNumberIsFrom: this.data.translateFieldTo,
          isFormValid: this.form.valid
        });
      }
    });

    this.form.statusChanges.subscribe(() => {
      this.errorsOnForm = this.form.errors || {};
    });
  }

  get flagFromPrefix(): string {
    return COUNTRY_LIST.find((country) => country.prefix === this.form.get('prefix')?.value)?.flag || '';
  }
}
