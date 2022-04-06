import fn from "knex";
const knex = fn({
    client: 'mysql2',
    connection: {
        host : 'localhost',
        user : 'root',
        port:3306,
        password : '',
        database : 'realestate'
    },
    pool: { min: 0, max: 10 },
});
export default knex;