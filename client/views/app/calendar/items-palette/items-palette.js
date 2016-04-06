// context type: (String) calendarType: (String) date: (String)

Template.itemsPalette.onCreated(function () {
  this.eventSettings = HospoHero.calendar.getEventByType(this.data.type);

  this.searchSource = this.AntiSearchSource({
    collection: this.eventSettings.collection,
    fields: [this.eventSettings.titleField],
    searchMode: 'local'
  });

  this.autorun(() => {
    var queryOptions = this.eventSettings.queryOptions(HospoHero.getParamsFromRoute('date'), this.data.calendarType, Meteor.userId());
    this.searchSource.setMongoQuery(queryOptions);
  });

  this.searchSource.search('');
});


Template.itemsPalette.onRendered(function () {
  let color = this.eventSettings.borderColor;

  this.$('.panel-heading').css({
    'background-color': color,
    'border-color': color
  });

  this.$('.panel').css('border-color', color);
});


Template.itemsPalette.helpers({
  panelId () {
    return this.type.replace(' ', '-');
  },

  items () {
    var tmpl = Template.instance();
    let itemTitleField = tmpl.eventSettings.titleField;

    var sortQuery = {
      [itemTitleField]: 1
    };

    let searchResult = tmpl.searchSource.searchResult({sort: sortQuery});

    let userId = Meteor.userId();
    let area = HospoHero.getCurrentArea(userId);

    return searchResult.map((result) => {
      return {
        itemId: result._id,
        type: this.type,
        userId: userId,
        locationId: area.locationId,
        startTime: new Date(),
        endTime: new Date()
      };
    });
  },

  paletteTitle () {
    return Template.instance().eventSettings.title;
  },

  sortableOptions () {
    return {
      group: {
        name: 'newEvents',
        pull: true,
        put: false
      },

      sort: false,

      onRemove (event) {
        // the Crutch: fixes bug when we drag the same event at the second time
        let draggedItem = event.item;
        $(event.srcElement).append(draggedItem);
      },

      // don't remove empty functions!
      onAdd () {}
    };
  }
});


Template.itemsPalette.events({
  'keyup .items-palette-filter': _.throttle(function (event, tmpl) {
    var value = tmpl.$(event.target).val();
    tmpl.searchSource.search(value);
  }, 500, {leading: false})
});