var component = FlowComponents.define('submitIngredient', function(props) {
    var isModal = props.isModal || false;
    this.set('isModal', isModal);
});
