import express from 'express';
import FrontendChannel from './channel/frontend-channel';
import ModelService from './model/model-service';
import DateService from './model/date-service';
import UserService from './model/user/user-service';
import PalletService from './model/pallet/pallet-service';
import Database from './database';
import BackendChannel from './channel/backend-channel';
import OrderService from './model/order/order-service';

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const database = new Database();

const dateService = new DateService();
const userService = new UserService();
const palletService = new PalletService();
const orderService = new OrderService();

const frontendChannel = new FrontendChannel();
const backendChannel = new BackendChannel();

const model = new ModelService(
    database,
    palletService,
    userService,
    orderService,
    dateService,
    frontendChannel,
    backendChannel
);

app.get('/', (req, res) => {
    res.send('Das WarehouseBackend');
});

app.post('/warehouse', (req, res) => {
    frontendChannel.handle(req, res);
});

app.post('/shop-warehouse', (req, res) => {
    backendChannel.handle(req, res);
});

app.listen(port as number, err => {
    if (err) {
        return console.error(`App: ${err}`);
    }
    return console.log(`App: server is listening on ${port}`);
});


