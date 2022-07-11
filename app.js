/**
* Summary. This is the entry file
* Description. Initializes the environment port and routes of application modules
* @Author: Aashish Kumar
* @Created On: 02 July, 2022
*/
  
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import config from 'config';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
// Importing Module
import * as DB from './db/index.js';
import SwaggerJsDocs from './swagger-config.js';

// Admin 
// import admin_auth from './routes/admin/admin_auth.js';
// import admin_tutorial from './routes/admin/tutorials.js';
// import admin_feature from './routes/admin/fullfeatured.js';
// import admin_BestOfBoth from './routes/admin/bestofboth.js';
// import admin_resouce from './routes/admin/resources.js';
// import admin_language from './routes/admin/language.js';
// import admin_subscription from './routes/admin/subscription.js';
// import admin_faq from './routes/admin/faq.js';

//User 
import auth from './routes/auth.js';
// import tutorial from './routes/tutorials.js';
// import resource from './routes/resources.js';
// import bestofboth from './routes/bestofboth.js';

// import language from './routes/language.js'
// import Featured from './routes/featured.js'
// import Subscription from './routes/subscription.js'
// import faq from './routes/faq.js';

//Define Const
const __dirname = path.resolve();
const { superadmin } = config.get('PORTS');


const app = express();
// Access-Control-Allow-Origin
app.use(cors({ origin: '*' }));
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
// Passport Middleware
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(auth);

app.use((err, req, res, next) => {
    console.log('Error @ app ', err)
    next(err)
});
// Admin Routes
// app.use(admin_auth);
// app.use(admin_tutorial);
// app.use(admin_feature);
// app.use(admin_BestOfBoth);
// app.use(admin_resouce);
// app.use(admin_language);
// app.use(admin_subscription);
// app.use(admin_faq);
//Swagger UI setup for APIs
app.use('/api-spec', swaggerUi.serve, swaggerUi.setup(SwaggerJsDocs));
// Web Routes-
// app.use(tutorial);
// app.use(resource);
// app.use(bestofboth);
// app.use(language);
// app.use(Featured);
// app.use(Subscription);
// app.use(faq);
// Frontend 
// app.use(express.static(path.join(__dirname, 'dist/pixmagic')));
// Create MongoDB connection
DB.connection();
// Listen App
app.listen(superadmin, () => {
    console.log('Server listening on port ' + superadmin);
});

export default app;