import { FormControl } from "@angular/forms";
export type ChangePassword = {
    currentPassword: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
};
