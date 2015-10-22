var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);

  this.defaultMenuItemsQuantityLimit = 10;
  this.set('menuItemsQuantityLimit', this.defaultMenuItemsQuantityLimit);
  this.set('areAllItemsLoaded', false);
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
    tmpl.subscribe('areaMenuItemsInfiniteScroll', self.get('menuItemsQuantityLimit'), function () {
      var loadedMenuItemsQuantity = MenuItems.find().count();
      if(loadedMenuItemsQuantity == self.lastLoadedMenuItemsQuantity) {
        self.set('areAllItemsLoaded', true);
      }
      self.lastLoadedMenuItemsQuantity = MenuItems.find().count();
    });
  });
};

component.action.loadMoreMenuItems = function () {
  var newLimit = this.get('menuItemsQuantityLimit') + this.defaultMenuItemsQuantityLimit;
  this.set('menuItemsQuantityLimit', newLimit);
};