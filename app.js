import express from "express";
import morgan from 'morgan';
import activateViewMiddleware from './middlewares/view.mdw.js'

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
app.get('/',(req,res)=>{
    res.render('index',{
    layout:'layoutHomePage.hbs'
    })
})
activateViewMiddleware(app);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})