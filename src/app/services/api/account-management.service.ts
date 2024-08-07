import { inject, Injectable, signal } from "@angular/core";
import { HBApiService } from "../hb-api.service";
import {
    ApiSuccess,
    Appointment,
    Doctor,
    Patient,
    Preferences,
    User,
} from "@/app/libs/types";
import { catchError, lastValueFrom, switchMap, tap } from "rxjs";
import { UserService } from "../state";

@Injectable({
    providedIn: "root",
})
export class AccountManagementService extends HBApiService {
    private userService = inject(UserService);
    private preferences = signal<Preferences>({
        appointmentRequested: false,
        appointmentRejected: false,
        appointmentAccepted: false,
        appointmentCompleted: false,
        appointmentRescheduled: false,
        appointmentCancelled: false,
        accountInfoUpdated: false,
        accountDeactivated: false,
    });

    getUserProfile(
        callback?: (user: Doctor | Patient) => void,
    ): Promise<Doctor | Patient> {
        const id = this.userService.user?.id;

        return lastValueFrom(
            this.http
                .get<
                    Doctor | Patient
                >(`${this.baseUrl}/users/${id}/profile`, this.headers)
                .pipe(
                    tap((user) => callback?.(user)),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    updateProfile(
        info: Partial<User>,
        unmarkFirstLogin?: boolean,
    ): Promise<User | [ApiSuccess, User]> {
        const id = this.userService.user?.id;

        const updateUser = this.http
            .patch<User>(
                `${this.baseUrl}/users/${id}/profile`,
                info,
                this.headers,
            )
            .pipe(
                catchError((e) => this.onError(e, true)),
                tap((user) => {
                    this.userService.user = {
                        ...this.userService.user,
                        ...user,
                    };
                    this.toastService.toast({
                        message: "Profile updated successfully",
                        status: "success",
                    });
                }),
            );

        if (unmarkFirstLogin) {
            return lastValueFrom(
                this.http
                    .patch<ApiSuccess>(
                        `${this.baseUrl}/auth/reset-firstLogin`,
                        {},
                        {
                            params: {
                                doctorId: id?.toString() || "",
                            },
                        },
                    )
                    .pipe(
                        switchMap(() => updateUser),
                        catchError((e) => this.onError(e, true)),
                    ),
            );
        }

        return lastValueFrom(updateUser);
    }

    removeProfilePicture(): Promise<User> {
        const id = this.userService.user?.id;

        return lastValueFrom(
            this.http
                .delete<User>(
                    `${this.baseUrl}/users/${id}/profile-picture`,
                    this.headers,
                )
                .pipe(
                    catchError((e) => this.onError(e, true)),
                    tap((user) => {
                        this.userService.user = {
                            ...this.userService.user,
                            ...user,
                        };
                        this.toastService.toast({
                            message: "Profile picture removed successfully",
                            status: "success",
                        });
                    }),
                ),
        );
    }

    deleteAccount(): Promise<ApiSuccess> {
        const id = this.userService.user?.id;

        return lastValueFrom(
            this.http
                .delete<ApiSuccess>(`${this.baseUrl}/users/${id}`, this.headers)
                .pipe(
                    catchError((e) => this.onError(e, true)),
                    tap(async () => {
                        this.userService.removeUser();
                        this.tokenService.clear();
                        await this.router.navigate(["/"]);
                        this.toastService.toast({
                            message: "Account deleted successfully",
                            status: "success",
                        });
                    }),
                ),
        );
    }

    changePassword(credentials: {
        oldPassword: string;
        newPassword: string;
    }): Promise<ApiSuccess> {
        const id = this.userService.user?.id;

        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/users/${id}/change-password`,
                    credentials,
                    this.headers,
                )
                .pipe(
                    catchError((e) => this.onError(e, true)),
                    tap(() => {
                        this.toastService.toast({
                            message: "Password updated successfully",
                            status: "success",
                        });
                    }),
                ),
        );
    }

    getEmailPreferences(): Promise<Preferences> {
        const id = this.userService.user?.id;
        return lastValueFrom(
            this.http
                .get<Preferences>(
                    `${this.baseUrl}/users/${id}/email-preferences`,
                )
                .pipe(
                    catchError((e) => this.onError(e, true)),
                    tap((preferences) => {
                        this.preferences.set(preferences);
                    }),
                ),
        );
    }

    saveEmailPreferences(preferences: Preferences): Promise<ApiSuccess> {
        const id = this.userService.user?.id;
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/users/${id}/email-preferences`,
                    preferences,
                    this.headers,
                )
                .pipe(
                    catchError((e) => this.onError(e, true)),
                    tap(() => {
                        this.toastService.toast({
                            message: "Preferences saved successfully",
                            status: "success",
                        });
                        this.preferences.set(preferences);
                    }),
                ),
        );
    }

    getMyCalendar(endTime: string): Promise<Appointment[]> {
        const id = this.userService.user?.id;

        return lastValueFrom(
            this.http
                .get<Appointment[]>(
                    `${this.baseUrl}/booking/personal-calendar`,
                    {
                        params: {
                            endTime,
                            userId: id || "",
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    getPreferences() {
        return this.preferences();
    }
}
