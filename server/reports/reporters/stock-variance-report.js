StockVarianceReport = class {
  constructor(areaId, firstStocktakeGroup, secondStocktakeGroup) {
    this._areaId = areaId;
    this._firstStocktakeGroup = firstStocktakeGroup;
    this._secondStocktakeGroup = secondStocktakeGroup;

    this._initCache();
    this._setDates();
  }

  _initCache() {
    this._menuItemsCostCache = new MenuItemsCostCache(this._areaId);
    this._ingredientsCache = new IngredientsFromArea(this._areaId);
  }

  _setDates() {
    let formatDate = HospoHero.dateUtils.formatTimestamp;
    this._fromDate = formatDate(this._firstStocktakeGroup[0].date);
    this._toDate = formatDate(this._secondStocktakeGroup[0].date);
  }

  someMethod() {
    let menuItemSales = this._getForecastedMenuItemsSales();

    console.log(menuItemSales.length);
  }

  _getForecastedMenuItemsSales() {
    let date = TimeRangeQueryBuilder.forInterval(moment(this._fromDate, 'DD/MM/YY'), moment(this._toDate, 'DD/MM/YY'));
    let query = {
      date: date,
      'relations.areaId': this._areaId
    };

    let options = {
      fields: {
        _id: 0,
        menuItemId: 1,
        predictionQuantity: 1
      }
    };

    return DailySales.find(query, options).fetch();
  }
};