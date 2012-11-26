/*global $, Modernizr, jQuery*/

$(function() {

	"use strict";

	Modernizr.addTest("macosx", function () {
		var strIndex = navigator.userAgent.toLowerCase().indexOf("mac");
		return (strIndex > -1);
	});

	// MODAL DETECTION
	var restoreTest = ($("html").hasClass("macosx")) ? "macosx" : "no-macosx";
	var showModal = function(title) {
		$('<div />')
			.text("My close button position and button order is determined by the operating system I am being displayed in.")
			.appendTo("body")
			.dialog({
				title: title,
				modal: true,
				width: 400,
				hide: "fade",
				show: "fade",
				buttons: {
					"OK": function() {
						$(this).dialog("close");
					},
					"Cancel": function() {
						$(this).dialog("close");
					}
				}
			});
	};
	$(".modalMac").on("click", function(e) {
		$("html").removeClass("no-macosx").addClass("macosx");
		showModal("Mac Modal");
		e.preventDefault();
	});
	$(".modalWindows").on("click", function(e) {
		$("html").removeClass("macosx").addClass("no-macosx");
		showModal("Windows Modal");
		e.preventDefault();
	});
	$(".modalAuto").on("click", function(e) {
		$("html").removeClass("no-macosx").removeClass("macosx").addClass(restoreTest);
		showModal("Auto Detected");
		e.preventDefault();
	});

});