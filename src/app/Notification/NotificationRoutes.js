const adminAuth = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/notifications',
    method: 'post',
    action: 'create',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/notifications',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/notifications/:id',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
