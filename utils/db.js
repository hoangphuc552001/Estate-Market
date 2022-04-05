import fn from "knex";
const knex = fn({
    client: 'mysql2',
    connection: {
        host : 'eu-cdbr-west-02.cleardb.net',
        user : 'b578708cb52153',
        password : '9f09c024',
        database : 'heroku_eaea1e6277d01c8'
    },
    pool: { min: 0, max: 10 },
});
export default knex;