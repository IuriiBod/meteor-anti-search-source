Template.addEventItemFlyout.onCreated(function () {
  var eventNames = HospoHero.calendar.getEventNames(true);
  this.eventType = new ReactiveVar(eventNames[0]);
});

Template.addEventItemFlyout.onRendered(function () {
  this.$('.events-selector').select2({
    placeholder: "Select an item",
    allowClear: true
  });
});

Template.addEventItemFlyout.helpers({
  eventTypes: function () {
    var eventNames = HospoHero.calendar.getEventNames(true);

    return _.map(eventNames, function (eventName) {
      var event = HospoHero.calendar.getEventByType(eventName);
      return {
        value: eventName,
        title: event.title
      }
    });
  },

  availableEvents: function () {
    var eventObject = HospoHero.calendar.getEventByType(Template.instance().eventType.get());
    return Mongo.Collection.get(eventObject.collection).find(eventObject.queryOptions).map(function (item) {
      return {
        _id: item._id,
        name: item[eventObject.eventSettings.titleField]
      }
    });
  }
});


Template.addEventItemFlyout.events({
  'change .event-item-type': function (event, tmpl) {
    tmpl.eventType.set(event.target.value);
  },

  'change .events-selector': function (event, tmpl) {
    tmpl.data.onEventChange(tmpl.eventType.get(), event.target.value);
  }
});