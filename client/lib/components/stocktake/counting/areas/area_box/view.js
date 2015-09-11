Template.areaBox.events({
 'click .garea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).parent().attr("data-id");
    Session.set("activeGArea", id);
    $(".areaFilering .collapse").removeClass("in");
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
          console.log(err);
          return alert(err.reason);
        }
      });
    } else if(type == "sarea") {
      Meteor.call("deleteSpecialArea", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});

Template.areaBox.helpers({
  activeG: function(id) {
    var garea = Session.get("activeGArea");
    if(garea == id) {
      return true;
    } else {
      return false;
    }
  },

   activeS: function(id) {
    var sarea = Session.get("activeSArea");
    if(sarea == id) {
      return true;
    } else {
      return false;
    }
  },
  
  inActive: function(id) {
    var sarea = Session.get("activeSArea");
    var garea = Session.get("activeGArea");
    if((sarea != id) && (garea != id)) {
      return true;
    } else {
      return false;
    }
  },

});