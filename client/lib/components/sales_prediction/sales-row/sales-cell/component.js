var component = FlowComponents.define('predictionSalesCell', function (props) {
    this.set('predictionQuantity', props.displayItem.predictionQuantity);
    this.set('actualQuantity', props.displayItem.actualQuantity);
    this.menuItem = props.displayItem;
    this.menuId = props.itemId;
});

component.action.getItem = function () {
    return this.menuItem;
};

component.action.getItemId = function () {
    return this.menuId;
};