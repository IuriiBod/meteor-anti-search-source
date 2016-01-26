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
    StaleSession._removeTokenById(Meteor.userId());
    Meteor.logout();
  }
});

Router.route('invitationAccept', {
  path: '/invitations/:_id',
  layoutTemplate: 'blankLayout',
  template: 'invitationAccept',
  waitOn: function () {
    return Meteor.subscribe('invitationById', this.params._id);
  },
  data: function () {
    if (Meteor.userId()) {
      Router.go('/');
    }
  }
});


Router.route('switchUser', {
  path: '/switchUser',
  layoutTemplate: 'blankLayout',
  template: 'switchUserView',
  waitOn: function () {
    return Meteor.subscribe('selectedUsersList', StaleSession.getStoredUsersIds());
  },
  data: function () {
    StaleSession._lockWithPin();
    return {
      users: Meteor.users.find({_id: {$in: StaleSession.getStoredUsersIds()}})
    };
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
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('userAllLeaveRequests', this.params._id)
    ];
  }
});


Router.route('forgotPassword', {
  path: '/forgotPassword',
  layoutTemplate: 'blankLayout',
  template: 'forgotPassword'
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