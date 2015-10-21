var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);

  this.set('defaultMenuItemsQuantityLimit', 10);
  this.set('menuItemsQuantityLimit', this.get('defaultMenuItemsQuantityLimit'));
});

component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return HospoHero.dateUtils.getWeekDays(currentWeekDate);
};

component.state.menuItems = function () {
  return MenuItems.find();
};

component.action.subsctibeOnMenuItems = function (tmpl) {
  var self = this;
  tmpl.autorun(function () {
    tmpl.subscribe('areaMenuItemsInfiniteScroll', self.get('menuItemsQuantityLimit'));
  });
};

component.action.loadMoreMenuItems = function () {
  var newLimit = this.get('menuItemsQuantityLimit') + this.get('defaultMenuItemsQuantityLimit')
  this.set('menuItemsQuantityLimit', newLimit);
  return this.get('menuItemsQuantityLimit');
};