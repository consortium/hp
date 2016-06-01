// Filename: appModels.js
// Copyright AVCO Productions Ltd.
// Author: Daniel Jackson
// Date: 25th July 2015

define(function(require, exports, module, jquery, jqueryui) {

  var $ = require('jquery');
  var jUI = require('jqueryui');

  // Modules

  function AppController(mdlsRef, vwRef) {

    var self = this;

    this.modelsRef = mdlsRef;
    this.viewRef = vwRef;

    init(self);

    var urlChapterNumber = getQueryVariable("c");
    if(urlChapterNumber != false) {
      self.modelsRef.chapterNumber = urlChapterNumber;
    }

    var urlMediaItemNumber = getQueryVariable("m");
    if(urlMediaItemNumber != false) {
      self.modelsRef.mediaItemNumber = urlMediaItemNumber;
    }
  }

  function init(slfRf) {
    var self = slfRf;

    // Toggle Media and Metadata Display
    $(function(){
      $("#metadata-toggle").click(function () {
          if($('#media-metadata-container').css('display') == 'none') {
            $("#meta-data-close").css('display', 'block');
          }
          else
          {
            $("#meta-data-close").css('display', 'none');
          }

          $("#media-metadata-container").slideToggle("fast");
          $("#mediaData").slideToggle("fast"); 
      });
    });

    // Toggle Close Metadata and open Media
    $(function(){
      $("#meta-data-close").click(function () {
          $("#media-metadata-container").slideToggle("fast");
          $("#mediaData").slideToggle("fast");

          $("#meta-data-close").css('display', 'none');
      });
    });

    // Chapter Menu Functionality

  }

  function getQueryVariable(variable)
  {
         var query = window.location.search.substring(1);
         var vars = query.split("&");
         for (var i=0;i<vars.length;i++) {
                 var pair = vars[i].split("=");
                 if(pair[0] == variable){return pair[1];}
         }
         return(false);
  }

  AppController.prototype.loadStartDataIntoInterface = function() {
    var self = this;

    $("#collection-title h1").html(self.modelsRef.collectionTitle);

    console.log("self.modelsRef.collectionTitle = " + self.modelsRef.collectionTitle);

    /************************/
    /* DROP DOWN MENU START */
    /************************/
    // Create Html for dropdown Chapter Menu
    for(var i=0; i < self.modelsRef.chapters.length; i++)
    {
      var chapterLi = "<li><a href='#' data-chapter-id='" + this.modelsRef.chapters[i].chapterID +"'>" + this.modelsRef.chapters[i].shortChapterTitle + "</a></li>";

      $("#chapter-menu li.main-menu ul").append(chapterLi);
    }

    // Add DropDown Functionality
    $('#chapter-menu li').hover(
        function () {
            //show its submenu
            $('ul', this).stop().slideDown(200);

        }, 
        function () {
            //hide its submenu
            $('ul', this).stop().slideUp(250);            
        }
    );

    $('#chapter-menu li.main-menu ul li').click(function() {
      // Get Chapter Number clicked
      var chapterID = $(this).children("a").attr("data-chapter-id");

      $('#chapter-menu li ul').stop().slideUp(250);  
      // Load Chapter Data
      loadChapterData(self, chapterID);
    });


    /******************/
    /* PREVIOUS NEXT  */
    /******************/
    // NEXT
    $('#nav-next a').click(function() {
      if(self.modelsRef.chapterNumber < self.modelsRef.chapters.length)
      {
        self.modelsRef.chapterNumber += 1;

        // Load Chapter Data
        loadChapterData(self, self.modelsRef.chapterNumber);
      }
    });

    // PREVIOUS
    $('#nav-previous a').click(function() {

      if(self.modelsRef.chapterNumber > 1)
      {
        self.modelsRef.chapterNumber -= 1;

        // Load Chapter Data
        loadChapterData(self, self.modelsRef.chapterNumber);
      }
    });

    /**********/
    /* SHARE  */
    /**********/
    $('#nav-share').click(function() {
      
      // console.log("window.getSelection().anchorNode = " + window.getSelection().anchorNode);
      // console.log(window.getSelection().anchorNode);
      // console.log("window.getSelection().anchorOffset = " + window.getSelection().anchorOffset);
      // console.log("window.getSelection().focusNode = " + window.getSelection().focusNode);
      // console.log("window.getSelection().focusOffset = " + window.getSelection().focusOffset);
      // console.log("window.getSelection().extentOffset = " + window.getSelection().extentOffset);
      

      userSelection = window.getSelection(); 

      var text = self.modelsRef.citationUrl + "index.html?c=" + self.modelsRef.chapterNumber + "&p=" + self.modelsRef.mediaItemNumber;
      window.prompt("Copy to clipboard: PC: Ctrl+C, Enter - OSX Cmd+C, Enter", text);
    });

    loadChapterData(self, self.modelsRef.chapterNumber)

    // self.viewRef.drawProgressBar();
  }
  
  function getSelectedText() {
  t = (document.all) ? document.selection.createRange().text : document.getSelection();

  return t;
  }

  function updateLHSMedia(slfRf, mdItmNo)
  {
    var self = slfRf

    self.modelsRef.mediaItemNumber = mdItmNo;

    var mediaIndex = mdItmNo - 1;
    var chapterIndex = self.modelsRef.chapterNumber - 1;

    // MEDIA DATA
    // Make sure media is visible
    $("#mediaData").html(self.modelsRef.chapters[chapterIndex].mediaElements[mediaIndex].mediaData);

    $("#mediaData img").load(function(){
      console.log($(this).width() + "x" + $(this).height());

      var availableHeight = $('#mediaData').height() - $('#mediaData p.caption').height() - $('#metadata-toggle').height();

      if($(this).height() > availableHeight)
      {
        var newWidth = Math.floor(($(this).width()/$(this).height()) * availableHeight);

        $("#mediaData img").css("width", "auto");
        $("#mediaData img").attr("width", newWidth);
        $("#mediaData img").attr("height", availableHeight);
      }
    });


    // Make sure media metadata is not visible
    if(self.modelsRef.chapters[chapterIndex].mediaElements[mediaIndex].mediaMetadata.metadataStatus == "true")
    {
      var metadataUrl = self.modelsRef.chapters[chapterIndex].mediaElements[mediaIndex].mediaMetadata.metadataHtml;

      $("#media-metadata-container").load(metadataUrl);
    }
    else
    {
      $("#media-metadata-container").html(self.modelsRef.chapters[chapterIndex].mediaElements[mediaIndex].mediaMetadata.metadataHtml);
    }


    // Make sure Media is open and not Metadata
    if($('#mediaData').css('display') == 'none') {

      $("#meta-data-close").css('display', 'none');

      $("#media-metadata-container").slideToggle(0);
      $("#mediaData").slideToggle(0); 
    }



  }

  function loadChapterData(slfRf, chptrID)
  {
    var self = slfRf;

    var chapterIndex = parseInt(chptrID) - 1;

    $("#chapter-title h2").html(self.modelsRef.chapters[chapterIndex].chapterTitle);


    /**************************/
    /* UPDATE CHAPTER NUMBER  */
    /**************************/
    self.modelsRef.chapterNumber = parseInt(chptrID);


    /************************/
    /* UPDATE PROGRESS BAR  */
    /************************/
    // self.viewRef.drawProgressBar();


    /***********************/
    /* FIRST CHAPTER TITLE */
    /***********************/
    $("#chapter-title h2").html(self.modelsRef.chapters[chapterIndex].chapterTitle);


    /************************/
    /* LOAD LHS MEDIA DATA  */
    /************************/
    $("#mediaData").html(self.modelsRef.chapters[chapterIndex].mediaElements[0].mediaData);


    $("#mediaData img").load(function(){

      var availableHeight = $('#mediaData').height() - $('#mediaData p.caption').height() - $('#metadata-toggle').height();

      if($(this).height() > availableHeight)
      {
        var newWidth = Math.floor(($(this).width()/$(this).height()) * availableHeight);

        $("#mediaData img").css("width", "auto");
        $("#mediaData img").attr("width", newWidth);
        $("#mediaData img").attr("height", availableHeight);
      }
    });


    // MEDIA METADATA
    if(self.modelsRef.chapters[chapterIndex].mediaElements[0].mediaMetadata.metadataStatus == "true")
    {
      var metadataUrl = self.modelsRef.chapters[chapterIndex].mediaElements[0].mediaMetadata.metadataHtml;
      $("#media-metadata-container").load(metadataUrl);
    }
    else
    {
      $("#media-metadata-container").html(self.modelsRef.chapters[chapterIndex].mediaElements[0].mediaMetadata.metadataHtml);
    }

    /*****************/
    /* LOAD LHS HTML */
    /*****************/
    $("#lhs-html-container").html(self.modelsRef.chapters[chapterIndex].lhsHtml);

    $('#lhs-html-scroll-window').animate( 
    {scrollTop:'0'},
    600
    );

    // $('#lhs-html-scroll-window').scrollTop(0);

    /***********************************/
    /* UPDATE PREVIOUS NEXT VISIBILITY */
    /***********************************/
    // Previous
    if(self.modelsRef.chapterNumber == 1)
    {
      $('#nav-previous').css('background-image','url(css/images/arrow-left-small-lightgrey.png)');
      $('#nav-previous').addClass('inactive');
      $('#nav-previous').removeClass('active');
    }
    if(self.modelsRef.chapterNumber > 1)
    {
      $('#nav-previous').css('background-image','url(css/images/arrow-left-small.png)');
      $('#nav-previous').addClass('active');
      $('#nav-previous').removeClass('inactive');
    }

    // Next
    if(self.modelsRef.chapterNumber == self.modelsRef.chapters.length)
    {
      $('#nav-next').css('background-image','url(css/images/arrow-right-small-lightgrey.png)');
      $('#nav-next').addClass('inactive');
      $('#nav-next').removeClass('active');
    }
    if(self.modelsRef.chapterNumber < self.modelsRef.chapters.length)
    {
      $('#nav-next').css('background-image','url(css/images/arrow-right-small.png)');
      $('#nav-next').addClass('active');
      $('#nav-next').removeClass('inactive');
    }

    /***********************/
    /* MEDIA UPDATE LINKS  */
    /***********************/
    $('span.update-lhs-link').click(function() {

      var mediaItemNo = $(this).attr("data-lhs-link-id");

      // Remove Highlights
      $('#lhs-html-container p').removeClass('active');

      // Update LHS Media
      updateLHSMedia(self, mediaItemNo);

      // Add Highlight Current to current paragraph
      $(this).parent('p').addClass('active');
    });

    /***********************/
    /* CAMPARATIVE IMAGE LINK  */
    /***********************/
    $('span.comparactive-image-link').click(function() {
      $("#comparative-image-background").css('display', 'block');

      var comparativeItemNo = $(this).attr("data-comp-link-id");

      console.log("comparativeItemNo");
      console.log(comparativeItemNo);
      
      var itemIndex = comparativeItemNo - 1;
      var chapterIndex = self.modelsRef.chapterNumber - 1;


      console.log("self.modelsRef.chapters[chapterIndex].comparativeImages[itemIndex].comparativeData");
      console.log(self.modelsRef.chapters[chapterIndex].comparativeImages[itemIndex].comparativeData);

      // MEDIA DATA
      // Make sure media is visible
      $("#comparative-image").html(self.modelsRef.chapters[chapterIndex].comparativeImages[itemIndex].comparativeData);

      
    });

    // Close Comparative Image
    $('#comparative-image-close').click(function(){
      $("#comparative-image-background").css('display', 'none');
    });

    /****************************/
    /* REFERENCES INSERT LINKS  */
    /****************************/
    $('span.insert-ref-link').click(function() {

      var refItemNo = $(this).attr("data-ref-link-id");

      console.log("Reference Clicked");
      console.log(this);

      if($(this).hasClass('closed'))
      {
        var myFullReference = self.modelsRef.referenceList[refItemNo-1];

        $(this).find("span.full-reference").append(myFullReference);

        $(this).addClass('open');
        $(this).removeClass('closed');
      }
      else
      {
        $(this).find("span.full-reference").empty();

        $(this).addClass('closed');
        $(this).removeClass('open');
      }

    });

    /*****************/
    /* CHAPTER LINKS */
    /*****************/
    $('a.toc').click(function() {
      // Get Chapter Number clicked
      var chapterID = $(this).attr("data-chapter-id");

      // Load Chapter Data
      loadChapterData(self, chapterID);
    });

    // Make sure Media is open and not Metadata
    if($('#mediaData').css('display') == 'none') {

      $("#meta-data-close").css('display', 'none');

      $("#media-metadata-container").slideToggle(0);
      $("#mediaData").slideToggle(0); 
    }
  }

  module.exports = AppController;

});