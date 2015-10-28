Template.menuItemsSearch.events({
  'keyup #searchMenuItems': function (event) {
    FlowComponents.callAction("SearchSourceCleanHistory");
    var text = $("#searchMenuItems").val().trim();
    FlowComponents.callAction("SearchSourceSearch", text);
  }
});

Template.menuItemsSearch.onRendered(function () {
  FlowComponents.callAction("SearchSourceCleanHistory");
  FlowComponents.callAction("SearchSourceSearch", "");
});

