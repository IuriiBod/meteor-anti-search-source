Migrations.add({
  version: 31,
  name: "Remove broken daily sales",
  up: function () {
    var idsToRemove = ['XrXkqcvZZQ8viZCeY', 'kuewEPk2G6sQcr5vQ', 'ZtXttNwYLR6LErBFQ'];
    DailySales.remove({
      menuItemId: {$in: idsToRemove},
      date: TimeRangeQueryBuilder.forDay(moment('Thu Nov 26 2015 12:00:51 GMT+0200 (EET)'))
    });
  }
});