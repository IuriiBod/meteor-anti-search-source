MockOrderItemDataSource = function MockOrderItemDataSource() {
  this.currentDate = moment();
};

MockOrderItemDataSource.prototype.load = function () {
  var skip = Math.floor(Math.random() * (MenuItems.find().count() - 15));
  var items = MenuItems.find({}, {skip: skip, limit: 15}).fetch();
  var result = {
    meta: {
      "limit": 5000,
      "offset": 0,
      "total_count": 616142
    },
    objects: []
  };

  var self = this;

  _.each(items, function (item) {
    var pushObject = {
      created_date: self.currentDate.format('YYYY-MM-DDTHH:mm:ss'),
      product_name_override: item.name,
      quantity: Math.floor(Math.random() * 10 + 1)
    };
    result.objects.push(pushObject);
  });
  this.currentDate.subtract(1, "d");
  return result
};

