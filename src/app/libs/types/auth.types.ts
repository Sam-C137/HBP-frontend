import { User } from "./main.types";

export type LoginUserDetails = {
    email: string;
    password: string;
};

export type LoginUserResponse = {
    token: string;
} & User;

export type RegisterUserDetails = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type RegisterUserResponse = {
    token: string;
};

export type SetNewPasswordDetails = {
    otp: string;
    email: string;
    password: string;
};

export type ApiResponse = {
    message: string;
};
