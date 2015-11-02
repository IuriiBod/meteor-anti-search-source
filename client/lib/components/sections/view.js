Template.sections.events({
  'submit form': function(event) {
    event.preventDefault();

    var name = HospoHero.misc.getValuesFromEvent(event, 'sectionName', true);
    if(name) {
      Meteor.call("createSection", name, HospoHero.handleMethodResult(function() {
        event.target.sectionName.value = '';
      }));
    }
  },

  'click .deleteSection': function(event) {
    event.preventDefault();
    var confirmDelete = confirm("Are you sure you want to delete this section?");
    if(confirmDelete) {
      Meteor.call("deleteSection", this._id, HospoHero.handleMethodResult());
    }
  }
});

Template.sections.rendered = function() {
  $('.editSection').editable({
    type: "text",
    title: 'Edit section name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = $(this).attr("data-id");
      if(id) {
        Meteor.call("editSection", id, newValue, HospoHero.handleMethodResult());
      }
    }
  });
};