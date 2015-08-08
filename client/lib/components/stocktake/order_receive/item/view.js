Template.orderReceiveItem.events({
  'click .deliveredCorrectly': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    console.log("....deliveredCorrectly.......", id);
  },

  'click .wrongPrice': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    console.log("....wrongPrice.......", id);
  },
    
  'click .wrongQuantity': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    console.log(".....wrongQuantity......", id);
  }
});