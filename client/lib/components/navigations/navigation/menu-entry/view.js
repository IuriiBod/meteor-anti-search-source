Template.menuEntry.events({
  'click .menu-entry-title': function (event, tmpl) {
    $('.nav-first-level-item').removeClass('show-sub-menu');
    tmpl.$('.nav-first-level-item').addClass('show-sub-menu');
    var media_query = window.matchMedia('(max-width: 767px)');
    if (media_query.matches && !$(event.currentTarget).next()[0]) {
      $('#wrapper').removeClass('force-show-sidebar').addClass('force-hide-sidebar');
    }
  }
});