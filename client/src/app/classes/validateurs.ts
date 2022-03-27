import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
}
