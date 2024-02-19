import cookieParser from 'cookie-parser';
import http, { type Server as HttpServer } from 'http';
import https, { type ServerOptions, Server as HttpsServer } from 'https';
import { Server as SocketIo } from 'socket.io';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { type NextFunction, type Request, type Response } from 'express';
import eSession, { type SessionOptions } from 'express-session';
import RedisStoreConnection from 'connect-redis';
const RedisStore = RedisStoreConnection(eSession);

/* // ? import Constants */
import CookiesProps from '@constants/cookies';

/* //? import services */
import RedisServices from '@services/redis';
const redisConnection = new RedisServices();
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(CookiesProps.secret));
app.use(eSession({
    store: new RedisStore({ client: redisConnection.subscriber as any }),
    ...CookiesProps,
    resave: false,
    saveUninitialized: false,
} as SessionOptions))

let server: HttpServer | HttpsServer;
server = server = http.createServer(app);
const socketIO = new SocketIo(server);

export { app, server, socketIO };