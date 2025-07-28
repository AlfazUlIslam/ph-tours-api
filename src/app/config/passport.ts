import passport from "passport";
import bcryptjs from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { env } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";

// Local strategy
passport.use(new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
        try {
            // Check if user exists
            const isUserExist = await User.findOne({email});

            if (!isUserExist) {
                return done(null, false, {message: "User does not exist"});
                // return done("User does not exist");
            };

            if (!isUserExist.isVerified) {
                return done(null, false, { message: "User is not verified" });
                // return done("User is not verified");
            };

            if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                return done(null, false, { message: `User is ${isUserExist.isActive}` });
                // return done(`User is ${isUserExist.isActive}`);
            };
            
            if (isUserExist.isDeleted) {
                return done(null, false, { message: "User is deleted" });
                // return done("User is deleted");
            };
            
            // Check if user is google authenticated
            const isGoogleAuthenticated = isUserExist.auths.some(
                provObj => provObj.provider === "google"
            );

            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { 
                    message: "You have already authenticated with google. If you want to login using credentials set a password first. Then you can login using email and password." 
                });
                // return done("You have already authenticated with google. If you want to login using credentials set a password first. Then you can login using email and password.");
            };

            // Hash password
            const isPasswordMatched = await bcryptjs.compare(
                password as string,
                isUserExist.password as string
            );

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match" });
            };

            return done(null, isUserExist);
        } catch (error) {
            console.log("Passport local strategy error:", error);
            return done(error);
        }
    }
));

// Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;

                if (!email) {
                    return done(null, false, { message: "No email found" });
                };

                let isUserExist = await User.findOne({ email });

                if (isUserExist && !isUserExist.isVerified) {
                    return done(null, false, {message: "User is not verified"});
                };

                if (isUserExist && (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE)) {
                    return done(null, false, { message: `User is ${isUserExist.isActive}` });
                };
                
                if (isUserExist && isUserExist.isDeleted) {
                    return done(null, false, { message: "User is deleted" });
                };

                if (!isUserExist) {
                    isUserExist = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            { 
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    });
                };

                return done(null, isUserExist);
            } catch (error) {
                console.log("Google strategy error", error);
                return done(error);
            };
        }
    )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    };
});