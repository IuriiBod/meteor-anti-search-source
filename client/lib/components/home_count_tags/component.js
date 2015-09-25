var component = FlowComponents.define('homeCountTags', function(props) {
  this.ingCountMethod();
  this.jobItemsCountMethod();
  this.menuItemsCountMethod();
});

component.prototype.ingCountMethod = function() {
  var self = this;
  Meteor.call("ingredientsCount", function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("ingCount", result)
    }
  });
};

component.prototype.jobItemsCountMethod = function() {
  var self = this;
  Meteor.call("jobItemsCount", function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("jobsCount", result)
    }
  });
};

component.prototype.menuItemsCountMethod = function() {
  var self = this;
  Meteor.call("menuItemsCount", function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("menusCount", result);
    }
  });
};