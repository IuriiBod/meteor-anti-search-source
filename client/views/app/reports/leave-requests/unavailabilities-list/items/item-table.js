Template.unavailabilitiesTable.helpers({
  date: function (date) {
    return HospoHero.dateUtils.dateFormat(date);
  },
  comment: function () {
    return this.comment !== '' ? this.comment : '-';
  }
});