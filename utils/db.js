import fn from "knex";
const knex = fn({
    client: 'mysql2',
    connection: {
    host : 'localhost',
    user : 'root',
    port:3306,
    password : '123456',
    database : 'realestate2'
    },
    pool: { min: 0, max: 10 },
});
export default knex;
// host : 'us-cdbr-east-05.cleardb.net',
//     user : 'b8e5dbe7be1f41',
//     password : 'bbb92f05',
//     database : 'heroku_59394531068dea2'

// host : 'localhost',
//     user : 'root',
//     port:3306,
//     password : '',
//     database : 'realestate'




/*host : 'localhost',
    user : 'root',
    port:3306,
    password : '123456',
    database : 'realstate'
},*/
