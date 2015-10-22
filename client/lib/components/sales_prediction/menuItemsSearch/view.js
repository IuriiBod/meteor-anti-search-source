var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name'];

MenuItemsSearch = new SearchSource('menuItemsSearch', fields, options);

Template.salesPrediction.helpers({
  'getMenuItems': function() {
    return MenuItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  }
});

Template.menuItemsSearch.events({
  'keyup #searchMenuItems': function(event) {
    MenuItemsSearch.cleanHistory();
    var text = $("#searchMenuItems").val().trim();
    var category = Router.current().params.category;
    var selector = {
      limit: 10
    };
    var filter = [];
    if(category && category.toLowerCase() != "all") {
      filter.push({"category": category});
    }
    filter.push({"status": "active"});

    if(filter.length > 0) {
      selector.filter = filter;
    }
    MenuItemsSearch.search(text, selector);
  }
});

Template.salesPrediction.events({
  'click #loadMoreBtn': function (event) {
    event.preventDefault();
    var text = $("#searchMenuItems").val().trim();
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
        MenuItemsSearch.search(text, selector);
      }
    }
  }
});

Template.menuItemsSearch.rendered = function() {
  MenuItemsSearch.cleanHistory();
  var category = Router.current().params.category;
  var selector = {
    limit: 10
  };
  var filter = [];
  if(category && category.toLowerCase() != "all") {
    filter.push({"category": category});
  }
  filter.push({"status": "active"});
  if(filter.length > 0) {
    selector.filter = filter;
  }
  MenuItemsSearch.search("", selector);
};