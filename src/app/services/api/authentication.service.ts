import { inject, Injectable } from "@angular/core";
import { HBApiService } from "@services";
import {
    ApiSuccess,
    LoginUserDetails,
    LoginUserResponse,
    RegisterUserDetails,
    Roles,
    ServerRoleToLocalRole,
    SetNewPasswordDetails,
} from "@types";
import { catchError, lastValueFrom, map, tap } from "rxjs";
import { UserService } from "../state";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService extends HBApiService {
    private url = this.baseUrl + "/auth";
    private userService = inject(UserService);

    login(credentials: LoginUserDetails): Promise<LoginUserResponse> {
        this.tokenService.clear();
        return lastValueFrom(
            this.http
                .post<LoginUserResponse>(
                    `${this.url}/login`,
                    credentials,
                    this.headers,
                )
                .pipe(
                    map((user) => ({
                        ...user,
                        role: ServerRoleToLocalRole[user.role],
                    })),
                    tap(async (user) => {
                        this.tokenService.set(user.token);
                        this.userService.user = user;
                        this.toastService.toast({
                            message: `Logged in as, ${user.fullName.trim() || user.email}`,
                            status: "success",
                        });
                        if (user.role === "doctor" && user.firstLogin) {
                            await this.router.navigate(["/doctor/profile"]);
                            return;
                        }
                        await this.router.navigate([`/${user.role}/home`]);
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    register(
        credentials: RegisterUserDetails,
        role: Roles,
    ): Promise<ApiSuccess> {
        this.tokenService.clear();
        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.url}/${role}/register`,
                    credentials,
                    this.headers,
                )
                .pipe(
                    tap(async () => {
                        this.toastService.toast({
                            message:
                                "Registration successful, check your email for verification",
                            status: "success",
                        });
                        await this.router.navigate(["/auth/verify"], {
                            state: { email: credentials.email },
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    requestPasswordReset(email: string): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.url}/reset-password`,
                    { email },
                    this.headers,
                )
                .pipe(
                    tap((response) => {
                        this.toastService.toast({
                            message: response.message,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    setNewPassword(credentials: SetNewPasswordDetails): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.url}/reset-password/${credentials.otp}`,
                    {
                        email: credentials.email,
                        password: credentials.password,
                    },
                    this.headers,
                )
                .pipe(
                    tap(async () => {
                        this.toastService.toast({
                            message: "Password reset successful",
                            status: "success",
                        });
                        await this.router.navigate(["/auth/login"]);
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    verifyCode(code: string): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.url}/verify`,
                    {},
                    {
                        headers: this.headers.headers,
                        params: { code },
                    },
                )
                .pipe(
                    tap(async () => {
                        await this.router.navigate(["/auth/login"]);
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    resendVerificationCode(email: string): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.url}/resend-code`,
                    { email },
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: "Verification code resent",
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }
}
