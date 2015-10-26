var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name'];

MenuItemsSearch = new SearchSource('menuItemsSearch', fields, options);

Template.salesPrediction.helpers({
  formatDate: function (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  getDayOfWeek: function (date) {
    return moment(date).format('dddd');
  },
  'getMenuItems': function () {
    return MenuItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  }
});

Template.salesPrediction.events({
  'click #loadMoreBtn': function (event) {
    event.preventDefault();
    var text = $("#searchMenuItems").val().trim();
    if (MenuItemsSearch.history && MenuItemsSearch.history[text]) {
      var dataHistory = MenuItemsSearch.history[text].data;
      var maxHistoryLength = 9;
      if (dataHistory.length >= maxHistoryLength) {
        MenuItemsSearch.cleanHistory();
        var count = dataHistory.length;
        var lastItem = dataHistory[count - 1]['name'];
        var category = Router.current().params.category;
        var filter = [];
        var selector = {
          "limit": count + 10,
          "endingAt": lastItem
        };
        filter.push({
          "status": "active",
          "relations.areaId": HospoHero.getCurrentAreaId()
        });
        if (category && category.toLowerCase() != "all") {
          filter.push({"category": category});
        }
        selector.filter = filter;
        MenuItemsSearch.search(text, selector);
        if ((count + 10) >= MenuItems.find().count()) {
          $("#loadMoreBtn").addClass("hide");
        }
      }
    }
  }
});