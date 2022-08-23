const adminAuth = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/phrases',
    method: 'post',
    action: 'create',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/phrases',
    method: 'get',
    action: 'show',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
