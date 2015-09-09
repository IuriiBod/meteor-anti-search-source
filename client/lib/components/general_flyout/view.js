Template.generalFlyout.events({
  'click .theme-config-close-btn': function(event) {
    var el = $(event.target);
    if(el.hasClass('fa')) {
      el = el.parent();
    }
    $("#"+el.attr('data-id')).removeClass("show");
  },

  'click .open-flyout': function(e) {
    e.preventDefault();
    var id = e.target.dataset.id;
    if(!id) {
      id = e.target.parentNode.dataset.id;
    }
    $("#"+id).addClass('show');
  }
});