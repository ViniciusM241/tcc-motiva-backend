const adminAuth = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/notification-messages',
    method: 'post',
    action: 'create',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/notification-messages',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/notification-messages/:id',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
