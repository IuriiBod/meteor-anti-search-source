Template.newAreaModal.onCreated(function() {
  var tmpl = this;
  this.submit = function(name) {
    var areaName = name.trim();
    if (areaName !== '') {
      if (this.data.name === "general") {
        Meteor.call("createGeneralArea", areaName, HospoHero.handleMethodResult(function () {
          tmpl.$("#generalareaName").val("");
          $("#addNewGeneralAreaModal").modal("hide");
        }));
      } else if (this.data.name === "special" && this.data.generalArea) {
        Meteor.call("createSpecialArea", areaName, this.data.generalArea, HospoHero.handleMethodResult(function () {
          tmpl.$("#specialareaName").val("");
          $("#addNewSpecialAreaModal").modal("hide");
        }));
      }
    }
  };
});

Template.newAreaModal.events({
  'click #savegeneralArea': function (event, tmpl) {
    event.preventDefault();
    var areaName = tmpl.$("#generalareaName").val();
    tmpl.submit(areaName);
  },


  'click #savespecialArea': function (event, tmpl) {
    event.preventDefault();
    var areaName = tmpl.$("#specialareaName").val();
    tmpl.submit(areaName);
  },

  'submit form': function(event, tmpl) {
    event.preventDefault();
    var areaName = tmpl.$("#generalareaName").val() || tmpl.$("#specialareaName").val();
    tmpl.submit(areaName);
  }
});