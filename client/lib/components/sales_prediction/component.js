var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
});


component.state.week = function (id) {
  var currentWeekDate = this.get('currentWeekDate');
  this.set("menuItemId", id);
  return getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year));
};


//MOCK DATA

component.state.menuItems = function () {
  return MenuItems.find().fetch();
};

component.state.random = function (zeros) {
  return Math.floor(Math.random() * Math.pow(10, zeros));
};

component.state.getSale = function (date) {
  var predictions = SalesPrediction.find({date: date}).fetch();
  var total = 0;
  _.each(predictions, function(item){
    var quantity = item.quantity;
    var price = MenuItems.findOne({_id: item.menuItemId}).salesPrice;
    total+=quantity*price;
  });
  return total;
};

component.state.getQuantity = function(date) {
  var predictionItem = SalesPrediction.findOne({date: date, menuItemId: this.get("menuItemId")})
  return predictionItem ? predictionItem.quantity : "ND";
};


