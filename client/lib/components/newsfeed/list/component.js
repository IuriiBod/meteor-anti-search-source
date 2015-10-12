var component = FlowComponents.define("newsFeed", function(props) {});

component.state.newsFeedsExist = function() {
  var count = NewsFeeds.find({"reference": null}, {sort: {"createdOn": -1}}).count();
  return count > 0;
};

component.state.newsFeedsList = function() {
  return NewsFeeds.find({"reference": null}, {sort: {"createdOn": -1}});
};