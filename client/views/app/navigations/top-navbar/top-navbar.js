Template.topNavbar.helpers({
  today: function () {
    return moment(new Date()).format("YYYY-MM-DD");
  },

  week: function () {
    return moment().format("w");
  },

  profileMenuItems: function () {
    return [
      {
        route: 'profile',
        title: 'My Profile',
        params: {
          _id: Meteor.userId()
        }
      },
      {
        title: 'Availability & Leave',
        class: 'user-unavailabilities-flyout'
      },
      {
        route: 'switchUser',
        title: 'Switch User'
      },
      {
        route: 'logout',
        title: 'Logout'
      }
    ];
  },

  count: function () {
    return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}}).count();
  },

  tasksCount: function () {
    var today = moment().endOf('day').toDate();
    var query = HospoHero.misc.getTasksQuery(Meteor.userId());
    query = _.extend(query, {
      dueDate: {$lte: today},
      done: false
    });
    return TaskList.find(query).count();
  },

  notifications: function () {
    return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
  },

  areaColor: function () {
    var area = HospoHero.getCurrentArea();
    if (area) {
      return area.color;
    }
  }
});


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

  'click .notifi-toggler': function () {
    FlyoutManager.open('notifiFlyout', {});
  },

  'click .organization-structure-flyout': function () {
    FlyoutManager.open('organizationStructure', {});
  },

  'click .user-unavailabilities-flyout': function () {
    FlyoutManager.open('userUnavailability', {});
  }
});
