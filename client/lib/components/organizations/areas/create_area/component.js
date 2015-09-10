var component = FlowComponents.define("createArea", function(props) {});

component.state.timezones = function() {
  var zones = [];
  var selectedZone = 0;
  for(var i=-12; i<=12; i++) {
    if(i>0) {
      i = "+"+i;
    }
    if(i == selectedZone) {
      zones.push('<option value="'+i+'" selected="selected">UTC '+i+'</option>');
    } else {
      zones.push('<option value="'+i+'">UTC '+i+'</option>');
    }
  }
  return zones.join('');
};

component.state.openingHours = function() {
  var selectedHour = 8;
  var hours = [];
  for(var i=0; i<24; i++) {
    if(i == selectedHour) {
      hours.push('<option value="'+i+'" selected="selected">'+i+'</option>');
    } else {
      hours.push('<option value="'+i+'">'+i+'</option>');
    }
  }
  return hours.join('');
};

component.state.closingHours = function() {
  var selectedHour = 17;
  var hours = [];
  for(var i=0; i<24; i++) {
    if(i == selectedHour) {
      hours.push('<option value="'+i+'" selected="selected">'+i+'</option>');
    } else {
      hours.push('<option value="'+i+'">'+i+'</option>');
    }
  }
  return hours.join('');
};

component.state.minutes = function() {
  var minutes = [];
  for(var i=0; i<60; i++) {
    if(i<10) {
      i = "0"+i;
    }
    minutes.push('<option value="'+i+'">'+i+'</option>');
  }
  return minutes.join('');
};

component.state.locations = function() {
  var orgId = Session.get('organizationId');
  return Locations.find({organizationId: orgId}).fetch();
};

component.state.activeLocation = function(id) {
  var locationId = Session.get('locationId');
  if(locationId && id == locationId) {
    return true;
  } else {
    return false;
  }
};