Template.jobDetailsHeader.events({
  'click .copyJobItemBtn': function (event, tpl) {
    event.preventDefault();
    tpl.$("#areaChooser").modal("show");
  },

  'click .subscribeButton': function (event) {
    event.preventDefault();
    FlowComponents.callAction('subscribe');
  },

  'click .archiveJobItem': function (e) {
    e.preventDefault();
    FlowComponents.callAction('archive');
  },

  'click .deleteJobItem': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");

    var result = confirm("Are you sure you want to delete this job ?");
    if (result) {
      FlowComponents.callAction('delete');
    }
  }
});