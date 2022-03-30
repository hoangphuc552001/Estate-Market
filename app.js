import express from "express";
import morgan from 'morgan';
import activateViewMiddleware from './middlewares/view.mdw.js'
import activateRouteMiddleware from './middlewares/routes.mdw.js'
import activatLocalsMiddleware from './middlewares/locals.mdw..js'
import asyncErrors from 'express-async-errors'
//express declare
const app = express()
const port = 3000
app.use('/public',express.static('public'))

//morgan
app.use(morgan('dev'));

//middleware declare for post method
app.use(express.urlencoded({extended:true}));
//view

app.use('/public',express.static('public'))

activatLocalsMiddleware(app);
activateViewMiddleware(app);
activateRouteMiddleware(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})