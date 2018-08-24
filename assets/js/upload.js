'use strict';

function reportProgress(elem, percentage) {
  console.log(percentage);
}

function ajaxTheForm(form) {
  var url = form.prop("action")
  var file = form.find("input[name=file]")[0].files[0]
  var progressBar = $(".ProgressBar")


  var q = $.ajax({
    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
          var percentComplete = 100 * (e.loaded / e.total)
          reportProgress(progressBar, percentComplete)
        }
      }, false)

      return xhr
    },
    url: url,
    type: "PUT",
    contentType: 'binary/octet-stream',
    processData: false,
    data: file
  })

  q.done(function(data) {
    console.log("DONE", data)
    progressBar.prop("value", 0)
  })

  q.fail(function() {
    console.log("Failure")
    progressBar.prop("value", 0)
  })
}

function bindUploadForm() {
  var form = $(".FileUploadForm");
  console.log("ALIVE");
  form.on('submit', function(e) {
    e.preventDefault();
    ajaxTheForm(form)
  })
};

$(function() {

  bindUploadForm();

});
