var component = FlowComponents.define("newsFeed", function(props) {});

component.state.newsFeedsExist = function() {
  return NewsFeeds.find({"reference": null}).count() > 0;
};

component.state.newsFeedsList = function() {
  return NewsFeeds.find({"reference": null}, {sort: {"createdOn": -1}});
};