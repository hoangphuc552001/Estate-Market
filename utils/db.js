import fn from "knex";
const knex = fn({
    client: 'mysql2',
    connection: {
<<<<<<< HEAD
        host : 'localhost',
        user : 'root',
        port:3306,
        password : '',
        database : 'realestate'
=======
        host : '127.0.0.1',
        user : 'root',
        password : '123456',
        database : 'realstate'
>>>>>>> parent of 82e5055 (Merge branch 'main' of https://github.com/hoangphuc552001/Estate-Market)
    },
    pool: { min: 0, max: 10 },
});
export default knex;
// host : 'us-cdbr-east-05.cleardb.net',
//     user : 'b8e5dbe7be1f41',
//     password : 'bbb92f05',
//     database : 'heroku_59394531068dea2'


/*
const knex = fn({
    client: 'mysql2',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '123456',
        database : 'realstate'
    },
    pool: { min: 0, max: 10 },
});*/
