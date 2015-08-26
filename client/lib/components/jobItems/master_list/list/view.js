Template.jobItemsList.events({
  'keyup #searchJobItemsBox': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'click #loadMoreJobItems': _.throttle(function(e) {
    e.preventDefault();
    FlowComponents.callAction('click');
  }, 200)
});

Template.jobItemsList.onRendered(function() {
  var tpl = this;
  Meteor.defer(function() {
    $(window).scroll(function(e){
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollTop = $(window).scrollTop();
      
      if ((docHeight - winHeight) == scrollTop) {
        tpl.$('#loadMoreJobItems').click();
      }
    });
  });
});