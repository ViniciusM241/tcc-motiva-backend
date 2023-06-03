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
  {
    path: '/phrases/:id',
    method: 'get',
    action: 'getById',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
    {
    path: '/phrases/:id',
    method: 'put',
    action: 'update',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/phrases/search',
    method: 'get',
    action: 'search',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
  {
    path: '/phrases/:id',
    method: 'delete',
    action: 'delete',
    beforeMiddlewares: [
      adminAuth,
    ],
  },
];
