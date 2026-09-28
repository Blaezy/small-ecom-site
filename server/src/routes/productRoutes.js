const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authenticate = require("../middlewares/authenticate");
const validateRequest = require("../middlewares/validateRequest");
const {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
} = require("../validators/productValidators");

router.post("/", authenticate, createProductValidator, validateRequest, createProduct);
router.get("/", getProducts);
router.get("/:id", idParamValidator, validateRequest, getProductById);
router.put("/:id", authenticate, idParamValidator, updateProductValidator, validateRequest, updateProduct);
router.delete("/:id", authenticate, idParamValidator, validateRequest, deleteProduct);

module.exports = router;
