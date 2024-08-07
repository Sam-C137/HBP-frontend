import { Injectable } from "@angular/core";
import { HBApiService } from "@services";
import {
    ApiSuccess,
    Doctor,
    PageableItems,
    Patient,
    Roles,
    User,
} from "@types";
import { catchError, lastValueFrom, tap } from "rxjs";

export type Filters = {
    search: string;
    specialization: string;
    rank: string;
    status: string;
    page: number;
    size: number;
    sort: string;
};

@Injectable({
    providedIn: "root",
})
export class UserManagementService extends HBApiService {
    private role?: Roles;

    public setRole(role: Roles) {
        this.role = role;
        return this;
    }

    getAll(
        params: Partial<Filters>,
    ): Promise<PageableItems<Doctor | Patient | User>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<Doctor | Patient | User>>(
                    `${this.baseUrl}/users/${this.role?.toUpperCase()}`,
                    {
                        params: {
                            ...params,
                            size: 10,
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    toggleStatus(
        user: Patient | Doctor,
        status: "active" | "inactive",
    ): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/users/${user.id}/status`,
                    {
                        status,
                    },
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Successfully ${
                                status === "active" ? "activate" : "deactivate"
                            }d ${user.fullName}`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    deleteUser(user: Doctor | Patient | User): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .delete<ApiSuccess>(
                    `${this.baseUrl}/users/${user.id}`,
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Successfully deleted ${user.fullName}`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    inviteUsers(emails: string[]): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.baseUrl}/users/invite`,
                    { emails },
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: "Invitation sent successfully",
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    cancelUserInvite(user: Partial<User>): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .delete<ApiSuccess>(
                    `${this.baseUrl}/admin-dashboard/${user?.id}`,
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Successfully cancelled invitation for ${user?.email}`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    resendUserInvitation(user: Partial<User>): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/admin-dashboard/${user?.id}/resend-invite`,
                    {},
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Successfully resent invitation for ${user?.email}`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }
}
