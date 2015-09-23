var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
});


component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year));
};


//MOCK DATA
//['Brisket Special', 'Caramel Banana bread', 'Cupcakes Platter', 'Eton Mess', 'Fudge Brownie - Vegan', 'Muesli'];

component.state.menuItems = function () {
  //todo: return items for specified location
  return MenuItems.find({});
};

component.state.random = function (zeros) {
  return Math.floor(Math.random() * Math.pow(10, zeros));
};


