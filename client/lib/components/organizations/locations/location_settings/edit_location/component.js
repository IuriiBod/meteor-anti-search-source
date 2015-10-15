var component = FlowComponents.define('editLocation', function (props) {
  this.set('location', props.location);
});

component.action.getLocation = function () {
  return this.get('location');
};

component.action.getCountry = function () {
  if(this.get('location')) {
    var shortName = this.get('location').country;
    var countries = HospoHero.otherUtils.getCountries();

    for (var i in countries) {
      if (countries[i].value == shortName) {
        return countries[i].text;
      }
    }
  }
};