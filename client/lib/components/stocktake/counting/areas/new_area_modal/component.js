var component = FlowComponents.define("newAreaModal", function (props) {
  this.name = props.name;
});

component.state.name = function () {
  return this.name;
};

component.action.submit = function (name) {
  if (name) {
    if (this.name == "general") {
      Meteor.call("createGeneralArea", name.trim(), HospoHero.handleMethodResult(function () {
        $("#generalareaName").val("");
        $("#addNewGeneralAreaModal").modal("hide");
      }));
    } else if (this.name == "special") {
      var gareaId = Session.get("thisGeneralArea");
      if (gareaId) {
        Meteor.call("createSpecialArea", name, gareaId, HospoHero.handleMethodResult(function () {
          $("#specialareaName").val("");
          $("#addNewSpecialAreaModal").modal("hide")
        }));
      }
    }
  }
};