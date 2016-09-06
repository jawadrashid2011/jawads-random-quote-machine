/**************** Overriding jQuery UI Tooltip to display html content ****************/
$(function () {
  $.widget("ui.tooltip", $.ui.tooltip, {
    options: {
      content: function () {
        return $(this).prop('title');
      }
    }
  });

  $(document).tooltip();
});

/**************** Calculating Content Position and other elements positions ****************/
function calculateJumbotronHeight() {
  //Center Container in center of page
  var fullHeight = window.innerHeight; //- $(".headings").outerHeight();
  $(".jumbotron").height(fullHeight);
  $(".container").css('padding-top', fullHeight / 4 + 'px');

  // Center headline in center of page
  var headingLeftPosition = ($(window).innerWidth() - $(".headings").outerWidth()) / 2;
  $(".headings").css("left", headingLeftPosition + "px");



  //center footer to bottom
  //setTimeout(function () {
  var fullHeight = window.innerHeight;
  var footerHeight = $(".footer").outerHeight();
  var footerWidth = $('.footer').outerWidth();

  var footerLeftPosition = ($(window).innerWidth() - footerWidth) / 2;

  $(".footer").css("left", footerLeftPosition + "px");
  $(".footer").css("top", (fullHeight - (footerHeight + 20)) + "px");

  //Find Place for refresh button
  var refreshLeftPos = $("#centerContainer").offset().left + $("#centerContainer").innerWidth() - $("#refreshButton").width() - 20;
  var refreshTopPos = $("#centerContainer").offset().top + $("#centerContainer").innerHeight() - $("#refreshButton").height() - 20;
  // $("#refreshButton").removeClass("hidden");
  $("#refreshButton").css("left", refreshLeftPos + "px");
  $("#refreshButton").css("top", refreshTopPos + "px");




  //Find Place for tweet button
  var tweetLeftPos = $("#centerContainer").offset().left + 20;
  var tweetTopPos = $("#centerContainer").offset().top + $("#centerContainer").innerHeight() - $("#tweetButton").height() - 20;
  $("#tweetButton").css("left", tweetLeftPos + "px");
  $("#tweetButton").css("top", tweetTopPos + "px");


  //}, 0);

  //pixabay on bottom left
  // var pixabayHeight = $(".pixabayCredit").outerHeight();
  // $(".pixabayCredit").css("top", (fullHeight - (pixabayHeight + 20)) + "px");

}
var pixabayJSON = null;
var resultPerPage = 20;

function generateNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**************** Changing Background by using results from Pixabay ****************/
function changeBackground() {
  if (pixabayJSON != null) {
    if ("hits" in pixabayJSON) {
      var hits = pixabayJSON["hits"];
      var len = hits.length;
      var currentNum = generateNumber(1, len) - 1;
      var currentImage = hits[currentNum];
      if ("webformatURL" in currentImage) {
        var imageUrl = currentImage["webformatURL"];
        var formatRegex = /_\d+\./;
        if (formatRegex.test(imageUrl)) {
          imageUrl = imageUrl.replace(formatRegex, '_960.');
        }
        $('.jumbotron-main').css("background-image", "url(" + imageUrl + ")");


      }

    }
  }
}

/**************** Initializing Pixabay Backgrounds json by querying api ****************/
function getBackgrounds() {
  if (pixabayJSON == null) {
    var key = "3232217-3470d235678827ed374977f54";
    var category = "background";
    var safeSearch = true;
    var totalResults = 500;
    var totalPages = totalResults / resultPerPage;
    var currentPage = generateNumber(1, totalPages);

    var url = "https://pixabay.com/api/?key=" + key + "&category=" + category + "&safesearch=" + safeSearch + "&page=" + currentPage;
    try {
      $.getJSON(url, function (data) {
        pixabayJSON = data;
        changeBackground();
      });
    } catch (err) {
      console.log(err);
    }
  }
}

/**************** Quote Classes ****************/
function Quote(text, author) {
  this.text = text;
  this.author = author;
}

