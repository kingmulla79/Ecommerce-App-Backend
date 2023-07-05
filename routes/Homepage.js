const express = require("express");
const router = express.Router();
const Homepage_Controllers = require("../controllers/Homepage_Controller");
const { isAuth, isVerified } = require("../middleware/Auth");

const uploads = require("../multer");

router.get(
  "/user-profile",
  isAuth,
  isVerified,
  Homepage_Controllers.Homepage_User_Profile
);

router.post(
  "/upload-profile-pic",
  isAuth,
  isVerified,
  uploads.single("profile_pic"),
  Homepage_Controllers.Homepage_Upload_Profile_Pic
);
router.get(
  "/add-to-cart/:id",
  isAuth,
  isVerified,
  Homepage_Controllers.HomePage_Add_To_Cart
);

router.get(
  "/reduce-cart-items/:id",
  isAuth,
  isVerified,
  Homepage_Controllers.Homepage_Reduce_Cart_Items
);
router.get(
  "/remove-item/:id",
  isAuth,
  isVerified,
  Homepage_Controllers.Homepage_Remove_Items
);

router.get(
  "/shopping-cart",
  isAuth,
  isVerified,
  Homepage_Controllers.HomePage_Shopping_Cart_Details
);
router.post(
  "/checkout",
  isAuth,
  isVerified,
  Homepage_Controllers.Homepage_Checkout
);

router.get(
  "/all-products",
  isAuth,
  isVerified,
  Homepage_Controllers.Homepage_All_Products
);
module.exports = router;
