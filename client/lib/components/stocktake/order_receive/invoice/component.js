var component = FlowComponents.define("invoiceImage", function(props) {
  this.id = props.id;
  // this.onRendered(this.onImageRendered);
});

component.state.imageUrl = function() {
  var receipt = OrderReceipts.findOne(this.id);
  if(receipt && receipt.invoiceImage) {
    return receipt.invoiceImage;
  }
}

// component.prototype.onImageRendered = function() {
//   blueimpImageFullScreen();
// }


// blueimpImageFullScreen = function() {
//   if($("#links").length > 0) {
//     document.getElementById('links').onclick = function (event) {
//       event = event || window.event;
//       var target = event.target || event.srcElement,
//         link = target.src ? target.parentNode : target,
//         options = {index: link, event: event},
//         links = this.getElementsByTagName('a');
//       blueimp.Gallery(links, options);
//     };
//   }
// }