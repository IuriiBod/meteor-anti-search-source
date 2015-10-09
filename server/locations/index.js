Meteor.methods({
  'createLocation': function(loc) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to create location');
    }
    if(Locations.find({organizationId: loc.organizationId, name: loc.name}).count() > 0) {
      throw new Meteor.Error("The location with the same name already exists!");
    }
    var data = OpenWeatherMap._httpGetRequest("/weather",{q:loc.city+","+loc.country});
    if (parseInt(data.cod) >= 400){
      throw new Meteor.Error(data.cod+" "+data.message);
    }
    if (data.sys.country != loc.country || data.name != loc.city){
      throw new Meteor.Error("Bad city name or no that city in this country");
    }
    // Create location
    console.log(loc.openingTime);
    return Locations.insert({
      name: loc.name,
      country: loc.country,
      city: loc.city,
      address: loc.address,
      pos: loc.pos,
      timezone: loc.timezone,
      openingTime: moment(loc.openingTime).toDate(),
      closingTime: moment(loc.closingTime).toDate(),
      organizationId: loc.organizationId,
      createdAt: Date.now()
    });
  },
  'deleteLocation': function(id) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to delete location');
    }
    Areas.remove({locationId: id});
    Locations.remove({_id: id});

    // TODO: Write the code to delete users which is related to location
  },

  'updateLocationName': function(id, val) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to update location');
    }
    var location = Locations.findOne({_id: id});
    if(Locations.find({organizationId: location.organizationId, name: val}).count() > 0) {
      throw new Meteor.Error("The location with the same name already exists!");
    }
    Locations.update({_id: id}, {$set: {name: val}});
  }
});