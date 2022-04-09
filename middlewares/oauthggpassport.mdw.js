import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2';
import oauthService from "../services/oauthService.js";
import loginService from "../services/loginService.js";
passport.use(new GoogleStrategy.Strategy({
        clientID:"917266315294-p1a7qm4dr3f90qkb8n1cdn7rn7mdiv04.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:3000/auth/google/callback",
        passReqToCallback   : true
    },
    async function(request, accessToken, refreshToken, profile, done) {
    try{
        await oauthService.findUserByEmail(profile.email).then(async (user) => {
            if (!user) {
                var user_={email:profile.email,name:profile.displayName,password:profile.id,permissions:0}
                oauthService.addUserGGOauth(user_).then(user=>{
                    return done(null,user)
                })
            }
            else{
                return done(null, user);
            }
        })
    }
    catch (err) {
        console.log(err);
        return done(null, false, { message: err });
    }
    }
));
passport.serializeUser((user,done)=>{
    done(null,user.email)
})
passport.deserializeUser((email, done) => {
    loginService.findUserByEmail(email).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});