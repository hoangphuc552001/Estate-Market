import dotenv from "dotenv";
const PROCESS = dotenv.config()
import express from "express";
import  paypal from 'paypal-rest-sdk';
import estateModels from "../models/estate.models.js";
import userModel from "../models/user.model.js";
let total =0;
let entity=0;
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYmVcsQqf47NY436c-PpR_NAFJBWAjbJuzrF30kib-PW6V_Px_CVlHrYTEC2_ZNbcPN2j34nK6UHQUjt',
    'client_secret': 'EJjOoyJdwYCcIifXCe0c4Dkc9wJxr9904n3Do1iWL2NTciwKERgH1kTIW4pl_N74gljRdyv-2D3cS6nE',
});


let proID;
const router = express.Router();
router.get("/success",(req,res)=>{
    const payID=req.query.PayerID;
    var execute_payment_json = {
        "payer_id": payID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "1.5"
            }
        }]
    };

    var paymentId = req.query.paymentId;

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            throw error;

        } else {
            const updateSeller=userModel.updateStatus(proID);
            return res.render("user/checkout-success")
        }
    });
});

router.post("/:proID",async (req, res) => {
    console.log(req.params.proID);
    const promise=new Promise(async (resolve, reject) => {
        entity=req.body;
        proID=req.params.proID;
        const product = await estateModels.findDetailProByID(req.params.proID);
        console.log(product)
        const userList = await userModel.findUserByID(res.locals.user.id);
        let subtotal = 0;
        const price=Math.round(parseFloat('25000')*0.0000435303);
        let items = [{
            "name": product[0].title,
            "sku": product[0].acreage,
            "price":"1.5",
            "currency": "USD",
            "quantity": 1
        }];
        resolve({items:items});
    });
    promise.then(function (data){
        console.log(data.items);
        total=data.items.price;
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${PROCESS.parsed.DOMAIN}/checkout/success`,
                "cancel_url": `${PROCESS.parsed.DOMAIN}/checkout/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": data.items
                },
                "amount": {
                    "currency": "USD",
                    "total": "1.5"
                },
                "description": "This is the payment description."
            },
            ]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error
                res.render('cancel');
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href)
                    }
                }
            }
        });
    });
})

export default router;