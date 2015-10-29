Template.menuItemsSearch.events({
  'keyup #searchMenuItems': function (event) {
    var text = $("#searchMenuItems").val().trim();
    FlowComponents.callAction("SearchAndCleanHistory", text);
  }
});

Template.menuItemsSearch.onRendered(function () {
  FlowComponents.callAction("SearchAndCleanHistory", "");
});

