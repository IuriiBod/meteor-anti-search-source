Template.notifiButtons.events({
  'click .readNotification': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("readNotifications", id, HospoHero.handleMethodResult());
    $(".dropdown-notifi").addClass("open");
  },

  'click .goToItem': function(event) {    
    event.preventDefault();
    var ref = $(event.target).attr("data-ref");
    var id = $(event.target).attr("data-id");
    var type = $(event.target).attr("data-type");
    var notifi = Notifications.findOne(id);

    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();

    if(notifi) {
      if(type == "job") {
        Router.go("jobItemDetailed", {"_id": ref});   
      } else if(type == "menu") {
        Router.go("menuItemDetail", {"_id": ref});      
      } else if(type == "comment") {
          if(notifi.refType == "menu") {
            Router.go("menuItemDetail", {"_id": ref});  
          } else if(notifi.refType == "job") {
            Router.go("jobItemDetailed", {"_id": ref});  
          } else if(notifi.refType == "post") {
            Router.go("home", {}, {hash: ref});
          }
      } else if(type == "roster") {
        if(notifi.actionType == "publish") {
          Router.go("weeklyRoster", {"week": ref});
        } else if(notifi.actionType == "confirm" || notifi.actionType == "claim" || notifi.actionType == "update") {
          Router.go("shift", {"_id": ref});
        }
      } else if(type == "newsfeed") {
        if(notifi.relations){
          Meteor.call('changeArea', notifi.relations.areaId, HospoHero.handleMethodResult());
        }
        Router.go("home");
      }
    }
  }
});
