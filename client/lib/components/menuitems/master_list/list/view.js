Template.menuItemsList.events({
  'keyup #searchMenuItemsBox': function(event) {
    var name = $(event.target).val();
    FlowComponents.callAction("keyup", name);
  },

  'click #loadMoreMenuItems': function(event) {
    event.preventDefault();
    FlowComponents.callAction("loadMore");
  }
});

Template.menuItemsList.onRendered(function() {
  var tpl = this;
  Meteor.defer(function() {
    $(window).scroll(function(e){
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollTop = $(window).scrollTop();
      
      if ((docHeight - winHeight) == scrollTop) {
        tpl.$('#loadMoreMenuItems').click();
      }
    });
  });
});