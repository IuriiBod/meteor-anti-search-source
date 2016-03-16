Template.unavailabilitiesTable.helpers({
    date: function() {
        return arguments[0].toLocaleDateString();
    },
    comment: function() {
        return this.comment !== '' ? this.comment : '-';
    }
});