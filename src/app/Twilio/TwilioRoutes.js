module.exports = [
  {
    path: '/messages',
    method: 'post',
    action: 'routerTwilioMessages',
  },
  {
    path: '/messages-schedule-callback/:id',
    method: 'post',
    action: 'scheduleMessageCallback',
  },
  {
    path: '/messages-callback',
    method: 'post',
    action: 'messageCallback',
  },
];
