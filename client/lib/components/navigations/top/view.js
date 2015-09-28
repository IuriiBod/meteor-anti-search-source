Template.topNavbar.rendered = function () {
  // FIXED TOP NAVBAR OPTION
  // Uncomment this if you want to have fixed top navbar
  // $('body').addClass('fixed-nav');
  // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');

  $('html').click(function (event) {
    var flyout = $(".flyout-notifi-container");
    if (!flyout.is(event.target) && flyout.has(event.target).length === 0) {
      flyout.removeClass('show');
    }
  });

  $('html').click(function (event) {
    var flyout = $(".flyout-container");
    var createOrganization = $('.create-organization');
    if ((!flyout.is(event.target) && flyout.has(event.target).length === 0) && (!createOrganization.is(event.target) && createOrganization.has(event.target).length === 0)) {
      flyout.removeClass('show');
      var fly = HospoHero.getBlazeTemplate('#createOrganizationPage');
      if(fly) {
        fly.showCreateOrgFlyout.set(false);
      }
    }
  });
};

Template.topNavbar.events({
  // Toggle left navigation
  'click #navbar-minimalize': function (event) {
    event.preventDefault();
    // Toggle special class
    $("body").toggleClass("mini-navbar");

    // Enable smoothly hide/show menu
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(function () {
        $('#side-menu').fadeIn(500);
      }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
      $('#side-menu').hide();
      setTimeout(function () {
        $('#side-menu').fadeIn(500);
      }, 300);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  },

  // Toggle right sidebar
  'click .right-sidebar-toggle': function () {
    $('#right-sidebar').toggleClass('sidebar-open');
  },

  'click #signInButton': function (event) {
    event.preventDefault();
    Router.go("signIn");
  },

  'click #signOutButton': function (event) {
    event.preventDefault();
    Meteor.logout();
  },

  'click .markAllAsRead': function (event) {
    event.preventDefault();
    var notifi = Notifications.find({"read": false, "to": Meteor.userId()}).fetch();
    notifi.forEach(function (not) {
      Meteor.call("readNotifications", not._id, function (err) {
        if (err) {
          HospoHero.alert(err);
        }
      });
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
    e.stopPropagation();
    e.preventDefault();
    var id = e.target.dataset.id;
    if (!id) {
      id = e.target.parentNode.dataset.id;
    }
    if (!id) {
      id = e.target.parentNode.parentNode.dataset.id;
    }
    if(id == 'createOrganizationPage') {
      Template.instance().showCreateOrgFlyout.set(true);
    } else {
      $("#" + id).addClass("show");
    }
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
  },

  showCreateOrgFlyout: function() {
    return Template.instance().showCreateOrgFlyout.get();
  }
});

Template.topNavbar.created = function() {
  this.showCreateOrgFlyout = new ReactiveVar();
  this.autorun(_.bind(function() {
    this.showCreateOrgFlyout.set(false);
  }, this));
};