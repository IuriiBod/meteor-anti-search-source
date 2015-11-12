Template.menuDetailWidgets.rendered = function() {
  $('.editMenuItem').editable({
    type: "text",
    title: 'Edit sale price',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = $(this).attr("data-id");
      
      if(id) {
        Meteor.call("editMenuItem", id, {salesPrice: newValue}, HospoHero.handleMethodResult());
      }
    }
  });
};