var component = FlowComponents.define("teamHours", function (props) {
  this.onRendered(this.onListRendered);
  this.weekDate = HospoHero.misc.getWeekDateFromRoute(Router.current());
  this.set('tableViewMode', 'shifts');
  this.set('searchText', '');
  this.set('limit', 5);
  this.count = 0;
});

component.state.weekDays = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};

component.state.users = function () {
  var limit = this.get('limit');
  var query = {};
  var searchText = this.get('searchText');
  if(searchText) {
    query.username = new RegExp(searchText, 'i');
  }
  return Meteor.users.find(query);
};

component.state.onKeyUp = function () {
  var self = this;
  return function(searchText) {
    self.set('searchText', searchText);
  }
};

component.state.onChange = function () {
  var self = this;
  return function(limit) {
    self.set('limit', parseInt(limit));
  }
};

component.action.changeTableViewMode = function (newMode) {
  this.set('tableViewMode', newMode);
};

component.prototype.onListRendered = function () {
  $.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.showbuttons = false;
};


