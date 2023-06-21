const Product = require("../models/Products");
const path = require("path");

const Admin_Dashboard_Page = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Dashboard details`,
  });
};
const Admin_Add_Products = async (req, res) => {
  try {
    const { name, desc, category, price } = req.body;
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const product_photo = fileUrl;
    console.log(product_photo);
    const ProductDetails = await new Product({
      name,
      desc,
      category,
      price,
      product_photo,
    })
      .save()
      .then((result) => {
        res.status(200).json({
          success: true,
          message: `The product details successfully saved`,
        });
      })
      .catch((error) => {
        res.status(401).json({
          success: false,
          message: `The product entry attempt failed`,
          error,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "The product enrty attempt failed",
      error,
    });
  }
};

module.exports = { Admin_Dashboard_Page, Admin_Add_Products };
