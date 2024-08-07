import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from "@angular/forms";
import { User } from "@types";
import { getDataUrlPattern, getHostedFilePattern } from "./helpers";

export class FormValidator {
    private field: string = "";

    private messages = new Map<string, string>();

    constructor(private form: FormGroup) {}

    private get _errors() {
        const control = this.form.get(this.field);

        if (this.field === "confirmPassword" && control?.touched) {
            if (this.form.errors?.["passwordMismatch"]) {
                return "Passwords must match";
            }
        }

        if (this.field === "password" && control?.touched) {
            if (control.hasError("required")) {
                return "This field is required";
            } else if (this.form.errors?.["passwordMatch"]) {
                return "Current Password and New Password must not match";
            }
        }

        if (control?.invalid && control.touched) {
            if (control.hasError("required")) {
                return (
                    this.messages.get("required") || "This field is required"
                );
            } else if (control.hasError("minlength")) {
                return (
                    this.messages.get("minlength") ||
                    `${this.field.replace(/^\w/, (c) =>
                        c.toUpperCase(),
                    )} must be at least ${
                        this.field === "name" ? "4" : "8"
                    } characters long`
                );
            } else if (control.hasError("email")) {
                return (
                    this.messages.get("email") ||
                    "Email must be a valid email address"
                );
            } else if (control.hasError("invalidName")) {
                return (
                    this.messages.get("invalidName") ||
                    "Name must contain a first part, followed by a space, then a last part"
                );
            } else if (control.hasError("invalidPassword")) {
                return (
                    this.messages.get("invalidPassword") ||
                    "Password must contain at least one uppercase letter and a number"
                );
            } else if (control.hasError("invalidFileType")) {
                return (
                    this.messages.get("invalidFileType") ||
                    "Invalid file type. Please upload a PNG file"
                );
            } else if (control.hasError("invalidFileSize")) {
                return (
                    this.messages.get("invalidFileSize") ||
                    "Uploaded file must be less than 5mb"
                );
            } else if (control.hasError("invalidPhoneNumber")) {
                return (
                    this.messages.get("invalidPhoneNumber") ||
                    "Phone number must be 9 digits without the leading 0"
                );
            } else if (control.hasError("maxWords")) {
                return (
                    this.messages.get("maxWords") ||
                    "Max number of words is 250"
                );
            } else if (control.hasError("maxlength")) {
                return (
                    this.messages.get("maxlength") ||
                    "Maximum number of characters exceeded"
                );
            }
        }

        return "";
    }

    public errors(field: string) {
        this.field = field;
        return this._errors;
    }

    public setErrorMessage(errorCode: string, message: string) {
        this.messages.set(errorCode, message);
        return this;
    }
}

export function passwordMatchValidator(
    passwordField: string,
    confirmPasswordField: string,
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(passwordField);
        const confirmPassword = control.get(confirmPasswordField);

        if (!password || !confirmPassword) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }

        return null;
    };
}

export function passwordsDoNotMatchValidator(
    passwordField: string,
    currentPasswordField: string,
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(passwordField);
        const currentPassword = control.get(currentPasswordField);

        if (!password || !currentPassword) {
            return null;
        }

        if (password.value !== currentPassword.value) {
            return null;
        }

        return { passwordMatch: true };
    };
}

export function nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const valid = /^[a-zA-Z]+( [a-zA-Z]+)+$/.test(value);
        return valid ? null : { invalidName: true };
    };
}

export function passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const valid = hasUpperCase && hasNumber;
        return valid ? null : { invalidPassword: true };
    };
}

export function validateFileType(fileFormats: string[]): ValidatorFn;
export function validateFileType(
    useRaw: "raw",
    fileFormats: string[],
): ValidatorFn;

export function validateFileType(...args: unknown[]): unknown {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value) {
            if (
                typeof args[0] === "string" &&
                args[0] === "raw" &&
                Array.isArray(args[1])
            ) {
                if (control.value instanceof File) {
                    return args[1].includes(control.value.type.split("/")[1])
                        ? null
                        : { invalidFileType: true };
                }
            } else if (
                Array.isArray(args[0]) &&
                typeof args[0][0] === "string"
            ) {
                const urlPattern = getHostedFilePattern(args[0]);
                const dataUrlPattern = getDataUrlPattern(args[0]);
                if (
                    urlPattern.test(control.value) ||
                    dataUrlPattern.test(control.value)
                ) {
                    return null;
                } else {
                    return { invalidFileType: true };
                }
            }
        }
        return null;
    };
}

export function validateFileSize(maxSizeInBytes: number): ValidatorFn;
export function validateFileSize(
    useRaw: "raw",
    maxSizeInBytes: number,
): ValidatorFn;

export function validateFileSize(...args: unknown[]): unknown {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value) {
            if (typeof args[0] === "string" && typeof args[1] === "number") {
                if (control.value instanceof File) {
                    if (control.value.size > args[1]) {
                        return { invalidFileSize: true };
                    }
                }
            } else if (
                typeof args[0] === "number" &&
                control.value.startsWith("data:image/png;base64,")
            ) {
                const base64Data = control.value.split(",")[1];
                const blobData = atob(base64Data);
                const size = blobData.length;
                if (size > args[0]) {
                    return { invalidFileSize: true };
                }
            }
        }
        return null;
    };
}

export function changeComparisonValidator(user: User | undefined): ValidatorFn {
    if (!user) return () => null;

    return (control: AbstractControl): ValidationErrors | null => {
        const group = control as FormGroup;
        let hasChanges = false;

        Object.keys(group.controls)
            .filter((key) => {
                const userValue = user[key as keyof User];
                const controlValue = group.controls[key].value;
                return !(userValue == null && controlValue === "");
            })
            .forEach((key) => {
                const control = group.controls[key];
                const userValue = user[key as keyof User];
                if (
                    typeof userValue === "string" &&
                    typeof control.value === "string"
                ) {
                    if (userValue.trim() !== control.value.trim()) {
                        hasChanges = true;
                    }
                } else {
                    if (userValue !== control.value) {
                        hasChanges = true;
                    }
                }
            });

        return hasChanges ? null : { noChanges: true };
    };
}

export function phoneNumberValidator(count: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const regex = new RegExp(`^\\d{${count}}$`);
        const valid = regex.test(value);
        return valid ? null : { invalidPhoneNumber: true };
    };
}

export function allowEmpty(control: AbstractControl): ValidationErrors | null {
    return control.value === "" ? null : { required: true };
}

/**
 * Combines multiple validators into a single validator function.
 * The control is considered valid if it passes at least one of the provided validators.
 *
 * @param validators An array of validator functions arranged in order of priority last.
 */
export function combineValidators(validators: ValidatorFn[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
        const errors = validators
            .map((validator) => validator(control))
            .filter((error) => error !== null);

        if (errors.length < validators.length) {
            return null;
        }

        return errors[errors.length - 1] || null;
    };
}

export function maxWords(maxWords: number): ValidatorFn {
    return (
        control: AbstractControl,
    ): Record<string, NonNullable<unknown>> | null => {
        if (!control.value) {
            return null;
        }
        const words = control.value.split(/\s+/).filter(Boolean);
        const wordsCount = words.length;
        return wordsCount > maxWords
            ? { maxWords: { value: control.value } }
            : null;
    };
}
