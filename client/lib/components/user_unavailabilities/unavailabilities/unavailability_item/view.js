Template.unavailabilityItem.events({
    'click #deleteUnavailabilityBtn': function () {
        FlowComponents.callAction('removeUnavailability');
    }
});