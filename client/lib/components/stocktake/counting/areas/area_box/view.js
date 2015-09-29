Template.areaBox.events({
 'click .garea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).parent().attr("data-id");
    Session.set("activeGArea", id);
    $(".collapse").removeClass("in");
    var sarea = $(event.target).parent().next().find(".areaBox")[0];
    if(sarea) {
      var sId = $(sarea).attr("data-id");
      Session.set("activeSArea", sId);
    } else {
      Session.set("activeSArea", null);
    }
  },

  'click .sarea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).parent().attr("data-id");
    Session.set("activeSArea", id);
  },

  'mouseenter .areaBox': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .areaBox': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  },

  'click .removeArea': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var type = $(event.target).attr("data-type");
    if(type == "garea") {
      Meteor.call("deleteGeneralArea", id, function(err) {
        if(err) {
          HospoHero.alert(err);
        }
      });
    } else if(type == "sarea") {
      Meteor.call("deleteSpecialArea", id, function(err) {
        if(err) {
          HospoHero.alert(err);
        }
      });
    }
  }
});

Template.areaBox.helpers({
  activeG: function(id) {
    var garea = Session.get("activeGArea");
    return garea == id;
  },

   activeS: function(id) {
    var sarea = Session.get("activeSArea");
     return sarea == id;
  },
  
  inActive: function(id) {
    var sarea = Session.get("activeSArea");
    var garea = Session.get("activeGArea");
    return !!((sarea != id) && (garea != id));
  }
});