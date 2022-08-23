const adminAuth = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/admins',
    method: 'post',
    action: 'create',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/admins',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/admins/profile',
    method: 'get',
    action: 'profile',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/admins/:id/notifications',
    method: 'get',
    action: 'showNotifications',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
