const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//connect database
//brought in from db.js in the config folder.
//db.js is the file where we will use mongoose to connect to our database.
connectDB();

// Init Middleware
//This used to be 3rd party and we had to install body-parser but now we can fetch dara from post request just like that only.
//So by doing this, we can now accept data/body-data.
app.use(express.json({ extended: false }));

//Define Routes
//bring the routes in server.js.
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set Static Folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
