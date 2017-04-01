/*global $:false, jQuery:false, window:false */
$(window).load(function () {
  $(window).resize(function() {
    drawConnections();
  });

  // Usability: improving how the user codes with the site
  drawConnections();
  test();
  $("#input textarea").keydown(function (e) {
    if (e.keyCode == 189 && ($("#input textarea").val()).length == 0) {
      console.log("bumped up")
      $("#input textarea").attr("maxlength", 4);
    } else if (!(($("#input textarea").val()).substring(0, 1) == "-")) {
      $("#input textarea").attr("maxlength", 3);
    } 

    if (e.keyCode == 13 && $("#input textarea").attr("readonly") != "readonly") {
      console.log("ENTER")
      e.preventDefault();
      useInput();
    }


    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
         // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
         // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
         // Allow: home, end, left, right
        (e.keyCode == 189 && ($("#input textarea").val()).length == 0) ||
        // Allow: minus as long as it is the first character
        (e.keyCode == 189 && ($("#input textarea").val()).length < 3 && this.selectionStart == 0) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             // let it happen, don't do anything
             return;
    }

    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

  $('#dimensions').html($(".lmc").width() + ' x ' + $(".lmc").height());
  $(window).resize(function(){
    $('#dimensions').text($(".lmc").width() + ' x ' + $(".lmc").height());
  });

  $(".lined").linedtextarea(
    {selectedLine: 1}
  );

  $("#yourcode").keydown(function(e) {
      if(e.keyCode === 9) { // Tab was pressed
          // Get caret position/selection
          var start = this.selectionStart;
          var end = this.selectionEnd;

          var $this = $(this);
          var value = $this.val();

          // Set textarea value to: text before caret + 4spaces + text after caret
          $this.val(value.substring(0, start)
                      + "    "
                      + value.substring(end));

          // Put caret at right position again (add four for the spaces)
          this.selectionStart = this.selectionEnd = start + 4;

          // Prevent the focus lose
          e.preventDefault();
      }
  });

  filenamePat = /[^\w\.]+/ig;
  $("#codename > input").blur(function() {
      if (this.value.match(filenamePat) !== null) {
        this.value = this.value.replace(filenamePat, "");
        swal({    title: "Bad letters!",
                  text: "The name you entered had some characters in it that shouldn't be in a file name, so we took them out. Only use the alphabet, numbers and underscores please!",
                  type: "warning",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "I promise to never ever do it again!",
                  closeOnConfirm: false });
      }

  });


  // Reactions: when the user clicks on certain elements, stuff happens
  $('#download').click(function(){
    var pycode = $("#yourcode").val();
    var data = new Blob([pycode], {type: 'text/plain;charset=utf-8'});    // Create a blob with the user's code

    if ($("#codename > input").val() == "") {
      $("#codename > input").val("code")
    }
    var name = $("#codename > input").val() + ".lmc";
    saveAs(data, name);            // Save as code.lmc using the FileSaver.js
  });

  var extPatt = /\.[0-9a-z]+$/i;      // Extension pattern matcher

  $('#open').click(function(){          // When the open button is clicked
    $('#upfile').click();               // Pretend to click the (hidden) file input
  });                                   // Hid it because it's ugly and hard to style (not sure if you can!)

  $('#upfile').change(function(e){      // If the uploaded file is changed
    f = e.target.files[0];              
    name = f.name;                      // Get uploaded file name
    $("#codename > input").val(name.replace(extPatt, ""));
    var r = new FileReader();           // File reader initiated

    r.onload = function(e) {                            // Once the reader has loaded...
                if (name.match(extPatt) == '.lmc') {     // Checks if extension is .lmc
                  $("#yourcode").val(e.target.result);   // Change the editor value
                } else {                                // Throw an alert with Sweet Alert
                  swal({  title: "Where's the Python code?",
                          text: "You didn't upload a Python file! It should end in <code>.lmc</code> to work. For example: <code>swagstuff.lmc</code>",
                          html: true,
                          type: "error" });
                  //swal("Liar!", "You didn't upload a Python file! It should end in <pre>.lmc</pre> to work.", "error");
                }
              };
    r.readAsText(f);      // Says to read file as text (as it will be Python)
    $(this).val(null)     // Clear the file, makes sure user can upload a file of the same name

  });

});

$(document).ready(function() {
  if (document.cookie.indexOf("visited") >= 0) {
      firstTime = false;
  } else {
      document.cookie = "visited";
      firstTime =true;
  }

  // Warnings: if a user uses an old browser, all the upload elements will be hidden as a precaution
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var safari = navigator.userAgent.indexOf("Safari") > -1;

    if (safari && !chrome) {
      console.log(navigator.userAgent)
      $('#codename').hide();
      $(window).load(function() {
        if (firstTime) {
          swal( { title: "#SafariProblems",
                  text: "Safari doesn't save files like we do! When clicking download, you have to press <code>&#8984 + s</code> at the same time, and name the file something ending in <code>.lmc</code>",
                  html: true,
                  type: "warning" });
        }
      });

    }
  } else {  // This user needs to update their web browser! Tell them...
    swal( "It's 2016.",
          "Your browser is so old that you can't use our file uploading and downloading features! Get an update, or try Google Chrome.",
          "error" );
    $('.filec').hide();
  }
});


