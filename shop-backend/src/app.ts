import express from 'express';
import ModelService from './model/model-service';
import Database from './database';
import DateService from './model/date-service';
import BackendChannel from './channel/backend-channel';
import UserService from './model/user/user-service';
import ProductService from './model/product/product-service';
import FrontendChannel from './channel/frontend-channel';
import OrderService from './model/order/order-service';

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

const database = new Database();

const userService = new UserService();
const productService = new ProductService();
const orderService = new OrderService();
const dateService = new DateService();

const frontendChannel = new FrontendChannel();
const backendChannel = new BackendChannel();

const model = new ModelService(
    database,
    userService,
    productService,
    orderService,
    dateService,
    frontendChannel,
    backendChannel
);

app.get('/', (req, res) => {
    res.send('Das ShopBackend');
});

app.post('/shop', (req, res) => {
    frontendChannel.handle(req, res);
});

app.post('/warehouse-shop', (req, res) => {
    backendChannel.handle(req, res);
});

app.listen(port as number, err => {
    if (err) {
        return console.error(`App: ${err}`);
    }
    return console.log(`App: server is listening on ${port}`);
});
