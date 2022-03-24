import express from "express";
const router=express.Router();
router.get('/:sliderID',async (req,res)=>{
    const sliderID=req.params.id || 0;
    res.render('detail',{

    })
});
export default router;