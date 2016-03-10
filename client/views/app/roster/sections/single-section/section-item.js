Template.sectionItem.onRendered(function () {
  var id = this.data.section._id;
  $('.editSection').editable({
    type: "text",
    title: 'Edit section name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function (response, newValue) {
      Meteor.call("editSection", id, newValue, HospoHero.handleMethodResult());
    }
  });
});

Template.sectionItem.events({
  'click .deleteSection': function (event) {
    event.preventDefault();
    var confirmDelete = confirm("Are you sure you want to delete this section?");
    if (confirmDelete) {
      Meteor.call("deleteSection", this.section._id, HospoHero.handleMethodResult());
    }
  }
});