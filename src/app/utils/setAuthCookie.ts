import { Response } from "express";

export interface IAuthTokens {
    accessToken?: string;
    refreshToken?: string;
};

const setAuthCookie = (res: Response, tokenInfo: IAuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie(
            "accessToken",
            tokenInfo.accessToken,
            { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
    };
    
    if (tokenInfo.refreshToken) {
        res.cookie(
            "refreshToken",
            tokenInfo.refreshToken,
            { 
                httpOnly: true, 
                secure: true,
                sameSite: "none"
            }
        );
    };
};

export default setAuthCookie;