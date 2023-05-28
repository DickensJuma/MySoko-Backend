const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRoutes");
const orderRouter = require("./src/routes/orderRoutes");
const morgan = require('morgan');
const dotenv = require("dotenv");

const { createLogger, format, transports } = require("winston");
 


dotenv.config();

const app = express();
const port = process.env.PORT || 8080;



const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dickens:ugPUWKvrnAuiTs8@cluster0.yeyah.mongodb.net/soko?retryWrites=true&w=majority",
      );
      console.log("Connected to MongoDB")
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  start();
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // log only 4xx and 5xx responses to console
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }))

  const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console({})],
  });

    app.use((req, res, next) => {
        logger.info("Request received", {
            method: req.method,
            url: req.url,
            query: req.query,
            body: req.body,
        });
        next();
    });

    //health check
    app.get('/health', (req, res) => {
        res.status(200).json({ message: 'Server is up and running' });
    });
    
  app.use('/api', userRouter);
  app.use('/api', productRouter);
  app.use('/api', orderRouter);

 

  
  app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});