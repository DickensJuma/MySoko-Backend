const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  product_price: {
    type: String,
    required: [true, "Please provide a product price"],
  },
  product_description: {
    type: String,
    required: [true, "Please provide a product description"],
  },
  product_image: {
    type: String,
    required: [true, "Please provide a product image"],
  },
  product_category: [
    {
      type: String,
    },
  ],
  product_quantity: {
    type: String,
    required: [true, "Please provide a product quantity"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  moq: {
    type: String,
    required: [true, "Please provide a product moq"],
    },
    
});

module.exports = mongoose.model("Product", ProductSchema);
