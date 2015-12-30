Template.menuItemsSearch.events({
  'keyup #searchMenuItems': function (event, tmpl) {
    var text = tmpl.$("#searchMenuItems").val().trim();
    tmpl.data.searchSource.search(text);
  }
});