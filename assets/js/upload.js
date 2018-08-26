'use strict';

function reportProgress(elem, percentage) {
  elem.css("width", percentage + "%")
}

function setKey(key) {
  $(".AnalysisKeyBox").addClass("AnalysisKeyBox--visible")
  $(".AnalysisKeyBox__key").html(key)
}

function setResults(text) {
  $(".ResultsBox").addClass("ResultsBox--visible")
  $(".ResultsBox__Text").html(text)
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

function ajaxResultsForm(form) {
  var url = form.prop("action")
  var formData = new FormData(form[0]);

  var q = $.ajax({
    url: url,
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formData
  })

  q.done(function(data) {  
    var i, len;
    if (typeof data.textblob !== 'undefined') { 
      // If textblob is defined in API response   
      var json_str = JSON.stringify(data)
      var obj = JSON.parse(json_str);
      var obj_length = Object.keys(obj.textblob).length;
      var results = '<table style="width:100%"> \
          <tr> \
            <th>Common Jargon</th>\
            <th>Translation</th> \
          </tr>'

      for(i = 0; len = obj_length, i < len; i++) { 
        results += '<tr><td>'+ obj.textblob[i].Input + '</td><td>' + obj.textblob[i].Translation + '</td></tr>';      
      }
      results += '</table>'
      // Render Results
      setResults(results);
    }
    else { 
      setResults(String(data.success)) 
    }
  })

  q.fail(function() {
    console.log("Error Getting Results");
  })
}


function bindUploadForm() {
  // Bind the FileUploadForm
  var form = $(".FileUploadForm");
  console.log("ALIVE: FileUploadForm");
  form.on('submit', function(e) {
    e.preventDefault();
    ajaxTheForm(form)
  })
};

function bindResultsForm() {
  // Bind the GetResultsForm
  var form = $(".GetResultsForm");
  console.log("ALIVE: GetResultsForm");
  form.on('submit', function(e) {
    e.preventDefault();
    ajaxResultsForm(form)
  }) 

};

$(function() {

  bindUploadForm();
  bindResultsForm();

});
