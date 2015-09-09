Template.generalFlyout.events({
  'click .theme-config-close-btn': function(event) {
    var el = $(event.target);
    if(el.hasClass('fa')) {
      el = el.parent();
    }
    $("#"+el.attr('data-id')).removeClass("show");
  }
});