//todo: add security check on server side for search sub and use transform feature

Template.menuItemsListMainView.onCreated(function () {
  var category = this.data.category;
  var status = this.data.status;

  var mongoQuery = {};

  if (category && category != 'all') {
    mongoQuery.category = category
  }

  mongoQuery.status = status === "all" ? {$ne: "archived"} : status;

  this.limit = 30;
  this.step = 30;

  this.searchSource = this.AntiSearchSource({
    collection: 'menuItems',
    fields: ['name'],
    mongoQuery: mongoQuery,
    limit: this.limit
  });
});


Template.menuItemsListMainView.onRendered(function () {
  var tmpl = this;
  Meteor.defer(function () {
    $("#wrapper").on('scroll', function (event) {
      var wrapper = event.target;
      var wrapperHeight = wrapper.clientHeight;
      var wrapperScrollHeight = wrapper.scrollHeight;
      var wrapperScrollTop = wrapper.scrollTop;

      if (wrapperHeight + wrapperScrollTop === wrapperScrollHeight) {
        tmpl.$('#loadMoreMenuItems').click();
      }
    });
  });
});


Template.menuItemsListMainView.helpers({
  menuItems: function () {
    return Template.instance().searchSource.searchResult({
      sort: {'name': 1}
    });
  }
});


Template.menuItemsListMainView.events({
  'keyup #searchMenuItemsBox': function (event, tmpl) {
    var text = $("#searchMenuItemsBox").val().trim();
    tmpl.searchSource.search(text);
  },

  'click #loadMoreMenuItems': function (event, tmpl) {
    tmpl.limit += tmpl.step;
    tmpl.searchSource.setLimit(tmpl.limit);
  }
});


Template.menuItemsListMainView.onDestroyed(function () {
  $('#wrapper').off('scroll');
});
