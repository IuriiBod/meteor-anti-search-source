Template.newAreaModal.onCreated(function() {
  this.submit = function(name) {
    var areaName = name.trim();
    if (areaName !== '') {
      if (this.data.name === "general") {
        Meteor.call("createGeneralArea", areaName, HospoHero.handleMethodResult(function () {
          $("#generalareaName").val("");
          $("#addNewGeneralAreaModal").modal("hide");
        }));
      } else if (this.data.name === "special" && this.data.generalArea) {
        Meteor.call("createSpecialArea", areaName, this.data.generalArea, HospoHero.handleMethodResult(function () {
          $("#specialareaName").val("");
          $("#addNewSpecialAreaModal").modal("hide")
        }));
      }
    }
  }
});

Template.newAreaModal.events({
  'click #savegeneralArea': function (event, tmpl) {
    event.preventDefault();
    var name = $("#generalareaName").val();
    tmpl.submit(name);
  },


  'click #savespecialArea': function (event, tmpl) {
    event.preventDefault();
    var name = $("#specialareaName").val();
    tmpl.submit(name);
  }
});