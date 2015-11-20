Router.route('notificationAction', {
  path: '/notification-action',
  template: 'notificationAction',
  waitOn: function () {
    return this.subscribe('organizationInfo');
  }
});