const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getLists,
  createList,
  updateHabitList,
  deleteHabitList,
} = require("../controllers/habitListController");

router.get("/", auth, getLists);
router.post("/", auth, createList);
router.patch("/:id",auth,updateHabitList);
router.delete("/:id",auth,deleteHabitList);

module.exports = router;