const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

//After inlcuding the express.Router() as router, we will no longer do app.get or app.post, we will do router.get()/router.post()

// @route     GET api/contacts
// @desc      Get all users contacts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    //sort the contacts we got in desacening order of date using that "-1"
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    //instead of res.send, we can do res.json to send the data in json format.
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route     POST api/contacts
// @desc      add new contact
// @access   Private

//This => [auth, [check('name', 'Name is Required').not().isEmpty()]], is done to check if the fields entered are correct or not.
//here auth is the middleware
//We check these fiels before making a contact.
router.post(
  '/',
  [auth, [check('name', 'Name is Required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/contacts/:id
// @desc      Update Contact
// @access   Private
//with put we need an id => localhost:3000/api/contacts/7273
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    //Make Sure user owns contact
    if (contact.user.toString() != req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     Delete api/contacts/:id
// @desc      Delete Contact
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    //Make Sure user owns contact
    if (contact.user.toString() != req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Contact Removed' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
