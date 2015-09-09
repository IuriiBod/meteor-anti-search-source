Template.profileFlyoutLinks.events({
  'click .open-flyout': function(e) {
    var id = e.target.dataset.id;
    if(!id) {
      id = e.target.parentNode.dataset.id;
    }
    $("#"+id).addClass("show");
  }
});