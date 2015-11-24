Router.route('signIn', {
  path: '/signIn',
  layoutTemplate: 'blankLayout',
  template: 'signIn',
  data: function () {
    if (Meteor.userId()) {
      Router.go('/');
    }
    Session.set('editStockTake', false);
  }
});


Router.route('signUp', {
  path: '/register',
  layoutTemplate: 'blankLayout',
  template: 'signUp'
});


Router.route('pinLock', {
  path: '/pinLock/:userId',
  layoutTemplate: 'blankLayout',
  template: 'pinLock',
  waitOn: function () {
    return Meteor.subscribe('profileUser', this.params.userId);
  },
  data: function () {
    return {
      backwardUrl: this.params.query.backwardUrl
    };
  }
});

Router.route('logout', {
  'path': '/logout',
  data: function () {
    return Meteor.logout();
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
    Session.set('editStockTake', false);
  }
});


Router.route('switchUser', {
  path: '/switchUser',
  layoutTemplate: 'blankLayout',
  template: 'switchUserView',
  waitOn: function () {
    var usersIds = Session.get('loggedUsers') || {};
    usersIds = _.keys(usersIds);
    return Meteor.subscribe('selectedUsersList', usersIds);
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
  },
  data: function () {
    Session.set('profileUser', this.params._id);
    Session.set('editStockTake', false);
  }
});