export const createHabit = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Create habit"
  });
};

export const getHabits = async (req, res) => {
  res.json({
    success: true,
    message: "Get all habits"
  });
};

export const getHabitById = async (req, res) => {
  res.json({
    success: true,
    message: `Get habit ${req.params.id}`
  });
};

export const updateHabit = async (req, res) => {
  res.json({
    success: true,
    message: `Update habit ${req.params.id}`
  });
};

export const deleteHabit = async (req, res) => {
  res.json({
    success: true,
    message: `Delete habit ${req.params.id}`
  });
};

export const completeHabit = async (req, res) => {
  res.json({
    success: true,
    message: `Complete habit ${req.params.id}`
  });
};