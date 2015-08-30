var component = FlowComponents.define("teamHours", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.week = function() {
  var weekNo = Session.get("thisWeek");
  var year = Session.get("thisYear");
  var currentDate = new Date(year);
  var week = getDatesFromWeekNumberWithYear(parseInt(weekNo), currentDate);
  return week;
}

component.state.users = function() {
  var users = Meteor.users.find();
  return users;
}

component.prototype.onListRendered = function() {
  $.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.showbuttons = false;

  $('.dataTables-example').dataTable({
    responsive: true,
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
      "sSwfPath": "/swf/copy_csv_xls_pdf.swf"
    }
  });
}


