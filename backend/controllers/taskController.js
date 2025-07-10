const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, status, startDate, endDate } = req.body;

  try {
    const task = new Task({
      user: req.user._id,
      title,
      description,
      status,
      startDate,
      endDate,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
