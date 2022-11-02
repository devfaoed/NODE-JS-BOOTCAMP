import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
import app from './app.js';

// tour model importation
import Tour from './model/tourModel.js';

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`natours server is listenning on ${port}`);
});
