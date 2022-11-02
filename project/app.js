// importing dependency
import express from 'express';
const app = express();

import ejs from 'ejs';
import fetch from 'node-fetch';

// setting up middleware
app.use(express.json());

app.set('view engine', 'ejs');

// declaring routes

// index route
app.get('/', async (req, res) => {
  try {
    res.redirect('/index');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get('/index', async (req, res) => {
  try {
    const response = await fetch('https://dog.ceo/api/breed/hound/images');
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`server is listenning on port 2000`);
});
