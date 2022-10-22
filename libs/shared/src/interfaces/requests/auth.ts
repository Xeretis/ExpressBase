import { Query } from "express-serve-static-core";

export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
    remember: boolean;
}

export interface VerifyQuery extends Query {
    token: string;
}

export interface PasswordChangeBody {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}

export interface PasswordResetQuery extends Query {
    token: string;
}

export interface PasswordResetBody {
    password: string;
}
