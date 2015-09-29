var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
});

component.state.week = function (id) {
  var currentWeekDate = this.get('currentWeekDate');
  this.set("menuItemId", id);
  return getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year));
};

component.state.weekPrediction = function(id){
  var currentWeekDate = this.get('currentWeekDate');
  var monday = moment(getFirstDateOfISOWeek(currentWeekDate.week, currentWeekDate.year));
  var sunday = moment(monday).add(6, "d");

  var dates = _.map(getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year)), function(item){
    return item.date;
  });

  var prediction = _.map(SalesPrediction.find({date:{$gte:monday.toDate(), $lte: sunday.endOf("d").toDate()}, menuItemId: id }, {sort: {date: 1}}).fetch(), function(item){
    return {date: moment(item.date).format('YYYY-MM-DD'), quantity: item.quantity};
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
      prediction.push({date: dateItem, quantity: 0});
    }
  });
  return _.sortBy(prediction, "date");

};

//MOCK DATA
//['Brisket Special', 'Caramel Banana bread', 'Cupcakes Platter', 'Eton Mess', 'Fudge Brownie - Vegan', 'Muesli'];

component.state.menuItems = function () {
  return MenuItems.find().fetch();
};

component.state.random = function (zeros) {
  return Math.floor(Math.random() * Math.pow(10, zeros));
};

component.state.getSale = function (date) {
  var startTime = moment(date).startOf("d").toDate();
  var endTime = moment(date).endOf("d").toDate();
  var predictions = SalesPrediction.find({date: {$gte: startTime, $lte: endTime}}).fetch();
  var total = 0;
  _.each(predictions, function(item){
    var quantity = item.quantity;
    var price = MenuItems.findOne({_id: item.menuItemId}).salesPrice;
    total+=quantity*price;
  });
  return total;
};



