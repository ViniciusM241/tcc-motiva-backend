const authAdmin = require('../../middlewares/adminAuth');

module.exports = [
  {
    path: '/pensador-quotes',
    action: 'show',
    method: 'get',
    beforeMiddlewares: [
      authAdmin,
    ]
  },
];