var quotesManager;
function QuoteManager() {
  this.quotesLibraries = [];
}

QuoteManager.prototype.addLibrary = function (libraryObj) {
  this.quotesLibraries.push(libraryObj);
}

QuoteManager.prototype.getLibary = function () {
  var index;
  if (this.quotesLibraries.length == 1) {
    index = 0;
  } else {
    index = generateNumber(1, this.quotesLibraries.length) - 1;
  }

  return this.quotesLibraries[index];
}

QuoteManager.prototype.getQuote = function () {
  var library = this.getLibary();
  var quotePromise = library.getQuote();
  var that = this;
  quotePromise.done(function (data) {
    var quoteInfo = {
      quote: data,
      apiName: library.apiName,
      apiWebsite: library.apiWebsite,
      apiUrl: library.apiUrl
    }
    that.displayQuote(quoteInfo);
  });

  quotePromise.fail(function (error) {
    console.log(error);
    setTimeout(function () { quotesManager.getQuote() }, 2000);

    //$("#refreshIcon").removeClass("fa-spin");
    //Get New Quote
  });
}

QuoteManager.prototype.setTweetButton = function (quoteInfo) {
  var text = '"' + encodeURIComponent(quoteInfo.quote.text) + '"';
  if ($.trim(quoteInfo.quote.author) !== "") {
    text += ' - ' + encodeURIComponent(quoteInfo.quote.author);
  }
  var baseUrl = "https://twitter.com/intent/tweet?";
  baseUrl += "text=" + text;
  baseUrl += "&url=http://goo.gl/PFEboz";
  baseUrl += "&hashtags=CodePen,JawadRashid";
  $("#tweetButton .btn").attr("href", baseUrl);
}

QuoteManager.prototype.displayQuote = function (quoteInfo) {
  //changeBackground();

  $("#quoteText").html(quoteInfo.quote.text);
  $("#quoteAuthor").html(quoteInfo.quote.author);
  $("#quoteBlock").removeClass("hidden");
  $("#quoteSource").html(quoteInfo.apiName);
  $("#quoteSourceLink").html(quoteInfo.apiName);
  $("#quoteSourceLink").attr("href", quoteInfo.apiWebsite);
  $("#quoteSourceDiv").removeClass("hidden");
  $("#refreshButton .btn").attr("disabled", false);
  $("#tweetButton .btn").attr("disabled", false);

  this.setTweetButton(quoteInfo);

  if ($.trim($("#quoteAuthor").html()) != "") {
    $("#quoteAuthor").removeClass("hidden");
  } else {
    $("#quoteAuthor").addClass("hidden");
  }
  // $("#refreshIcon").removeClass("fa-spin");
}

/**************** Forismatic API ****************/
function ForismaticAPI() {

  this.apiUrl = "http://api.forismatic.com/api/1.0/";
  this.methodName = "getQuote";
  this.apiFormat = "jsonp";
  this.language = "en";
  this.additional = "&jsonp=?";


  this.apiName = "Forismatic";
  this.apiWebsite = "http://forismatic.com/en/";
}

ForismaticAPI.prototype.getUrl = function () {
  this.key = generateNumber(1, 999999);
  return this.apiUrl + "?method=" + this.methodName + "&format=" + this.apiFormat + "&lang=" + this.language + "&key=" + this.key + this.additional;
}

ForismaticAPI.prototype.getQuote = function () {
  var deferredObject = $.Deferred();
  var that = this;
  $.getJSON(this.getUrl(), function (data) {
    try {
      var quote = new Quote(data.quoteText, data.quoteAuthor);
      deferredObject.resolve(quote);
    } catch (ex) {
      deferredObject.reject("Invalid quote");
    }

  }).fail(function (jqxhr, textStatus, error) {
    deferredObject.reject(error);
  });


  return deferredObject.promise();
}

