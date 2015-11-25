var component = FlowComponents.define('homeCountTags', function (props) {
  this.ingCountMethod();
  this.jobItemsCountMethod();
  this.menuItemsCountMethod();
});

component.prototype.ingCountMethod = function () {
  var self = this;
  Meteor.call("ingredientsCount", HospoHero.handleMethodResult(function (result) {
    self.set("ingCount", result)
  }));
};

component.prototype.jobItemsCountMethod = function () {
  var self = this;
  Meteor.call("jobItemsCount", HospoHero.handleMethodResult(function (result) {
    self.set("jobsCount", result)
  }));
};

component.prototype.menuItemsCountMethod = function () {
  var self = this;
  Meteor.call("menuItemsCount", HospoHero.handleMethodResult(function (result) {
    self.set("menusCount", result);
  }));
};