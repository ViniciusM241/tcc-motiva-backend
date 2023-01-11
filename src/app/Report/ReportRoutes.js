const adminAuth = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/reports',
    method: 'get',
    action: 'reports',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
