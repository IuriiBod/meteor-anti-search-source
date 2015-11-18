Template.unavailabilityItem.events({
    'click .remove-unavailability-button': function () {
        FlowComponents.callAction('removeUnavailability');
    }
});