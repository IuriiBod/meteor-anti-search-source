Template.topNavbar.rendered = function () {
  $('html')
    .click(function (event) {
      var flyout = $(".flyout-notifi-container");
      if (!flyout.is(event.target) && flyout.has(event.target).length === 0) {
        flyout.removeClass('show');
      }
    })
    .click(function (event) {
      var flyout = $(".flyout-container");
      var createOrganization = $('.create-organization');
      if ((!flyout.is(event.target) && flyout.has(event.target).length === 0) && (!createOrganization.is(event.target) && createOrganization.has(event.target).length === 0)) {
        flyout.removeClass('show');
      }
    });
};

Template.topNavbar.events({
  'click #navbar-minimalize': function (event, tmpl) {
    var forceShow = 'force-show-sidebar ', forceHide = 'force-hide-sidebar';
    var body = $('#wrapper');
    if (body.is('.' + forceShow)) {
      body.removeClass(forceShow).addClass(forceHide);
    } else {
      body.removeClass(forceHide).addClass(forceShow);
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

  'click .markAllAsRead': function (event) {
    event.preventDefault();
    var notifi = Notifications.find({"read": false, "to": Meteor.userId()}).fetch();
    notifi.forEach(function (not) {
      Meteor.call("readNotifications", not._id, HospoHero.handleMethodResult());
    });
  },

  'click .notifi-toggler': function (event) {
    event.stopPropagation();
    if ($(".flyout-notifi-container").hasClass("show")) {
      $(".flyout-notifi-container").removeClass("show");
    } else {
      $(".flyout-notifi-container").addClass("show");
    }
    return false;
  },

  'click .open-flyout': function (e) {
    //e.stopPropagation();
    //e.preventDefault();
    //var id = e.target.dataset.id;
    //if (!id) {
    //  id = e.target.parentNode.dataset.id;
    //}
    //if (!id) {
    //  id = e.target.parentNode.parentNode.dataset.id;
    //}
    //$("#" + id).addClass("show");
    FlyoutManager.open('myCustomTemplate', {yourMessage: 'Hello, Flyouts!'});
  },

  'click .theme-config-close-btn': function (event) {
    var el = $(event.target);
    if (el.hasClass('fa')) {
      el = el.parent();
    }
    $("#" + el.attr('data-id')).removeClass("show");
    Template.instance().showCreateOrgFlyout.set(false);
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