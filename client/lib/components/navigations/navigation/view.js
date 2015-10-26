Template.navigation.rendered = function(){
  $('#side-menu').metisMenu();
};

Template.navigation.events({
  'click .close-canvas-menu': function(){
    $('body').toggleClass("mini-navbar");
  },

  'click #side-menu>li': function(e) {
    var li = $(e.target).closest('li');

    if(!li.hasClass('nav-header')) {
      if (li.closest("ul").attr("id") == "side-menu") {
        li.addClass('active').children('ul').addClass('in');
        li.siblings().removeClass('active').children('ul').removeClass('in');
      }
    }
  }
});

Template.navigation.helpers({
  today: function() {
    return moment(new Date()).format("YYYY-MM-DD");
  },

  week: function() {
    var today = moment();
    var week = today.format("w");
    week = parseInt(week);
    if(today.format("dd") == "Su") {
      week = (week - 1);
    }
    return week;
  },
  
  year: function() {
    return moment().format("YYYY");
  }
});