// Methods using for convenience
// Maybe should to move them into other place?
Date.prototype.isBetween = function (dateStart, dateEnd) {
  return this.valueOf() >= dateStart && this.valueOf() <= dateEnd;
};

Date.prototype.isBefore = function (date) {
  return this.valueOf() < date.valueOf();
};

Date.prototype.isAfter = function (date) {
  return this.valueOf() > date.valueOf();
};