//console.log("Hello World");
import express from 'express';
import dotenv from 'dotenv';

import { mainrouter } from './server/routes/main.js';
import expressEjsLayouts from 'express-ejs-layouts';
import connectDB from './server/config/db.js';
import { adminRoute } from './server/routes/admin.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import methodOverride from 'method-override';
import { fetchUser, routeUrl,isActiveRoute } from './server/helper/routehelper.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(methodOverride('_method'));
connectDB();

/* app.get('/',(req,res)=>{
    res.send("Hello World");
}) */
app.locals.isActiveRoute = isActiveRoute;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

app.use(expressEjsLayouts);
app.use('/',mainrouter);
app.use('/admin',adminRoute);
app.set('layout','./layouts/main');

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

