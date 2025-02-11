const autoBind = require("auto-bind");
const express = require('express');
const app = express();
const logger = require('node-color-log');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');
const createError = require("http-errors");
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authRouts = require('../Modules/Auth/AuthRoute.js'); 
const UserModel = require("../Modules/User/model.js");
const { error } = require("console");

class App {

  constructor() {
    autoBind(this);
    this.configuration();
    this.swaggerConfig();
    this.dbConnection();
    this.routes();
    this.errorHandling();
  }

  swaggerConfig() {

    // Swagger
    app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(
      swaggerJsDoc({
        swaggerDefinition: {
          openapi: "3.0.0",
          info: {
            title: "NodeJs Divar",
            version: "2.0.0",
            description: "nodeJs App with mongoDB and ExpressJs",
            contact: {
              name: "Mehrzad Mahmodi",
              url: "https://mehrzad20061384.com",
              email: "mehrzad20061384@gmail.com",
            },
          },
          servers: [
            {
              url: "http://localhost:5000",
            },
          ],
          components: {
            securitySchemes: {
              BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              }
            }
          },
          security: [{ BearerAuth: [] }]
        },
        apis: ["./src/Modules/*/*.yaml"],
      }),
      { explorer: true },
    )
    );
  }

  configuration() {

    // morgan
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan("dev"));
    }

    // bodyParser
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());


    // cookieParser
    app.use(cookieParser());

    // session
    app.use(session({
      saveUninitialized: true,
      resave: false,
      secret: 'secret',
      cookie: { maxAge: 600000 }
    }));

    // Static
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // setView
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'app', 'views'));

    // express-fileUpload Middleware
    app.use(fileUpload());

  }


  async dbConnection() {

    try {

      mongoose.set('strictQuery', false);

      await mongoose.connect(process.env.MONGODB_URL);

      logger.color('blue').bold().log('db connected successfully');

    } catch (e) {

      logger.color('red').bold().log(`${e.message}`);
    }

  }


  routes() {

    app.use(authRouts);

    // app.use(HomeRoutes)

    app.listen(process.env.APP_PORT, logger.color("blue").bold().log(`Server listening on port ${process.env.APP_PORT}`));

  }


  errorHandling() {

    // 404
    app.use((req, res, next) => {
      return res.status(404).json({ message: `not found - ${req.originalUrl}`, error: "notFound" });
    });

    // Error 
    app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      return res.status(statusCode).json({
        statusCode,
        errors: {
          message,
        },
      });
    });

  }


}

module.exports = new App;