var component = FlowComponents.define("teamHours", function (props) {
  this.onRendered(this.onListRendered);
});

component.state.week = function () {
  var weekNo = parseInt(Router.current().params.week);
  var year = parseInt(Router.current().params.year);
  return getDatesFromWeekNumber(weekNo, year);
};

component.state.users = function () {
  return Meteor.users.find();
};

component.prototype.onListRendered = function () {
  $.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.showbuttons = false;

  $('.dataTables-example').dataTable({
    responsive: true,
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
      "sSwfPath": "/swf/copy_csv_xls_pdf.swf"
    }
  });
};

