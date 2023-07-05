const Product = require("../models/Products");
const Orders = require("../models/Orders");
const path = require("path");

const Admin_Dashboard_Page = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Dashboard details`,
  });
};
const Admin_Add_Product = async (req, res) => {
  try {
    const item = new Product({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      product_photo: req.body.product_photo,
    });

    item
      .save()
      .then((result) => {
        console.log("Successful entry");
        res.status(201).json({
          success: true,
          message: "Successful entry",
          redirect: "/api/auth/dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          success: false,
          message: "Error in entry process.Try again",
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "The item entry attempt failed",
      error: error,
    });
  }
};

const Admin_Update_Item = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .then((result) => {
      if (!result) {
        res.status(404).json({
          success: false,
          message: "The product record was not updated",
        });
      }
      res.status(200).json({
        success: true,
        message: `The product data is successfully updated`,
        result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "The product update attempt failed",
        error: error,
      });
    });
};

const Admin_Delete_Item = async (req, res) => {
  try {
    const { id } = req.params;

    Product.find({ _id: id })
      .then((result) => {
        console.log(`Item record exists`);
        if (result.length > 0) {
          Product.deleteOne({ _id: id })
            .then(() => {
              res.status(201).json({
                success: true,
                message: `Item sucessfully deleted`,
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json({
                success: false,
                message: "An error occured while deleting item details",
                error,
              });
            });
        } else {
          // item details don't exist
          res.status(400).json({
            success: false,
            message:
              "The item record doesn't exist or has already been deleted",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "The Id provided is invalid",
          error,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: error while deleting item",
      error: error,
    });
  }
};

const Admin_Order_Details = async (req, res) => {
  try {
    await Orders.findById(req.params.id).then((result) => {
      if (result) {
        res.status(201).json({
          success: true,
          message: "The order details have been successfully fetched",
          result,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "There is no order recorded with the specified id",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: error while fetching order information",
      error: error,
    });
  }
};

const Admin_All_Orders = async (req, res) => {
  try {
    let totalPrice = 0;
    await Orders.find().then((result) => {
      if (result.length > 0) {
        result.forEach((order) => {
          totalPrice += order.cart.totalPrice;
        });
      }
      console.log(result);
      res.status(201).json({
        totalPrice,
        orders: result,
        success: true,
        message: "All the products have been successfully fetched",
      });
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
  Admin_Dashboard_Page,
  Admin_Add_Product,
  Admin_Update_Item,
  Admin_Delete_Item,
  Admin_Order_Details,
  Admin_All_Orders,
};
