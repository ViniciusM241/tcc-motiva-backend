const adminAuth = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/users',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/users',
    method: 'post',
    action: 'create',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
