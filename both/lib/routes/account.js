Router.route('signIn', {
  path: '/signIn',
  layoutTemplate: 'blankLayout',
  template: 'signIn',
  data: function () {
    if (Meteor.userId()) {
      Router.go('/');
    }
  }
});


Router.route('signUp', {
  path: '/register',
  layoutTemplate: 'blankLayout',
  template: 'signUp',
  data: function () {
    if (Meteor.userId()) {
      Router.go('/');
    }
  }
});


Router.route('logout', {
  'path': '/logout',
  action: function () {
    StaleSession.pinLockManager._removeTokenById(Meteor.userId());
    Meteor.logout();
    Router.go('/');
  }
});


Router.route('profile', {
  path: '/user/profile/:_id',
  template: 'profileMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('profileUser', this.params._id),
      Meteor.subscribe('shifts', 'future', this.params._id, currentAreaId),
      Meteor.subscribe('shifts', 'opened', null, currentAreaId),
      Meteor.subscribe('sections', currentAreaId)
    ];
  }
});


Router.route('forgotPassword', {
  path: '/forgotPassword',
  layoutTemplate: 'blankLayout',
  template: 'forgotPassword'
});


Router.route('switchUser', {
  path: '/switchUser',
  layoutTemplate: 'blankLayout',
  template: 'switchUserView',
  waitOn: function () {
    return Meteor.subscribe('selectedUsersList', StaleSession.pinLockManager.getStoredUsersIds());
  },
  data: function () {
    StaleSession.pinLockManager.lockWithPin();
    return {
      users: Meteor.users.find({_id: {$in: StaleSession.pinLockManager.getStoredUsersIds()}})
    };
  }
});


Router.route('pinLock', {
  path: '/pin-lock/:userId',
  layoutTemplate: 'blankLayout',
  template: 'pinLock',
  waitOn: function () {
    return Meteor.subscribe('profileUser', this.params.userId);
  },
  data: function () {
    return {
      userId: this.params.userId,
      backwardUrl: this.params.query.backwardUrl
    };
  }
});