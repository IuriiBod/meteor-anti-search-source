Template.menuItemsListMainView.onCreated(function () {
  var category = this.data.category;
  var status = this.data.status;

  var mongoQuery = {};

  if (category && category != 'all') {
    mongoQuery.category = category;
  }

  mongoQuery.status = status === 'all' ? {$ne: 'archived'} : status;

  this.menuItemsSearch = this.AntiSearchSource({
    collection: 'menuItems',
    fields: ['name'],
    mongoQuery: mongoQuery,
    searchMode: 'local',
    limit: 30
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
    var searchResult = Template.instance().menuItemsSearch.searchResult({
      sort: {'name': 1}
    });
    return searchResult;
  }
});


Template.menuItemsListMainView.events({
  'keyup #searchMenuItemsBox': function (event, tmpl) {
    var text = $("#searchMenuItemsBox").val().trim();
    tmpl.menuItemsSearch.search(text);
  },

  'click #loadMoreMenuItems': function (event, tmpl) {
    tmpl.menuItemsSearch.incrementLimit();
  }
});


Template.menuItemsListMainView.onDestroyed(function () {
  $('#wrapper').off('scroll');
});
