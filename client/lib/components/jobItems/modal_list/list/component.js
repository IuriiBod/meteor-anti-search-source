var component = FlowComponents.define('jobItemsModalList', function(props) {
  this.onRendered(this.onJobLitsRendered);
  var id = Router.current().params._id;
  subs.subscribe("allJobTypes");
  this.name = props.name;

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);
});

component.action.keyup = function(text) {
  var ids = this.setIds();
  this.set("text", text);
  this.JobItemsSearch.search(text, {"ids": ids, "limit": 10, "type": this.get("prep")});
};

component.prototype.setIds = function() {
  var ids = [];
  if(this.name == "editMenu") {
    var menu =  MenuItems.findOne(Session.get("thisMenuItem"));
    if(menu.jobItems.length > 0) {
      menu.jobItems.forEach(function(doc) {
        if(ids.indexOf(doc._id) < 0) {
          ids.push(doc._id);
        }
      });
    }
  } else if(this.name == "submitMenuItem") {
    var menu = LocalMenuItem.findOne(Session.get("localId"));
    if(menu.preps.length > 0) {
      menu.preps.forEach(function(id) {
        if(ids.indexOf(id) < 0) {
          ids.push(id);
        }
      });
    }
  }
  this.set("ids", ids);
  return ids;
};

component.state.getJobItems = function() {
  return this.JobItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
};

component.prototype.onJobLitsRendered = function() {
  var self = this;

  Tracker.autorun(function() {
    var ids = self.setIds();
    if(ids.length > 0) {
      self.JobItemsSearch.cleanHistory();
    }
    var prep = JobTypes.findOne({"name": "Prep"});
    if(prep) {
      self.set("prep", prep._id);
      var text = self.get("text");
      self.JobItemsSearch.search(text,{"ids": ids, "limit": 10, "type": prep._id});
    }
  });
};