var MenuItemsSearch = new SearchSource('menuItemsSearch', ['name'], {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
});

Template.menuItemsList.onRendered(function () {
  MenuItemsSearch.cleanHistory();
  var category = Router.current().params.category;
  var status = Router.current().params.status;
  var selector = {
    'limit': 30
  };
  var filter = [];
  if (category && category.toLowerCase() != "all") {
    filter.push({"category": category});
  }
  if (status && status.toLowerCase() != "all") {
    filter.push({"status": status.toLowerCase()});
  } else if (status && status.toLowerCase() == "all") {
    filter.push({"status": {$ne: "archived"}});
  }
  if (filter.length > 0) {
    selector.filter = filter;
  }
  MenuItemsSearch.search("", selector);

  var tpl = this;
  Meteor.defer(function () {
    $("#wrapper").on('scroll', function (event) {
      var wrapper = event.target;
      var wrapperHeight = wrapper.clientHeight;
      var wrapperScrollHeight = wrapper.scrollHeight;
      var wrapperScrollTop = wrapper.scrollTop;

      if (wrapperHeight + wrapperScrollTop === wrapperScrollHeight) {
        tpl.$('#loadMoreMenuItems').click();
      }
    });
  });
});

Template.menuItemsList.helpers({
  'getMenuItems': function () {
    return MenuItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  }
});

Template.menuItemsList.events({
  'keyup #searchMenuItemsBox': function (event) {
    MenuItemsSearch.cleanHistory();
    var text = $("#searchMenuItemsBox").val().trim();
    var category = Router.current().params.category;
    var status = Router.current().params.status;
    var selector = {
      'limit': 30
    };
    var filter = [];
    if (category && category.toLowerCase() != "all") {
      filter.push({"category": category});
    }
    if (status && status.toLowerCase() != "all") {
      filter.push({"status": status.toLowerCase()});
    } else if (status && status.toLowerCase() == "all") {
      filter.push({"status": {$ne: "archived"}});
    }
    if (filter.length > 0) {
      selector.filter = filter;
    }
    MenuItemsSearch.search(text, selector);
  },

  'click #loadMoreMenuItems': function (event) {
    event.preventDefault();
    var text = $("#searchMenuItemsBox").val().trim();
    if (MenuItemsSearch.history && MenuItemsSearch.history[text]) {
      var dataHistory = MenuItemsSearch.history[text].data;
      if (dataHistory.length >= 9) {
        MenuItemsSearch.cleanHistory();
        var count = dataHistory.length;
        var lastItem = dataHistory[count - 1]['name'];

        var selector = {
          "limit": count + 10,
          "endingAt": lastItem
        };
        MenuItemsSearch.search(text, selector);
      }
    }
  }
});



Template.menuItemsList.onDestroyed(function () {
  $('#wrapper').off('scroll');
});
