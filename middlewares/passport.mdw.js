import passport from "passport";
import passportLocal from "passport-local"
import loginService from "../services/loginService.js";
let LocalStrategy=passportLocal.Strategy
let initPassportLocal=()=>{
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                await loginService.findUserByEmail(email).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash("errors", `Email "${email}" không tồn tại`));
                    }
                    if (user) {
                        let match = await loginService.comparePasswordUser(user, password);
                        if (match === true) {
                            return done(null, user, null)
                        } else {
                            return done(null, false, req.flash("errors", match)
                            )
                        }
                    }
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }));
}
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
export default initPassportLocal