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
        Meteor.call("editMenuItem", id, {salesPrice: newValue}, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
};