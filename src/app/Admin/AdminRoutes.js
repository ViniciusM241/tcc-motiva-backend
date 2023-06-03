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
    path: '/admins/:id',
    method: 'put',
    action: 'update',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/admins/:id',
    method: 'delete',
    action: 'delete',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/admins/search',
    method: 'get',
    action: 'search',
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
    path: '/admins/:id',
    method: 'get',
    action: 'getById',
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
  {
    path: '/admins/:id/notifications/:notificationId',
    method: 'put',
    action: 'viewNotification',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
