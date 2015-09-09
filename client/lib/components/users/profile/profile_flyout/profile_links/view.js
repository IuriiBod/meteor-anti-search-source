Template.profileFlyoutLinks.events({
  'click .open-flyout': function(e) {
    var id = e.target.dataset.id;
    if(!id) {
      id = e.target.parentNode.dataset.id;
    }
    if(!id) {
      id = e.target.children.dataset.id;
    }
    $("#"+id).addClass("show");
  }
});