Template.menuInstructions.events({
  'click .textEdit': function(event) {
    event.preventDefault();
    $(".editorPanel").hide();
    $(".editor").removeClass("hide");
    $(event.target).text("Click here to save").removeClass("textEdit").addClass("saveText");
  },

  'click .saveText': function(event) {
    event.preventDefault();
    var menuId = Session.get("thisMenuItem");
    var text = FlowComponents.child('menuItemEditorDetail').getState('content');
    var info = {};
    info.instructions = text;
    Meteor.call("editMenuItem", menuId, info, HospoHero.handleMethodResult(function() {
      $(".editor").addClass("hide");
      $(".editorPanel").show().find("p").replaceWith(text);
      $(event.target).text("Click here to edit").removeClass("saveText").addClass("textEdit");
    }));
  }
});