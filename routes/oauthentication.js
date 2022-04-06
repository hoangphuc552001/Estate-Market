import express from "express";
import passport from "passport"
import '../middlewares/oauthggpassport.mdw.js'
const router=express.Router();
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get('/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
    ));

router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/auth/google/failure'
    })
);


router.get('/google/failure', (req, res) => {
    res.send('Lỗi');
});

export default router;