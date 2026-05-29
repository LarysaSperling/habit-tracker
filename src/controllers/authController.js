export const register = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Register user"
  });
};

export const login = async (req, res) => {
  res.json({
    success: true,
    message: "Login user"
  });
};

export const getAuthUser = async (req, res) => {
  res.json({
    success: true,
    message: "Protected route"
  });
};