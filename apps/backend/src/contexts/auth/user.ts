import { GeneralToken, User } from "@prisma/client";

import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";

//* ----------------
//* For registration
//* ----------------

export const checkDuplicateUsername = async (username: string): Promise<boolean> => {
    let user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    return !!user;
};

export const checkDuplicateEmail = async (email: string): Promise<boolean> => {
    let user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    return !!user;
};

export const register = async (
    email: string,
    username: string,
    password: string
): Promise<User> => {
    const passwordHash = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: {
            email,
            username,
            password: passwordHash,
        },
    });
};

export const getUserFromVerifyToken = async (
    verifyToken: GeneralToken
): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({
        where: {
            id: verifyToken.userId,
        },
    });

    return user || undefined;
};

export const verifyUser = async (user: User): Promise<void> => {
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            verifiedAt: new Date(),
        },
    });
};

//* ---------
//* For login
//* ---------

export const login = async (email: string, password: string): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return undefined;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return undefined;
    }

    return user;
};

//* ------------------
//* For password reset
//* ------------------

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    return user || undefined;
};

export const setUserPassword = async (user: User, password: string): Promise<void> => {
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: passwordHash,
        },
    });
};
