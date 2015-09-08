Template.generalFlyout.events({
  'click .theme-config-close-btn': function(event) {
    var flyouts = document.getElementsByClassName("flyout-container");

    for(var i=0; i<flyouts.length; i++) {
      flyouts[i].classList.remove("show");
    }
  }
});