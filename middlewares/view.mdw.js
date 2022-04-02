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
            time(val){
                return moment(val).format('DD-MM-YYYY')
            },

        },
    }));
    app.set('view engine', 'hbs');
    app.set('views', './views');
}