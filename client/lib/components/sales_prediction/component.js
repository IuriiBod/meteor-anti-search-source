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