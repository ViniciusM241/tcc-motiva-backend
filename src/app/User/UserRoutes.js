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
  {
    path: '/users/search',
    method: 'get',
    action: 'search',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/users/:id/chat',
    method: 'get',
    action: 'chat',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
