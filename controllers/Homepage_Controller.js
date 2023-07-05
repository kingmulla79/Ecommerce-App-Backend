const Cart = require("../models/Cart");
const Product = require("../models/Products");
const UserDetails = require("../models/UserDetails");
const Orders = require("../models/Orders");
const path = require("path");

const Homepage_User_Profile = async (req, res) => {
  await Orders.find({ user: req.user })
    .then((orders) => {
      let cart;
      orders.forEach(function (order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.status(200).json({
        success: true,
        message: "Cart details successfully fetched",
        orders: orders,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Try login in to view your profile",
        error,
      });
    });
};

const Homepage_Upload_Profile_Pic = async (req, res) => {
  const user = req.user;

  if (!user)
    return res.status(401).json({
      success: false,
      message: "unauthorized access",
    });
  try {
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const profile_pic = fileUrl;
    console.log(profile_pic);

    await UserDetails.findByIdAndUpdate(user._id, { profile_pic });
    res.status(201).json({
      success: true,
      message: "Your profile has been updated",
    });
  } catch (error) {
    console.log("Error while uploading the message", error);
    res.status(500).json({
      success: false,
      message:
        "Server Error: error while uploading the message. Try again after some time",
      error: error,
    });
  }
};

const HomePage_Add_To_Cart = async (req, res) => {
  try {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    await Product.findById(productId)
      .then((result) => {
        cart.add(result, result._id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.status(200).json({
          success: true,
          message: `The item has been successfully added to cart`,
        });
      })
      .catch((error) => {
        res.status(401).json({
          success: false,
          message:
            "Could not find the products provided in the products collection",
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: error while adding item to cart",
      error: error,
    });
  }
};

const Homepage_Reduce_Cart_Items = (req, res) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  console.log(req.session.cart);
  res.status(200).json({
    success: true,
    message: `The items reduction operation from the cart was successful`,
    redirect: req.session.oldURL,
  });
};

const Homepage_Remove_Items = (req, res) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  console.log(req.session.cart);
  res.status(200).json({
    success: true,
    message: `The item selected was successfully removed from the cart`,
    redirect: req.session.oldURL,
  });
};

const HomePage_Shopping_Cart_Details = (req, res) => {
  if (!req.session.cart) {
    res.status(200).json({
      success: true,
      message: `No shopping cart session: No items in the shopping cart`,
    });
  }
  let cart = new Cart(req.session.cart);
  res.status(201).json({
    success: true,
    message: `A shopping cart session exists`,
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
};

const Homepage_Checkout = async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;
  if (!req.session.cart) {
    res.status(401).json({
      success: false,
      message: `No shopping cart available`,
    });
  }
  var cart = new Cart(req.session.cart);

  const Order = new Orders({
    user: req.user,
    cart: cart,
    address: req.body.address,
    date: formattedToday,
    name: req.body.name,
  });
  Order.save()
    .then((result) => {
      console.log("Order details successfully saved");
      req.session.cart = null;
      res.status(201).json({
        success: true,
        message: "The payment is successfully made",
        result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: "An error occured while saving the order details",
      });
    });
};
const Homepage_All_Products = async (req, res) => {
  try {
    await Product.find().then((result) => {
      if (result.length > 0) {
        res.status(201).json({
          products: result,
          success: true,
          message: "All the products have been successfully fetched",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "There are no products stored yet",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: error while fetching product information",
      error: error,
    });
  }
};

module.exports = {
  Homepage_User_Profile,
  Homepage_Upload_Profile_Pic,
  HomePage_Add_To_Cart,
  Homepage_Reduce_Cart_Items,
  Homepage_Remove_Items,
  HomePage_Shopping_Cart_Details,
  Homepage_Checkout,
  Homepage_All_Products,
};
