Template.salesPrediction.events({
   'click #loadItems': function (e){
       e.preventDefault();
       FlowComponents.callAction("increaseLimit");
   }
});

Template.salesPrediction.rendered = function() {
    $(window).scroll(function(){
        $('#loadItems').addClass("hidden");
        var docHeight = $(document).height();
        var winHeight = $(window).height();
        var scrollTop = $(window).scrollTop();

        if ((docHeight - winHeight) == scrollTop) {
            $('#loadItems').click();
        }
    });
};

