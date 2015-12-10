//var component = FlowComponents.define("receiveModal", function (props) {
//  this.name = props.name;
//  this.onRendered(this.onItemRendered);
//});

//component.state.isWrongPrice = function () {
//  if (this.name == "wrongPrice") {
//    return true;
//  }
//}

//component.state.isWrongQuantity = function () {
//  if (this.name == "wrongQuantity") {
//    return true;
//  }
//}

//component.prototype.onItemRendered = function () {
//  $('[data-toggle="popover"]').popover();
//  $('.i-checks').iCheck({
//    checkboxClass: 'icheckbox_square-green'
//  });
//}