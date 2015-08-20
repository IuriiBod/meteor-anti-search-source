Template.areaBox.events({
 'click .garea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("activeGArea", id);

    var sareas = SpecialAreas.find({"generalArea": id}, {sort: {"name": 1}}).fetch();
    if(sareas && sareas.length > 0) {
      Session.set("activeSArea", sareas[0]._id);
    }
  },

  'click .sarea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
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