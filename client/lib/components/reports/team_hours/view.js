Template.teamHours.events({
  'click .shiftView': function(event) {
    document.getElementById("showall_hideempty").innerText="Show All";
    var year = Session.get("thisYear");
    var week = Session.get("thisWeek");
    Session.set("reportHash", "shifts");
    Router.go("teamHours", {"year": year, "week": week}, {hash: 'shifts'});
  },

  'click .hoursView': function(event) {
    document.getElementById("showall_hideempty").innerText="Show All";
    var year = Session.get("thisYear");
    var week = Session.get("thisWeek");
    Session.set("reportHash", "hours");
    Router.go("teamHours", {"year": year, "week": week}, {hash: 'hours'});
  },
  'click .showallView': function(event) {
    var year = Session.get("thisYear");
    var week = Session.get("thisWeek");
    var hash = Session.get("reportHash");
    if(hash=="shifts") {
      document.getElementById("showall_hideempty").innerHTML="Hide Empty";
      Session.set("reportHash", "shiftsall");
      Router.go("teamHours", {"year": year, "week": week}, {hash: 'shiftsall'});
    }
    else if(hash=="hours") {
      document.getElementById("showall_hideempty").innerText="Hide Empty";
      Session.set("reportHash", "hoursall");
      Router.go("teamHours", {"year": year, "week": week}, {hash: 'hoursall'});
    }else if(hash=="shiftsall") {
      document.getElementById("showall_hideempty").innerText="Show All";
      Session.set("reportHash", "shifts");
      Router.go("teamHours", {"year": year, "week": week}, {hash: 'shifts'});
    }else if(hash=="hoursall") {
      document.getElementById("showall_hideempty").innerText="Show All";
      Session.set("reportHash", "hours");
      Router.go("teamHours", {"year": year, "week": week}, {hash: 'hours'});
    }
  }
});
