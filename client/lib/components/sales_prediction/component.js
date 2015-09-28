var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
  this.set("limit", 15);
});

component.state.week = function (id) {
  var currentWeekDate = this.get('currentWeekDate');
  this.set("menuItemId", id);
  return getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year));
};

component.state.weekPrediction = function(id){
  var currentWeekDate = this.get('currentWeekDate');
  var dates = _.map(getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year)), function(item){
    return item.date;
  });
  var prediction = _.map(SalesPrediction.find({date:{$in:dates}, menuItemId: id }, {sort: {date: 1}}).fetch(), function(item){
    return {date: item.date, quantity: item.quantity};
  });

  _.each(dates, function(dateItem){
    var push = true;
    _.each(prediction, function(predictionItem){
      if (dateItem === predictionItem.date){
        push = false;
      }
    });
    if (push)
    {
      prediction.push({date: dates[i], quantity: "ND"});
    }
  });
  return _.sortBy(prediction, "date");

};

//MOCK DATA
//['Brisket Special', 'Caramel Banana bread', 'Cupcakes Platter', 'Eton Mess', 'Fudge Brownie - Vegan', 'Muesli'];

component.state.menuItems = function () {
  return MenuItems.find({},{limit: this.get("limit")}).fetch();
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


component.action.increaseLimit = function () {
  if (this.get("limit")<MenuItems.find().count()) {
    this.set("limit", this.get("limit") + 10);
  }
};
