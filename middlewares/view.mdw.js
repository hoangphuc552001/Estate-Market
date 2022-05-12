import {engine} from "express-handlebars";
import express_handlebars_sections from 'express-handlebars-sections';
import numeral from "numeral";
import moment from 'moment'
export default function (app) {
    app.engine('hbs', engine({
        defaultLayout: 'layout.hbs',
        helpers: {
            format_number(val) {
                val=numeral(val).format('0,0')
                return val+' VNĐ'
            },

            section: express_handlebars_sections(),
            equal(first, second) {
                return first === second;
            },
            sum(first,second){
                return first+second
            },
            minus(first,second){return first-second},
            time(val){
                return moment(val).format('DD-MM-YYYY')
            },
            check(index){
                return index===0
            },
            checkIsGroupOrAdmin(index){
                return index===1 || index===2
            },
            checkIsBLock(index){
                return index===-1
            },
            checkExist(index){
                return index!==-1
            },
            checkAdmin(index){
                return index===1
            },
            checkProJect(index){
                return index===2
            },
            checkTrue(index){
                return index===true
            },
            product(index){
                return index+' Sản phẩm'
            },
            equals(f,s){
                return f==s
            },
            nequals(f,s){
                return f!==s
            },
            check3(index){
                console.log(index);
                if((index===15)||(index===16)){
                    return true;
                }
                return false
            }
        },
    }));
    app.set('view engine', 'hbs');
    app.set('views', './views');
}