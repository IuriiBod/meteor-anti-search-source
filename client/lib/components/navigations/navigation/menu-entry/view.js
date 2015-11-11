Template.menuEntry.events({
  'click .menu-entry-title': function (event, tmpl) {
    showSubMenu(tmpl);
    if (isMobile() && !haveSubMenu(event)) {
      hideSideMenu();
    }
  }
});

//HELPING FUNCTIONS

var isMobile = function () {
  return window.matchMedia('(max-width: 767px)').matches;
};

var haveSubMenu = function (event) {
  return !!$(event.currentTarget).next()[0];
};

var showSubMenu = function (tmpl) {
  $('.nav-first-level-item').removeClass('show-sub-menu');  //removing class from all menus
  tmpl.$('.nav-first-level-item').addClass('show-sub-menu'); //adding class to clicked menu
};


var hideSideMenu = function () {
  $('#wrapper').removeClass('force-show-sidebar').addClass('force-hide-sidebar');
};

