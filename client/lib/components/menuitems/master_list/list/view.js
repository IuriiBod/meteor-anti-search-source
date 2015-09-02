var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name'];

MenuItemsSearch = new SearchSource('menuItemsSearch', fields, options);

Template.menuItemsList.helpers({
  'getMenuItems': function() {
    var data = MenuItemsSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
    return data;
  }
});

Template.menuItemsList.events({
  'keyup #searchMenuItemsBox': function(event) {
    MenuItemsSearch.cleanHistory();
    var text = $("#searchMenuItemsBox").val().trim();
    var category = Router.current().params.category;
    var status = Router.current().params.status;
    var selector = {
      'limit': 30
    };
    var filter = [];
    if(category && category.toLowerCase() != "all") {
      filter.push({"category": category});
    }
    if(status && status.toLowerCase() != "all") {
      filter.push({"status": status.toLowerCase()});
    }
    if(filter.length > 0) {
      selector.filter = filter;
    }
    if(Router.current().params.type) {
      selector.isArchived = true;
    } else {
      selector.isArchived = {$ne: true};
    }

    MenuItemsSearch.search(text, selector);
  },

  'click #loadMoreMenuItems': function(event) {
    event.preventDefault();
    var text = $("#searchMenuItemsBox").val().trim();
    if(MenuItemsSearch.history && MenuItemsSearch.history[text]) {
      var dataHistory = MenuItemsSearch.history[text].data;
      if(dataHistory.length >= 9) {
        MenuItemsSearch.cleanHistory();
        var count = dataHistory.length;
        var lastItem = dataHistory[count - 1]['name'];

        var selector = {
          "limit": count + 10,
          "endingAt": lastItem
        };
        if(Router.current().params.type) {
          selector.isArchived = true;
        } else {
          selector.isArchived = {$ne: true};
        }
        MenuItemsSearch.search(text, selector);
      }
    }
  }
});

Template.menuItemsList.rendered = function() {
  MenuItemsSearch.cleanHistory();
  var category = Router.current().params.category;
  var status = Router.current().params.status;
  var selector = {
    'limit': 30
  };
  var filter = [];
  if(category && category.toLowerCase() != "all") {
    filter.push({"category": category});
  }
  if(status && status.toLowerCase() != "all") {
    filter.push({"status": status.toLowerCase()});
  }
  if(filter.length > 0) {
    selector.filter = filter;
  }
  if(Router.current().params.type) {
    selector.isArchived = true;
  } else {
    selector.isArchived = {$ne: true};
  }
  MenuItemsSearch.search("", selector);
}

Template.menuItemsList.onRendered(function() {
  var tpl = this;
  Meteor.defer(function() {
    $(window).scroll(function(e){
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollTop = $(window).scrollTop();

      if ((docHeight - winHeight) == scrollTop) {
        tpl.$('#loadMoreMenuItems').click();
      }
    });
  });
});
