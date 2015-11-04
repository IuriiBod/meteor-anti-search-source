Template.navigation.rendered = function(){
  $('#side-menu').metisMenu();
};

Template.navigation.events({
  'click .close-canvas-menu': function(){
    $('body').toggleClass("mini-navbar");
  }
});