/**************** Andruxnet API ****************/
function AndruxnetAPI() {

  this.apiUrl = "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous";
  this.headers = {
    "X-Mashape-Key": "zgncNAqZsrmshD12mas3IoHZ2K8zp1U3A3JjsnQTjaekA4OAdI",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  };
  this.additional = "&jsonp=?";


  this.apiName = "Andruxnet";
  this.apiWebsite = "https://market.mashape.com/andruxnet/random-famous-quotes";
}

AndruxnetAPI.prototype.getQuote = function () {
  var deferredObject = $.Deferred();
  var that = this;
  $.ajax({
    url: this.apiUrl,
    dataType: "json",
    method: "GET",
    headers: this.headers
  }).done(function (data) {
    try {
      var quote = new Quote(data.quote, data.author);
      deferredObject.resolve(quote);
    } catch (ex) {
      deferredObject.reject("Invalid quote");
    }

  }).fail(function (jqxhr, textStatus, error) {
    deferredObject.reject(error);
  });


  return deferredObject.promise();
}

/**************** QuotesOnDesign API ****************/
function QuotesOnDesignAPI() {

  this.apiUrl = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
  this.additional = "&jsonp=?";

  this.apiName = "Quotes On Design";
  this.apiWebsite = "https://quotesondesign.com/api-v4-0/";
}

QuotesOnDesignAPI.prototype.getUrl = function () {
  this.key = generateNumber(1, 999999);
  return this.apiUrl + "&key=" + this.key;
}

QuotesOnDesignAPI.prototype.stripHtmlContent = function (html) {
  var div = document.createElement("div");
  div.innerHTML = html;
  var text = div.textContent || div.innerText || "";
  return $.trim(text);
}

QuotesOnDesignAPI.prototype.getQuote = function () {
  var deferredObject = $.Deferred();
  var that = this;
  $.getJSON(this.getUrl(), function (data) {
    try {
      var quote = new Quote(that.stripHtmlContent(data[0].content), data[0].title);
      deferredObject.resolve(quote);
    } catch (ex) {
      deferredObject.reject("Invalid quote");
    }

  }).fail(function (jqxhr, textStatus, error) {
    deferredObject.reject(error);
  });

  return deferredObject.promise();
}

/**************** QuotesOnDesign API ****************/
function StormConsultancyQuotesAPI() {

  this.apiUrl = "http://quotes.stormconsultancy.co.uk/random.json";
  this.additional = "&jsonp=?";

  this.apiName = "Storm Consultancy Quotes";
  this.apiWebsite = "http://quotes.stormconsultancy.co.uk/";
}

StormConsultancyQuotesAPI.prototype.getUrl = function () {
  this.key = generateNumber(1, 999999);
  return "http://crossorigin.me/" + this.apiUrl + "?key=" + this.key;
}

StormConsultancyQuotesAPI.prototype.getQuote = function () {
  var deferredObject = $.Deferred();
  var that = this;
  $.getJSON(this.getUrl(), function (data) {
    try {
      var quote = new Quote(data.quote, data.author);
      deferredObject.resolve(quote);
    } catch (ex) {
      deferredObject.reject("Invalid quote");
    }

  }).fail(function (jqxhr, textStatus, error) {
    deferredObject.reject(error);
  });

  return deferredObject.promise();
}

/**************** Quotes Functions ****************/
function initializeQuotes() {
  quotesManager = new QuoteManager();
  quotesManager.addLibrary(new ForismaticAPI());
  quotesManager.addLibrary(new AndruxnetAPI());
  quotesManager.addLibrary(new QuotesOnDesignAPI());
  quotesManager.addLibrary(new StormConsultancyQuotesAPI());
  quotesManager.getQuote();
}

function getNewQuote() {
  // $("#refreshIcon").addClass("fa-spin");
  quotesManager.getQuote();
}


$(document).ready(function () {
  calculateJumbotronHeight();
  //getBackgrounds();
  initializeQuotes();

  $('[data-toggle="contact"]').tooltip({
    track: true
  });

  $('[data-toggle="credit"]').tooltip({
    track: true
  });


  $(window).resize(function () {
    calculateJumbotronHeight();
  });
});


