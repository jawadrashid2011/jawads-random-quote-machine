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
var resultPerPage = 20;

function generateNumber(min, max) {
  return Math.ceil(Math.random() * (max - min + 1) + min);
}

function changeBackground() {
  if(pixabayJSON != null) {
    if("hits" in pixabayJSON) {
      var hits = pixabayJSON["hits"];
      var len = hits.length;
      var currentNum = generateNumber(1, len) - 1;
      var currentImage = hits[currentNum];
      if("webformatURL" in currentImage) {
        var imageUrl = currentImage["webformatURL"];
        var formatRegex = /_\d+\./;
        if(formatRegex.test(imageUrl)) {
          imageUrl = imageUrl.replace(formatRegex, '_960.');
        }
        console.log(imageUrl);
        $('.jumbotron-main').css("background-image", "url("+imageUrl+")");  

        
      }
      
    }
  }
}

function getBackgrounds() {
  if (pixabayJSON == null) {
    var key = "3232217-3470d235678827ed374977f54";
    var category = "background";
    var safeSearch = true;
    var totalResults = 500;
    var totalPages = totalResults / resultPerPage;
    var currentPage = generateNumber(1, totalPages);

    var url = "https://pixabay.com/api/?key="+key+"&category="+category+"&safesearch="+safeSearch+"&page="+currentPage;
    try {
      $.getJSON(url, function(data) {
        pixabayJSON = data;
        changeBackground();
      });
    } catch(err) {
      console.log(err);
    }
  }
}

$(document).ready(function() {
  calculateJumbotronHeight();
  getBackgrounds();

  $('[data-toggle="contact"]').tooltip({
    track: true
  });


  $(window).resize(function() {
    calculateJumbotronHeight();
  });
});

