Template.itemsPalette.onCreated(function () {
  this.item = HospoHero.calendar.getEventByType(this.data.type);

  this.searchSource = this.AntiSearchSource({
    collection: this.item.collection,
    fields: [this.item.eventSettings.titleField],
    searchMode: 'local'
  });

  var tmpl = this;
  this.autorun(function () {
    var queryOptions = tmpl.item.queryOptions(HospoHero.getParamsFromRoute('date'), tmpl.data.calendarType, Meteor.userId());
    tmpl.searchSource.setMongoQuery(queryOptions);
  });

  this.searchSource.search('');
});


Template.itemsPalette.onRendered(function () {
  // Sorry, Taras
  var eventItemSettings = this.item.eventSettings;
  this.$('.panel-heading').css({
    'background-color': eventItemSettings.backgroundColor,
    'border-color': eventItemSettings.borderColor
  });

  this.$('.panel').css('border-color', eventItemSettings.borderColor);
});


Template.itemsPalette.helpers({
  panelId: function () {
    return this.type.replace(' ', '-');
  },
  items: function () {
    var tmpl = Template.instance();
    var item = tmpl.item;
    var sortQuery = {
      [item.eventSettings.titleField]: 1
    };

    return tmpl.searchSource.searchResult({sort: sortQuery});
  },

  eventItem: function () {
    return Template.instance().item;
  }
});


Template.itemsPalette.events({
  'keyup .items-palette-filter': _.throttle(function (event, tmpl) {
    var value = tmpl.$(event.target).val();
    tmpl.searchSource.search(value);
  }, 500)
});