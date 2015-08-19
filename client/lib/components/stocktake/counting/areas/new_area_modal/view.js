Template.newAreaModal.events({
  'click #savegeneralArea': function(event) {
    event.preventDefault();
    var name = $("#generalareaName").val();
    FlowComponents.callAction("submit", name);
  },


  'click #savespecialArea': function(event) {
    event.preventDefault();
    var name = $("#specialareaName").val();
    FlowComponents.callAction("submit", name);
  }
});