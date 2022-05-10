import cookieParser from 'cookie-parser'
import connectFlash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import MySQLStore from 'express-mysql-session'
export default function (app){
    app.use(cookieParser('secret'));
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 10800000},
        store: new MySQLStore({
            connectionLimit: 100,
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'realestate123',
            charset: 'utf8mb4_general_ci',
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'session_id',
                    expires: 'expires',
                    data: 'data'
                }
            }
        }),
    }))
    app.use(connectFlash())
    app.use(passport.initialize())
    app.use(passport.session())
}
//
// store: new MySQLStore({
//     connectionLimit: 100,
//     host: 'us-cdbr-east-05.cleardb.net',
//     user: 'b8e5dbe7be1f41',
//     password: 'bbb92f05',
//     database: 'heroku_59394531068dea2',
//     charset: 'utf8mb4_general_ci',
//     schema: {
//         tableName: 'sessions',
//         columnNames: {
//             session_id: 'session_id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// }),

// store: new MySQLStore({
//     connectionLimit: 100,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'realestate',
//     charset: 'utf8mb4_general_ci',
//     schema: {
//         tableName: 'sessions',
//         columnNames: {
//             session_id: 'session_id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// }),