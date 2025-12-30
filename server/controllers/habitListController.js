const HabitList = require("../models/HabitList");
const HabitItem = require("../models/HabitItem"); // ✅ REQUIRED

// GET all lists
exports.getLists = async (req, res) => {
  const lists = await HabitList.find({ userId: req.user.id });
  res.json(lists);
};

// CREATE list
exports.createList = async (req, res) => {
  const list = await HabitList.create({
    userId: req.user.id,
    title: req.body.title,
  });

  res.status(201).json(list);
};

// UPDATE list title ✅ FIXED
exports.updateHabitList = async (req, res) => {
  try {
    const list = await HabitList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // ✅ FIX
      { title: req.body.title },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE list + its items ✅ FIXED
exports.deleteHabitList = async (req, res) => {
  try {
    await HabitItem.deleteMany({ listId: req.params.id });

    await HabitList.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // ✅ FIX
    });

    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};