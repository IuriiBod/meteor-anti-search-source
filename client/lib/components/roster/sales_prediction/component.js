var component = FlowComponents.define("salesPrediction", function (props) {
  var currentWeekDate = {
    year: Router.current().params.year,
    week: parseInt(Router.current().params.week)
  };
  this.set('currentWeekDate', currentWeekDate);
});


component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year));
};


//MOCK DATA

component.state.menuItems = function () {
  return [
    'Brisket Special', 'Caramel Banana bread', 'Cupcakes Platter', 'Eton Mess', 'Fudge Brownie - Vegan', 'Muesli'
  ];
};

component.state.random = function (zeros) {
  return Math.floor(Math.random() * Math.pow(10, zeros));
};


