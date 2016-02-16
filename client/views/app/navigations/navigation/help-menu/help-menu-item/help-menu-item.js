Template.helpMenuItem.events({
  'click .open-module': function(event) {
    event.preventDefault();
    var moduleName = event.currentTarget.getAttribute('data-elevio-module-name');
    window._elev.openModule(moduleName);
  }
});