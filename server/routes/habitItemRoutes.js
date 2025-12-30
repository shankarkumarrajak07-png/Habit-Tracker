const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getItemsByList,
  createItem,
  toggleItem,
  deleteItem,
  updateItem,
} = require("../controllers/habitItemController");

router.get("/:listId", auth, getItemsByList);
router.post("/", auth, createItem);
router.patch("/:id/toggle", auth, toggleItem);
router.delete("/:id", auth, deleteItem);
router.patch("/:id",auth,updateItem);

module.exports = router;