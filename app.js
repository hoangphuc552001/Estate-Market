import express from "express";
import morgan from 'morgan';
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import activateViewMiddleware from './middlewares/view.mdw.js'
import activateRouteMiddleware from './middlewares/routes.mdw.js'
import activateLocalsMiddleware from './middlewares/locals.mdw..js'
import activateSessionMiddleware from './middlewares/session.mdw.js'
import asyncErrors from 'express-async-errors'
//express declare
const app = express()
const port = process.env.PORT || 3000
app.use('/public',express.static('public'))
//morgan
app.use(morgan('dev'));
//middleware declare for post method
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//view
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
activateSessionMiddleware(app);
activateLocalsMiddleware(app);
activateViewMiddleware(app);
activateRouteMiddleware(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
