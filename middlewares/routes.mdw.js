import sliderRouter from '../routes/sliderRoute.js'
export default function (app) {
    app.get('/',async (req,res)=>{
        res.render('index',{
            layout:'layoutHomePage.hbs',
        })
    })
    app.use("/slider",sliderRouter)
}