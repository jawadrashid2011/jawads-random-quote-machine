$(function() {
    $.widget("ui.tooltip", $.ui.tooltip, {
        options: {
            content: function() {
                return $(this).prop('title');
            }
        }
    });

    $(document).tooltip();
});

function calculateJumbotronHeight() {
  //Center Container in center of page
  var fullHeight = window.innerHeight; //- $(".headings").outerHeight();
  $(".jumbotron").height(fullHeight);
  $(".container").css('padding-top', fullHeight / 4 + 'px');

  // Center headline in center of page
  var headingLeftPosition = ($(window).innerWidth() - $(".headings").outerWidth()) /2;
  $(".headings").css("left", headingLeftPosition + "px");

  //center footer to bottom
  setTimeout(function(){ 
    var fullHeight = window.innerHeight;
    var footerHeight = $(".footer").outerHeight();
    var footerWidth = $('.footer').outerWidth();

    var footerLeftPosition = ($(window).innerWidth() - footerWidth) /2;

    $(".footer").css("left", footerLeftPosition + "px");
    $(".footer").css("top", (fullHeight - (footerHeight + 20)) + "px");
  }, 500);
  
}
var pixabayJSON = null;

function changeBackground() {
  if (pixabayJSON == null) {
    var key = "3232217-3470d235678827ed374977f54";
    $.getJSON("https://pixabay.com/api/?key=3232217-3470d235678827ed374977f54&category=backgrounds&safesearch=true")
  }
}

$(document).ready(function() {
  calculateJumbotronHeight();
  changeBackground();

  $('[data-toggle="contact"]').tooltip({
    track: true
  });


  $(window).resize(function() {
    calculateJumbotronHeight();
  });
});

