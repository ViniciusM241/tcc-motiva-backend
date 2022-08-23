const jwt = require('jsonwebtoken');
const AdminModel = require('../app/Admin/AdminModel').default;
const Error = require('../bootstrap/Error');

module.exports = (req, res, next) => {
  const adminModel = new AdminModel().sequelize();
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new Error('No token provided', 401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    try {
      if (err) throw new Error('Invalid token', 401);

      const admin = await adminModel.findByPk(decoded.userId, { raw: true });

      if (!admin) throw new Error('User not found', 401);

      req.user = admin;
      next();

    } catch(err) {
      next(err);
    }
  });

}
