import { Prisma } from "@prisma/client";

const accessTokenWithUser = Prisma.validator<Prisma.AccessTokenArgs>()({
    include: { user: true },
});

export type AccessTokenWithUser = Prisma.AccessTokenGetPayload<typeof accessTokenWithUser>;

const generalTokenWithUser = Prisma.validator<Prisma.GeneralTokenArgs>()({
    include: { user: true },
});

export type GeneralTokenWithUser = Prisma.GeneralTokenGetPayload<typeof generalTokenWithUser>;

const refreshTokenWithUser = Prisma.validator<Prisma.RefreshTokenArgs>()({
    include: { user: true },
});

export type RefreshTokenWithUser = Prisma.RefreshTokenGetPayload<typeof refreshTokenWithUser>;
