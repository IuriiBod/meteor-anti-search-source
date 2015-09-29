MockOrderData = function MockOrderData() {
    this.data = moment();
};

MockOrderData.prototype.load = function () {
    var skip = Math.floor(Math.random() * (MenuItems.find().count()-15));
    var items = MenuItems.find({},{skip: skip, limit: 15}).fetch();
    var result = {
        meta: {
            "limit": 5000,
            "offset": 0,
            "total_count": 616142
        },
        objects:[]
    };
    _.each(items, function (item) {
        var pushObject ={
            created_date: this.data.toDate().toString(),
            product_name_override: item.name,
            quantity: Math.floor(Math.random() * 10 +1)
        }
        result.objects.push(pushObject);
    });
    this.data.substract(1, "d");
    return result
};

