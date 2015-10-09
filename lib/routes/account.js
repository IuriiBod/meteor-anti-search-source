//--------------------SIGN IN

Router.route('/signIn', function() {
  this.render('signIn');
  this.layout('blankLayout');
}, {
  name: "signIn",
  path: "/signIn",
  data: function() {
    if(Meteor.userId()) {
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
  data: function() {
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
  waitOn: function() {
    var usersIds = Session.get("loggedUsers") || {};
    usersIds = _.keys(usersIds);
    return subs.subscribe("selectedUsersList", usersIds);
  }
});

// ---------------------ADMIN
Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminMainView",
  waitOn: function() {
    return [
      subs.subscribe("allSections"),
      subs.subscribe("allAreas"),
      subs.subscribe('roles'),
      subs.subscribe("cronConfig")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.isManager()) {
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
  waitOn: function() {
    return [
      subs.subscribe("profileUser", this.params._id),
      subs.subscribe("rosteredFutureShifts", this.params._id),
      subs.subscribe("openedShifts"),
      subs.subscribe("allSections")
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
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
  waitOn: function() {
    return Meteor.subscribe('invitationById', this.params._id);
  },
  data: function() {
    if(Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});