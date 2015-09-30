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

  var dates = _.map(getDatesFromWeekNumberWithYear(currentWeekDate.week, new Date(currentWeekDate.year)), function(item){
    return item.date;
  });
  var prediction = _.map(SalesPrediction.find({date:TimeRangeQueryBuilder.forWeek(monday), menuItemId: id }, {sort: {date: 1}}).fetch(), function(item){
    return {date: moment(item.date).format('YYYY-MM-DD'), predictionQuantity: item.quantity};
  });
  var actual = _.map(ImportedActualSales.find({date:TimeRangeQueryBuilder.forWeek(monday), menuItemId: id }, {sort: {date: 1}}).fetch(), function(item){
    return {date: moment(item.date).format('YYYY-MM-DD'), actualQuantity: item.quantity};
  });

  prediction = _.sortBy(importMissingData(dates, prediction, "predictionQuantity"), "date");
  actual = _.sortBy(importMissingData(dates, actual, "actualQuantity"), "date");
  var result = mergeArrays(prediction, actual);
  return result;
};


//MOCK DATA

component.state.menuItems = function () {
  return MenuItems.find().fetch();
};

component.state.random = function (zeros) {
  return Math.floor(Math.random() * Math.pow(10, zeros));
};

component.state.getSale = function (date) {
  var predictions = SalesPrediction.find({date: TimeRangeQueryBuilder.forDay(date)}).fetch();
  var actual = ImportedActualSales.find({date: TimeRangeQueryBuilder.forDay(date)}).fetch();
  var actualTotal = getTotalPrice(actual);
  var predictionTotal = getTotalPrice(predictions);
  return [predictionTotal, actualTotal];
};

importMissingData = function(dates, importArray, keyName){
  _.each(dates, function(dateItem){
    var push = true;
    _.each(importArray, function(item){
      if (dateItem === item.date){
        push = false;
      }
    });

    if (push) {
      var toPush = {
        date: dateItem
      };
      toPush[keyName] = 0;
      importArray.push(toPush);
    }
  });
  return importArray
};

mergeArrays = function (array1, array2) {
  for (var i=0; i<array1.length; i++){
    _.extend(array1[i], array2[i])
  }
  return array1
};

getTotalPrice = function (array) {
  var total = 0;
  _.each(array, function(item){
    var quantity = item.quantity;
    var price = MenuItems.findOne({_id: item.menuItemId}).salesPrice;
    total+=quantity*price;
  });
  return total;
};