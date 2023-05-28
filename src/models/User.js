const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    phone_number: {
        type: String,
        required: [true, "Please provide a phone number"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    shop_name: {
        type: String,
        required: [false, "Please provide a shop name"],
    },
    shop_address: {
        type: String,
        required: [false, "Please provide a shop address"],
    },
    
});


module.exports = mongoose.model("User", UserSchema);