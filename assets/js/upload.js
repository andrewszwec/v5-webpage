'use strict';

function reportProgress(elem, percentage) {
  elem.css("width", percentage + "%")
}

function setKey(key) {
  $(".AnalysisKeyBox").addClass("AnalysisKeyBox--visible")
  $(".AnalysisKeyBox__key").html(key)
}

function ajaxTheForm(form) {
  var url = form.prop("action")
  var formData = new FormData(form[0]);
  var progressBar = $(".ProgressBar");
  var progressBarBar = $(".ProgressBar__bar");
  progressBarBar.css("width", "0%")
  progressBar.removeClass("ProgressBar--success")
  progressBar.removeClass("ProgressBar--failure")

  var q = $.ajax({
    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
          var percentComplete = 100 * (e.loaded / e.total)
          reportProgress(progressBarBar, percentComplete)
        }
      }, false)

      return xhr
    },
    url: url,
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formData
  })

  q.done(function(data) {
    setKey(data.key)
    progressBar.addClass("ProgressBar--success")
  })

  q.fail(function() {
    progressBarBar.css("width", "0%")
    progressBar.addClass("ProgressBar--failure")
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
