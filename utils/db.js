import fn from "knex";
import dotenv from "dotenv";
const PROCESS = dotenv.config()
const knex = fn({
    client: 'mysql2',
    connection: {
        host: PROCESS.parsed.PRO_DB_HOST,
        user: PROCESS.parsed.PRO_DB_USER,
        password: PROCESS.parsed.PRO_DB_PASSWORD,
        database: PROCESS.parsed.PRO_DB_NAME,
        port: PROCESS.parsed.PRO_DB_PORT,
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
