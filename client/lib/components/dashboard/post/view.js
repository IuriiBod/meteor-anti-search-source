Template.onePost.rendered = function(){
    $(".message-input-comment").val("");
};

Template.onePost.events({
    'click .like-post': function(event) {
        event.preventDefault();
        var idbuf = $(event.target).closest("div").attr("data-id");
        var likes = Posts.findOne({_id: idbuf}).like;
        var currentuid = Meteor.userId();
        if(likes.indexOf(currentuid)<0){
            //var likesarray = countlike.split(",");
            Session.set({"post-like-id":idbuf});
            var likelist="";
            if(likes=='')
                likelist = currentuid;
            else
                likelist =  likes+","+currentuid;
            FlowComponents.callAction('submitlikepost', likelist);
        }

    },
    'keypress .message-input-comment': function(event) {
        if(event.keyCode == 10 || event.keyCode == 13) {
            event.preventDefault();
            var text = $(event.target).val();
            var idbuf = $(event.target).closest("div").attr("data-id");
            Session.set({"comment_post_id":idbuf});
            if(text) {
                FlowComponents.callAction('submitcommenttopost', text);
            }
        }
    }
});

Template.onePost.helpers({
    settings: function() {
        return {
            position: "top",
            limit: 10,
            rules: [
                {
                    token: '@',
                    collection: Meteor.users,
                    field: "username",
                    filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
                    template: Template.user
                }
            ]
        };
    }
});