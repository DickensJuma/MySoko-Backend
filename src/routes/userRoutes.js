
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
router.get('/user/all', async (req, res) => {

   let result =[]
    try {
        const users = await User.find();

        // Exclude the password field from the response
         users.map((user) => {
            user.password = undefined;
            result.push(user)

            });

       res.status(200).json(result);
    } catch(error) {
        res.json({ message: error });
    }
    }
);

// Get a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password').exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          console.log(user);
        res.json(user);
    } catch(error) {
        return res.status(500).res.json({ message: error });
    }
    }
);

// Create a user
router.post('/user/register', async (req, res) => {

    // Check if phone number already exists
    console.log("I WAS CALLED REGISTER", req.body)

    const existingUser = await User.findOne({ phone_number: req.body.phone_number });
    if (existingUser) {
        return res.status(400).json({ message: 'Phone Number already exists' });
      }
  
console.log("I WAS CALLED REGISTER 2", existingUser)
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        full_name: req.body.full_name,
        phone_number: req.body.phone_number,
        password: hashedPassword,
        role: "user",
        shop_name: req.body.shop_name,
        shop_address: req.body.shop_address,
        referral_code: req.body.referral_code,
        status: true,
    });


    

    try {
        const savedUser = await user.save();
        console.log(savedUser)
        res.status(201).json({ message: 'User registered successfully', user: savedUser  });
    } catch(error) {
        console.error('Error registering user', error);
    res.status(500).json({ message: 'Failed to register user' });
    }

    }
);

//register a referrer
    router.post('/user/register-referrer', async (req, res) => {

        // Check if phone number already exists
        console.log("I WAS CALLED REGISTER", req.body)
        const existingUser = await User.findOne({ phone_number: req.body.phone_number });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone Number already exists' });
          }
      
    console.log("I WAS CALLED REFERAL", existingUser)
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //REFERRAL CODE

        const referral_code = req.body.full_name.substring(0, 3) + req.body.phone_number.substring(0, 3) + Math.floor(Math.random() * 10000);
        console.log("I WAS CALLED REFERAL", referral_code)
    
        const user = new User({
            full_name: req.body.full_name,
            phone_number: req.body.phone_number,
            password: hashedPassword,
            role: "referrer",
            shop_name: "",
            shop_address: "",
            referral_code: referral_code,
            status: true,

        });
    
    
        
    
        try {
            const savedUser = await user.save();
            console.log(savedUser)
            res.status(201).json({ message: 'User referral registered successfully', user: savedUser  });
        } catch(error) {
            console.error('Error registering user referral ', error);
        res.status(500).json({ message: 'Failed to register user' });
        }


    });

//login
router.post('/user/login', async (req, res) => {
    const { phone_number, password } = req.body;

    console.log( "I WAS CALLED LOGIN")
    try {

        const existingUser = await User.findOne({ phone_number: phone_number });
    if (!existingUser) {
        return res.status(400).json({ message: 'Phone Number does not exists' });
      }

      
      
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      
      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid password' });
        }
        if (existingUser.status == false) {
            return res.status(400).json({ message: 'User is inactive' });
            }
        
    const token = jwt.sign({ phone_number: existingUser.phone_number }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ token, role: existingUser.role, user: existingUser });
  } catch (error) {
    console.error('Error logging in user', error);
    res.status(500).json({ message: 'Failed to log in user' });
  }
});



// Update a user
router.put('/user/update/:userId', async (req, res) => {
    console.log("I WAS CALLED UPDATE", req.body)
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userId },
            { $set: {
                full_name: req.body.full_name,
                phone_number: req.body.phone_number,
                password: req.body.password,
                role: req.body.role,
                shop_name: req.body.shop_name,
                shop_address: req.body.shop_address,
                referral_code: req.body.referral_code,
                status: req.body.status,
            }}
        );
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch(error) {
        console.error('Error updating user', error);
    res.status(500).json({ message: 'Failed to updating user' });
    }
    }
);

// Delete a user
router.delete('/user/:userId', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.userId });
        res.json(removedUser);
    } catch(error) {
        res.json({ message: error });
    }
    }
);

module.exports = router;


