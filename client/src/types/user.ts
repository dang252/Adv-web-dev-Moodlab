export interface UserAccount {
    userId?: string;
    username?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface JwtPayload {
    exp: number;
    iat: number;
    sub: string;
}