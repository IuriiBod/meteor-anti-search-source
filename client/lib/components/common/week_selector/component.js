var component = FlowComponents.define("weekSelector", function (props) {
});

component.state.futureWeeks = function () {
  var thisWeek = moment().week();
  var future = thisWeek + 6;
  var weeks = [];
  for (var i = thisWeek; i <= future; i++) {
    var year = new Date().getFullYear();
    var monday = getFirstDateOfISOWeek(i, year);
    weeks.push({
      "week": i,
      "monday": moment(monday).format("dddd, Do of MMMM YYYY"),
      "year": year
    })
  }
  return weeks;
}