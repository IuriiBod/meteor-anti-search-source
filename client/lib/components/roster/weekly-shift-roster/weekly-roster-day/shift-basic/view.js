Template.shiftBasic.onCreated(function () {
  console.log('context', this.data);
});


Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    var delElementId = $(event.target).closest('li').attr("data-id");
    FlowComponents.callAction("deleteShift", delElementId);
  },

  'mouseenter .success-element': function (event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .success-element': function (event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  }
});