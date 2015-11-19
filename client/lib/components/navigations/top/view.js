Template.topNavbar.events({
  'click #navbar-minimalize': function (event, tmpl) {
    var forceShow = 'force-show-sidebar ', forceHide = 'force-hide-sidebar';
    var body = $('#wrapper');
    if (body.is('.' + forceHide)) {
      body.removeClass(forceHide).addClass(forceShow);
    } else {
      body.removeClass(forceShow).addClass(forceHide);
    }
  },

  'click #signInButton': function (event) {
    event.preventDefault();
    Router.go("signIn");
  },

  'click #signOutButton': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go("signIn");
  },

  'click .notifi-toggler': function () {
    FlyoutManager.open('notifiFlyout', {}, true);
  },

  'click .organization-structure-flyout': function () {
    FlyoutManager.open('organizationStructure', {}, true);
  },

  'click .user-unavailabilities-flyout': function () {
    FlyoutManager.open('userUnavailability', {}, true);
  }
});

Template.topNavbar.helpers({
  'profileImage': function () {
    var user = Meteor.user();
    var image = '/images/user-image.jpeg';
    if (user && user.services) {
      if (user.services.google) {
        image = user.services.google.picture;
      }
    }
    return image;
  },

  today: function () {
    return moment(new Date()).format("YYYY-MM-DD");
  },

  week: function () {
    return moment().format("w");
  }
});

Template.topNavbar.created = function () {
  this.showCreateOrgFlyout = new ReactiveVar();
  this.autorun(_.bind(function () {
    this.showCreateOrgFlyout.set(false);
  }, this));
};