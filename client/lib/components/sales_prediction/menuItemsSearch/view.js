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
    var selector = {};
    var filter = [];
    if(category && category.toLowerCase() != "all") {
      filter.push({"category": category});
    }
    filter.push({"archived": {$ne: true}});

    if(filter.length > 0) {
      selector.filter = filter;
    }
    MenuItemsSearch.search(text, selector);
  }
});

Template.menuItemsSearch.rendered = function() {
  MenuItemsSearch.cleanHistory();
  var category = Router.current().params.category;
  var selector = {};
  var filter = [];
  if(category && category.toLowerCase() != "all") {
    filter.push({"category": category});
  }
  filter.push({"archived":{$ne:true}});
  if(filter.length > 0) {
    selector.filter = filter;
  }
  MenuItemsSearch.search("", selector);
};