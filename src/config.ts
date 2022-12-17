import {CookieAttributes} from "typescript-cookie/dist/types";

export const cookiePrefix = 'privacy';
export const cookieOptions: CookieAttributes = {
    expires: 365, //days
    secure: true,
    sameSite: 'Lax',
}
