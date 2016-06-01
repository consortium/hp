// Filename: appView.js
// Copyright AVCO Productions Ltd.
// Author: Daniel Jackson
// Date: 25th July 2015

define(function(require, exports, module, jquery) {
  
  	var $ = require('jquery');

	function AppView(mdlsRef) {
    var self = this;

    this.modelsRef = mdlsRef;

    //this.drawProgressBar();
  }


  AppView.prototype.drawProgressBar = function() {

  	this.canvas = document.getElementById("progress-bar");
	this.ctx = this.canvas.getContext("2d");

	this.numberchapters = this.modelsRef.chapters.length;

	this.canvas.width = $("#chapter-navigation-rhs").width() - 5;
	this.canvas.height = 28;

	this.barWidth = this.canvas.width;
	this.barHeight = this.canvas.height;

	this.barDivision = Math.floor(this.barWidth/this.numberchapters);

  	this.barPosition = this.barDivision + 0.5;

	// Highlight Current Chapter
	var hightlightLeft = (this.modelsRef.chapterNumber - 1) * this.barDivision;

	this.ctx.fillStyle="#FFEEEE";
	this.ctx.fillRect(hightlightLeft, 0, this.barDivision, this.barHeight);

	$("canvas#progress-bar").css("display", "inline");

	// Vertical Chapter Divisions
	for(var i=0; i < this.numberchapters; i++)
	{
		if(i != this.numberchapters-1)
		{
			this.ctx.strokeStyle="#FF0000";
			this.ctx.lineWidth=1;
			this.ctx.beginPath();
			this.ctx.moveTo(this.barPosition,0);
			this.ctx.lineTo(this.barPosition, this.barHeight);

			this.ctx.stroke();
			this.ctx.closePath();
		}

		// Strokes for each mediaItem
		var numMediaItems = this.modelsRef.chapters[i].mediaElements.length;
		var mediaDivision = Math.floor(this.barDivision/numMediaItems);
		var mediaBarPosition =  (this.barDivision * i) + mediaDivision + 0.5;

		if(numMediaItems != 0)
		{
			for(var j=0; j < numMediaItems-1; j++)
			{
				this.ctx.strokeStyle="#FFFF00";
				this.ctx.lineWidth=1;

				this.ctx.beginPath();
				this.ctx.moveTo(mediaBarPosition,0);
				this.ctx.lineTo(mediaBarPosition, this.barHeight);
				this.ctx.stroke();
				this.ctx.closePath();

				mediaBarPosition += mediaDivision;
			}
		}
	
		this.barPosition += this.barDivision;
	}

	
  }

  module.exports = AppView;

  
});