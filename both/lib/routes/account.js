//--------------------SIGN IN

Router.route('/signIn', function () {
  this.render('signIn');
  this.layout('blankLayout');
}, {
  name: "signIn",
  path: "/signIn",
  data: function () {
    if (Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});


//--------------------REGISTER

Router.route('/register', function () {
  this.render('signUp');
  this.layout('blankLayout');
}, {
  name: "signUp"
});

//--------------------PIN CODE LOCK PAGE

Router.route("/pinLock", {
  layoutTemplate: "blankLayout",
  name: "pinLock",
  path: "/pinLock",
  data: function () {
    return {
      backwardUrl: this.params.query.backwardUrl
    };
  }
});

//--------------------SWITCH USER

Router.route("/switchUser", {
  layoutTemplate: "blankLayout",
  name: "switchUser",
  template: "switchUserView",
  path: "/switchUser",
  waitOn: function () {
    var usersIds = Session.get("loggedUsers") || {};
    usersIds = _.keys(usersIds);
    return Meteor.subscribe("selectedUsersList", usersIds);
  }
});

// ---------------------ADMIN
Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('sections'),
      Meteor.subscribe("allAreas"),
      Meteor.subscribe('roles'),
      Meteor.subscribe("cronConfig"),
      Meteor.subscribe('usersList'),
      Meteor.subscribe('menuList')
    ];
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

// ---------------------USER PROFILE
Router.route('/user/profile/:_id', {
  name: "profile",
  path: "/user/profile/:_id",
  template: "profileMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("profileUser", this.params._id),
      Meteor.subscribe('shifts', 'future', this.params._id),
      Meteor.subscribe('shifts', 'opened'),
      Meteor.subscribe('sections')
    ];
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("profileUser", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

// --------------------INVITATION
Router.route('/invitations/:_id', function () {
  this.render('invitationAccept');
  this.layout('blankLayout');
}, {
  name: "invitationAccept",
  waitOn: function () {
    return Meteor.subscribe('invitationById', this.params._id);
  },
  data: function () {
    if (Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});