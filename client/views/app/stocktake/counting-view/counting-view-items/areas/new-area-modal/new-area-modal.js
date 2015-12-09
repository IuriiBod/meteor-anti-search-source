Template.newAreaModal.helpers({
  name: function() {
    return this.name;
  }
});

Template.newAreaModal.events({
  'click #savegeneralArea': function (event) {
    event.preventDefault();
    var name = $("#generalareaName").val();
    submit(name);
  },


  'click #savespecialArea': function (event, tmpl) {
    event.preventDefault();
    var name = $("#specialareaName").val();
    console.log(name);
    submit.call(tmpl.data, name);
  }
});

function submit(name) {
  if (name) {
    console.log(this.name);
    //if (this.name == "general") {
    //  Meteor.call("createGeneralArea", name.trim(), HospoHero.handleMethodResult(function () {
    //    $("#generalareaName").val("");
    //    $("#addNewGeneralAreaModal").modal("hide");
    //  }));
    //} else if (this.name == "special") {
    //  var gareaId = Session.get("thisGeneralArea");
    //  if (gareaId) {
    //    Meteor.call("createSpecialArea", name, gareaId, HospoHero.handleMethodResult(function () {
    //      $("#specialareaName").val("");
    //      $("#addNewSpecialAreaModal").modal("hide")
    //    }));
    //  }
    //}
  }
}