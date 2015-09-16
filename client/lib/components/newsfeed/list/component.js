var component = FlowComponents.define("newsFeed", function(props) {});

component.state.newsFeedsExist = function() {
  var count = NewsFeeds.find({"reference": null}, {sort: {"createdOn": -1}}).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
};

component.state.newsFeedsList = function() {
  var list = NewsFeeds.find({"reference": null}, {sort: {"createdOn": -1}});
  return list;
};
