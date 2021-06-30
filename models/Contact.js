//Making the Schema for Contact
//we need to make a relation between contacts and user since each user has some contacts.
//so for every contact, we will also include the user that contact belongs to
const mongoose = require('mongoose');

//we need to establish a relationship between contact and user since each user has his own set of contacts. They all have thier each individual set.
//So 'user' will be part of schema and type will be an ObjectId i.e. the id of the user it is related with.
const ContactSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    default: 'Personal',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('contact', ContactSchema);
