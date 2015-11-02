Router.route('signIn', {
  path: '/signIn',
  layoutTemplate: 'blankLayout',
  template: 'signIn',
  onBeforeAction: function () {
    if (Meteor.userId()) {
      Router.go('/');
    } else {
      this.next();
    }
  },
  data: function () {
    Session.set('editStockTake', false);
  }
});


Router.route('signUp', {
  path: '/register',
  layoutTemplate: 'blankLayout',
  template: 'signUp'
});


Router.route('pinLock', {
  path: '/pinLock',
  layoutTemplate: 'blankLayout',
  template: 'pinLock',
  data: function () {
    return {
      backwardUrl: this.params.query.backwardUrl
    };
  }
});

Router.route('invitationAccept', {
  path: '/invitations/:_id',
  layoutTemplate: 'blankLayout',
  template: 'invitationAccept',
  waitOn: function () {
    return Meteor.subscribe('invitationById', this.params._id);
  },
  onBeforeAction: function () {
    if (Meteor.userId()) {
      Router.go('/');
    } else {
      this.next();
    }
  },
  data: function () {
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


Router.route('admin', {
  path: '/admin',
  template: "adminMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('allAreas', currentAreaId),
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('locationsOfOrganization'),
      Meteor.subscribe('areasOfOrganization'),
      Meteor.subscribe('menuList', currentAreaId)
    ];
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    Session.set('editStockTake', false);
  }
});

Router.route('/user/profile/:_id', {
  name: 'profile',
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