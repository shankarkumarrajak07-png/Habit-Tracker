const HabitItem = require("../models/HabitItem");

exports.getItemsByList = async (req, res) => {
  const items = await HabitItem.find({ listId: req.params.listId });
  res.json(items);
};

exports.createItem = async (req, res) => {
  const item = await HabitItem.create({
    listId: req.body.listId,
    title: req.body.title,
  });
  res.status(201).json(item);
};

exports.toggleItem = async (req, res) => {
  const item = await HabitItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.completed = !item.completed;
  await item.save();
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  await HabitItem.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

exports.updateItem = async (req, res) => {
  const item = await HabitItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.title = req.body.title;
  await item.save();

  res.json(item);
};