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
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});

// ---------------------USER PROFILE
Router.route('/user/profile/:_id', {
  name: "profile",
  path: "/user/profile/:_id",
  template: "profileMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe("profileUser", this.params._id),
      Meteor.subscribe('shifts', 'future', this.params._id, currentAreaId),
      Meteor.subscribe('shifts', 'opened', null, currentAreaId),
      Meteor.subscribe('sections', currentAreaId)
    ];
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("profileUser", this.params._id);
    Session.set("editStockTake", false);
  }
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