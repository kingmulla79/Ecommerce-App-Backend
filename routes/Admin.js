const express = require("express");
const router = express.Router();
const AdminControllers = require("../controllers/Admin");
const { isAuth, isVerified, isAdmin } = require("../middleware/Auth");
const {
  validateProductDetails,
  productValidation,
} = require("../middleware/validation/Products");
const uploads = require("../multer");

router.get(
  "/",
  isAuth,
  isVerified,
  isAdmin,
  AdminControllers.Admin_Dashboard_Page
);
router.post(
  "/add-product",
  validateProductDetails,
  productValidation,
  isAuth,
  isVerified,
  isAdmin,
  uploads.single("product_photo"),
  AdminControllers.Admin_Add_Product
);
router.patch(
  "/update-product-data/:id",
  isAuth,
  isVerified,
  isAdmin,
  AdminControllers.Admin_Update_Item
);
router.delete(
  "/delete-product/:id",
  isAuth,
  isVerified,
  isAdmin,
  AdminControllers.Admin_Delete_Item
);
router.get(
  "/orders/:id",
  isAuth,
  isVerified,
  isAdmin,
  AdminControllers.Admin_Order_Details
);

router.get(
  "/all-orders",
  isAuth,
  isVerified,
  isAdmin,
  AdminControllers.Admin_All_Orders
);

module.exports = router;
