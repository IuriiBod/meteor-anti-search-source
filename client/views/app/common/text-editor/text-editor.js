Template.textEditor.onRendered(function() {
  this.autorun(function () {
    $(".summernote").summernote('code', Template.currentData().initialHtml);
  });

  $('.summernote').summernote({
    focus: false,
    toolbar: [['style', ['bold', 'italic', 'underline', 'clear']],
      ['fontsize', ['fontsize']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['view', ['fullscreen', 'codeview']],
      ['table', ['table']],
      ['insert', ['link']]
    ],
    oninit: function () {
      // Add "open" - "save" buttons
      var imageButton = '<button id="uploadImage" type="button" class="btn btn-default btn-sm btn-small" title="Upload an image" data-event="something" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';
      var fileGroup = '<div class="note-insert btn-group">' + imageButton + '</div>';
      $(imageButton).appendTo($('.note-insert')[1]);
      // Button tooltips
      $('#uploadImage').tooltip({container: 'body', placement: 'bottom'});
      // Button events
      $('#uploadImage').click(function (event) {
        filepicker.pickAndStore(
            {
              extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
              services: ['COMPUTER'],
              multiple: true
            },
            {},
            function (InkBlobs) {
              var doc = (InkBlobs);
              if (doc && doc[0].url) {
                var image = "<img src='" + doc[0].url + "' alt='uploaded image'>";
                if (image) {
                  $(image).appendTo($(".note-editable"));
                }
              }
            });
      });
    }
  });
});

//var component = FlowComponents.define('textEditor', function (props) {
//  this.initialHtml = props.initialHtml || "";
//  this.onRendered(this.renderTextEditor);
//});
//
//component.prototype.renderTextEditor = function () {
//  console.log('created text editor');
//  $('.summernote').summernote({
//    focus: false,
//    toolbar: [['style', ['bold', 'italic', 'underline', 'clear']],
//      ['fontsize', ['fontsize']],
//      ['para', ['ul', 'ol', 'paragraph']],
//      ['height', ['height']],
//      ['view', ['fullscreen', 'codeview']],
//      ['table', ['table']],
//      ['insert', ['link']]
//    ],
//    oninit: function () {
//      // Add "open" - "save" buttons
//      var imageButton = '<button id="uploadImage" type="button" class="btn btn-default btn-sm btn-small" title="Upload an image" data-event="something" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';
//      var fileGroup = '<div class="note-insert btn-group">' + imageButton + '</div>';
//      $(imageButton).appendTo($('.note-insert')[1]);
//      // Button tooltips
//      $('#uploadImage').tooltip({container: 'body', placement: 'bottom'});
//      // Button events
//      $('#uploadImage').click(function (event) {
//        filepicker.pickAndStore(
//          {
//            extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
//            services: ['COMPUTER'],
//            multiple: true
//          },
//          {},
//          function (InkBlobs) {
//            var doc = (InkBlobs);
//            if (doc && doc[0].url) {
//              var image = "<img src='" + doc[0].url + "' alt='uploaded image'>";
//              if (image) {
//                $(image).appendTo($(".note-editable"));
//              }
//            }
//          });
//      });
//    }
//  });
//  $(".summernote").summernote('code', this.initialHtml);
//};
//
//component.state.content = function () {
//  return $('.summernote').summernote('code');
//};