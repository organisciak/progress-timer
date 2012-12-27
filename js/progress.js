//PROGRESS CLASS
var progress = (function() {
	//PRIVATE VARIABLES
	var input = {
		"barWidth": 500,
		"bars": [
			/*{
			"type": "counter",
			"name": "Manual",
			"key": "sdffbs3",
			"note": "...and a note",
			"start": 0,
			"end": 100,
			"current": 30
		}*/
			],
		"settings": {
			"lastTip" : -1,
			"tipShow" : false,
		}
	},
	opts = {
		debug: false
	},
	tips = [
	{
	"preamble":"Dueling bars 2",
	"tip":"Sometimes it's useful to have a counter bar next to a clock or timer. If you have a deadline to hit the end of your counter (e.g. \"write 400 words in 2 hours\"), you can make sure that you stay on track.",
	"image":"images/dueling-bars.png"
	},
	{
	"preamble":"Idea: tracking your weight loss.",
	"tip":"Did you know that progress bars can count down? Set the start of the bar as your starting weight, and the end as your target.",
	}, 
	{
	"preamble":"Sorting progress bars",
	"tip":"Click and drag on an empty spot of a progress bar slip to sort progress bars to your preferred order.",
	}, 
	{
	"preamble":"Super-secret pro-tip: Curly notation",
	"tip":"If you write numbers between curly braces in the description of a counter timer, the progress bar will add them up and set them as the current progress. This is an experimental feature, but really useful sometimes.",
	}
	
	],
	sample_items = [
				{"title": "Losing Weight", "description":"Tracking my progress to my goal weight.","start":220, "current":190, "end":180},
				{"title": "Essay Progress", "description":"Toward a max word count of 6000", "start":0, "current":5000, "end":6000},
				{"title": "Days until Christmas", "description":"", "start":"Dec 1", "current":"Dec 18", "end":"Dec 24"},
				{"title": "Work Day", "start":0, "description":"The end is coming..", "current":6, "end":8},
				{"title": "Pokemon Collection", "description":"Gotta catch 'em all!", "start":0, "current":150, "end":100},
			],
		pageWidth = document.width <= 1200 ? document.width : 1200,
		pageMargin = 170,
		containerWidth = pageWidth - pageMargin * 2,
		slipMargin = 10,
		slipWidth = containerWidth - slipMargin * 2,
		barWidth = slipWidth - slipMargin * 2,

	//PRIVATE FUNCTIONS
		//UTILITY FUNCTIONS
		log = function() {
			if (opts.debug === true) {
				log.history = log.history || [];
				log.history.push(arguments);
				if (this.console) {
					console.log(Array.prototype.slice.call(arguments));
				}
			}
		},
		msToday = function(date) {
			/* Return the number of milliseconds since the start of the day. */
			if (typeof date == 'number') {
				date = new Date(date);
			}
			v = new Date(date);
			v.setHours(0,0,0,0);
			return (date.getTime() - v.getTime() );
		},
		sumArr = function(arr) {
			/* Sum all the values in an array */
			var sum = 0;
			for (var i=0; i<arr.length; i++) {
				sum = sum + arr[i];
			}
			return sum;
		},
		parseDescription = function(text) {
			/*
			Check description for numbers in the format {0}. All numbers between curly braces are added and the value is returned.
			*/
			var re=/\{(-?[\d\.]+?)\}/g, //Find integers between curly braces (including negative numbers and decimals)
				values = text.match(re),
				newCount = null;
			
			if (values !== null) {	
				/*
				Count the max precision after the decimal place, then use toFixed() to overcome floating point numbers problems
				*/
				max_precision = 0;
				values = values.map(function(d){ 
					var v = d.replace("{", "").replace("}", "");
					decimals = v.split(".");
					precision = decimals.length > 1 ? decimals[1].length : 0;
					max_precision = precision > max_precision ? precision : max_precision;
					return parseFloat(v);
					});
				return parseFloat(sumArr(values).toFixed(max_precision));
			} else {
				return null;	
			}
			
		},
		format = function(value, type) {
			//Format text based on the bar type
			if (type === "counter") {
				return value;
			} else if (type === "clock") {
				date = new Date(value);
				return date.toLocaleString();
			} else if (type === "timer") {
				time = msToFullTime(value);
				return time.hours + ":" + leadingZero(time.minutes) + ":" + leadingZero(time.seconds);
			} else {
				throw "No valid bar type";
			}
		},
		progressLocation = function(data, fullWidth) {
			current = (function() {
				if (data.type === "timer" && data.progress.start) {
					return data.current + new Date().getTime() - data.progress.start;
				} else {
					return data.current;
				}
			})();
			var countUp = (data.start < data.end);
			if (current <= data.start && countUp) {
				percentage = 0;
			} 
			else if (current >= data.end && countUp) {
				percentage = 1;
			} 
			else if (current <= data.end && !countUp) {
				percentage = 1;
			} 
			else if (current >= data.start && !countUp) {
				percentage = 0;
			} else {
				percentage = countUp ? (current - data.start) / (data.end - data.start) : (data.start - current) / (data.start - data.end);
			}
			var location = percentage * fullWidth;
			return location;
		},
		generateKey = function() {
			return Math.floor(
			Math.random() * 0x1000000).toString(16);
		},
		leadingZero = function(int) {
			return (int > 9 ? "" + int : "0" + int);
		},
		getCurrentVal = function(d) {
			var currentTime = (new Date()).getTime(),
				c = d.current;
			if (d.type === "clock") {
				c = currentTime;
			} else if (d.type === "timer" && d.progress.start) {
				c = d.current + (currentTime - d.progress.start);
			}
			return c;
		},
		formatDate = function(date) {
			var y = date.getFullYear(),
				m = 1 + date.getMonth(),
				d = date.getDate();
			m = leadingZero(m);
			d = leadingZero(d);
			return y + "-" + m + "-" + d;
		},
		formatHour = function(date) {
			var h = date.getHours(),
				m = leadingZero(date.getMinutes());
			return h + ":" + m;
		},
		msToFullTime = function(milliseconds) {
			hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
			minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
			seconds = Math.floor(milliseconds / (1000)) % 60;
			return {
				"hours": hours,
				"minutes": minutes,
				"seconds": seconds
			};
		},
		checkDataQuality = function(type, index) {
			/*
			Check if data in the add dialog is possible, if not then
			show warning.
			
			Assumes dialog has class "dialog".
		*/
			$(".ui-dialog-buttonpane .errors").remove();
			$(".ui-dialog-buttonpane .alerts").remove();
			var values = {}, errors = [],
				alerts = [],
				warnings = [],
				values = getDialogValues(type, index);
			if (type === "clock") {
				if (values.start > values.end) {
					errors.push("Start time must be before end time. You can't move back in time, man.");
				} else if (values.start === values.end) {
					errors.push("Start and end times need to be different.");
				} else if (values.current > values.end) {
					alerts.push("Hey, not to alarm you, but your end time is in the past.");
				}
			} else if (type === "timer") {
				if (values.end < values.start) {
					errors.push("It's not a back-in-timer, just a plain timer.");
				} else if (values.end === values.start) {
					errors.push("You can't have a null time progress bar.");
				} else if (values.current > values.end) {
					alerts.push("Hey, your timer has already ended. Maybe you want to reset?");
				}
			} else if (type === "counter") {
				var low = values.start,
					high = values.end,
					current = values.current;
				if (low > high) {
					alerts.push("This counter will count down.");
					low = values.end;
					high = values.start;
				} else if (low === high) {
					errors.push("Start and end values need to be different");
				}
				if (current > high) {
					alerts.push("Note that current value is higher than end point.");
				} else if (current < low) {
					alerts.push("Note that current value is lower than start point.");
				}
				if (current < 0 || low < 0 || high < 0) {
					errors.push("Sorry, values cannot be below zero. Did you know that you can count down though?");
				}
			}

			if (errors.length >= 1) {
				$(".ui-dialog-buttonpane")
					.append("<div class='errors ui-state-error'><span class='ui-icon ui-icon-alert' style='float: left; margin-right: .3em;'></span></div>");
				$(":button:contains('OK')").prop("disabled", true).addClass("ui-state-disabled");
			} else {
				$(":button:contains('OK')").prop("disabled", false).removeClass("ui-state-disabled");
			}
			
			if (alerts.length >= 1) {
				$(".ui-dialog-buttonpane")
					.append("<div class='alerts ui-state-highlight'><span class='ui-icon ui-icon-info' style='float: left; margin-right: .3em;'></span></div>");
			}
			for (var i = 0; i < errors.length; i++) {
				var error = errors[i];
				$(".ui-dialog-buttonpane .errors").append(error + "</br>");
			}
			
			for (var i = 0; i < alerts.length; i++) {
				var alert = alerts[i];
				$(".ui-dialog-buttonpane .alerts").append(alert + "</br>");
			}
		},
		getTimeOffset = function() {
			//Since start/end times are in UTC but user obviously isn't UTC, this offers a workaround with LocaleString
			/*a = new Date(); 
			b= new Date(a.toLocaleString()).getTime() - a.getTime();
			return b;*/
			return (new Date()).getTimezoneOffset()*60*1000;
		},
		getDialogValues = function(type, index) {
			/* 
		Get start/current/end values from the add/edit dialog. 
		
		Returns an object: {"start": start, "current":current, "end":end};
		*/
			var start, current, end;
			switch (type) {
				case 'counter':
					start = parseFloat($("input[name='counter-start']").attr("value")),
					current = parseFloat($("input[name='counter-current']").attr("value")),
					end = parseFloat($("input[name='counter-end']").attr("value"));
					break;
				case 'timer':
					var hours = parseInt($("input[name='hours']").attr("value"), 10),
						minutes = parseInt($("input[name='minutes']").attr("value"), 10),
						seconds = parseInt($("input[name='seconds']").attr("value"), 10);
					start = 0,
					current = (index === undefined) ? 0 : input.bars[index].current,
					//In milliseconds
					end = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
					break;
				case 'clock':
					var offset = getTimeOffset(),
						startDate = $("input[name=start-date]").datetimepicker('getDate'),
						endDate = $("input[name=end-date]").datetimepicker('getDate'),
					start = new Date(startDate).getTime(),
					current = (new Date()).getTime(),	
					end = new Date(endDate).getTime();
					break;
			}
			return {
				"start": start,
				"current": current,
				"end": end
			};
		},
		//COMPATIBILITY FUNCTIONS
		isDateInputSupported = function() {
			/*
		Check if Browser doesn't support HTML date picker. Used for falling
		back on jQuery Datepicker.
		From http://updates.html5rocks.com/2012/08/Quick-FAQs-on-input-type-date-in-Google-Chrome
		*/
			var elem = document.createElement('input');
			elem.setAttribute('type', 'date');
			elem.value = 'foo';
			return (elem.type == 'date' && elem.value != 'foo');
		},
		//TIMER FUNCTIONS
		startTimer = function(selection) {
			index = input.bars.indexOf(selection);
			if (input.bars[index].type === "timer" && !input.bars[index].progress.start) {
				input.bars[index].progress.start = new Date().getTime();
			}
			progress.save();

		},
		resetTimer = function(selection) {
			index = input.bars.indexOf(selection);
			if (input.bars[index].type === "timer") {
				input.bars[index].current = 0;
				if (input.bars[index].progress.start) {
					//If timer was running at the time of reset, delete progress and start again.
					delete input.bars[index].progress.start;
					startTimer(selection); //Starting also includes a data save
				} else {
					progress.save();
				}
			}

		},
		pauseTimer = function(selection) {
			index = input.bars.indexOf(selection);
			if (input.bars[index].type === "timer" && input.bars[index].progress.start) {
				var start = input.bars[index].progress.start,
					current = new Date().getTime();
				delete input.bars[index].progress.start;
				//Upon disengaging the timer, save the temporary
				//Date() timer progress into the 'current' var
				input.bars[index].current = input.bars[index].current + (current - start);

				progress.save();
			}
		},
		toggleTimer = function(selection) {
			index = input.bars.indexOf(selection);
			if (input.bars[index].progress.start) {
				pauseTimer(selection);
			} else {
				startTimer(selection);
			}
		},
		//D3 FUNCTIONS
		update = function(selection) {
			var currentTime = (new Date()).getTime();
			selection.selectAll("h2").text(function(d) {
				return d.name;
			});
			selection.selectAll(".note").text(function(d) {
				return d.note;
			});
			
			var progress = selection.selectAll(".progress");
			progress.transition()
				.duration(300)
				.attr("width", function(d) {
				if (d.type === "clock") {
					d.current = currentTime;
				}
				return progressLocation(d, barWidth);
			});
			//Sometimes a user editing a bar changes the start or end
			d3.selectAll(".slip.active .start")
				.text(function(d) {
				return format(d.start, d.type);
			});
			d3.selectAll(".slip.active .end")
				.text(function(d) {
				return format(d.end, d.type);
			});
			
			d3.selectAll(".slip.active")
			.each(function(d){ 
				if (d.type !== "counter") {
					return;
				}
				var that = d3.select(this),
					buttons = that.selectAll(".change-counter");
				if (d.curly === true && buttons[0].length > 0) {
					buttons.remove();
				} else if (d.curly === false && buttons[0].length < 0) {
					//TODO: Add buttons back here
				}
			});

			//Update text for current progress
			//Currently, everything below happens twice, once for the text 
			//outline and once for the foreground text
			d3.selectAll(".slip.active .current")
				.classed("highlight", function(d) {
						var c = getCurrentVal(d);
						if ((d.start < d.end) && (c > d.end || c < d.start)) {
							return true;
						} else if ((d.start > d.end) && (c < d.end || c > d.start)) {
							return true;
						} else {
							return false;
						}
					})
				.classed("inactive", function(d) {
					if (d.type === "timer" && d.progress.start === undefined) {
						return true;
					} else {
						return false;
					}
				})
				.text(function(d) {
					var c = getCurrentVal(d);
					return format(c, d.type);
				})
				.transition()
				.duration(function(d) { 
					if (d.type === "timer" && d.progress.start === undefined) {
						//If a paused timer, slowly animate to nothing
						return 1000
					} else if (d.type === "timer" && new Date().getTime() - d.progress.start < 1000) {
						//If a paused timer that was recently unpaused, ease back into the rhythm
						return 1000
					} else {
						return 300
					}
				})
				.attr("x", function(d) {
					var textBoundingWidth = $(this)[0].getBBox().width,
						loc = progressLocation(d, barWidth);
					if (loc + slipMargin < textBoundingWidth/2) {
						//If at the very start of the bar, position text so that it 
						//doesn't go beyond edges
						return textBoundingWidth/2 + + slipMargin;
					} else if (loc + slipMargin > slipWidth-textBoundingWidth/2) {
						//Same correction for the end of the bar
						return slipWidth - textBoundingWidth/2 - slipMargin;
					} else {
						return loc + slipMargin;
					}
				});
				

			$("#container").sortable({
				placeholder: "ui-sortable-placeholder",
				axis: "y",
				containment: "parent",
				items: ".slip.active",
				cancel: "h2, span",
				start: function(event, ui) {
					start = ui.item.prevAll(".slip.active").length;
				},
				update: function(e, ui) {
					end = ui.item.prevAll(".slip.active").length;
					log(end);
					bar = input.bars.splice(start, 1);
					input.bars.splice(end, 0, bar[0]);
					saveLocalData();
				}
			});
		},
		enter = function(selection) {
			//START DEBUG
			selection.append("button").attr("class", "delete-button")
				.text("X").style("float", "right")
				.on("click", slipDelete);

			$(".delete-button").text("").button({
				text: false,
				icons: {
					primary: "ui-icon-closethick"
				}
			});

			selection.append("button").attr("class", "edit-button")
				.text("Edit").style("float", "right")
				.on("click", slipEdit);

			$(".edit-button").text("").button({
				text: false,
				icons: {
					primary: "ui-icon-pencil"
				}
			});

			$("button").button();

			addCounterButtons(selection);
			
			selection.filter(function(d, i) {
				return d.type == "timer";
			})
				.append("button")
				.attr("class", "timer-toggle")
				.text("Start/Pause")
				.style("float", "right")
				.on("click", toggleTimer);

			selection.filter(function(d, i) {
				return d.type == "timer";
			})
				.append("button")
				.attr("class", "timer-reset")
				.text("Reset")
				.style("float", "right")
				.on("click", resetTimer);
			//           .call(toggleTimer);
			// END DEBUG

			selection.append("h2");
			selection.append("p").append("span").attr("class", "note");
			var bar = selection.append("svg")
				.attr("width", slipWidth)
				.attr("height", 45)
				.attr("class", "bar")
				.append("g")
				.attr("transform", "translate(" + 0 + "," + 10 + ")");

			bar.append("rect")
				.attr("class", "bar-outline")
				.attr("width", barWidth)
				.attr("height", 20)
				.attr("x", slipMargin);

			var progress = bar.append("rect")
				.attr("class", "progress")
			//.attr("width", function(d){return progressLocation(d, barWidth)})
			.attr("height", 20)
				.attr("x", slipMargin);
				
			//Start text
			bar.append("text")
				.attr("class", "start")
				.text(function(d) {
				return format(d.start, d.type);
			})
				.attr("x", slipMargin)
				.attr("y", 31);
			//progress text
			
			//progress text - background
			bar.append("text")
				.attr("class", "current current-background")
			.attr("y", 15);
			
			bar.append("text")
				.attr("class", "current")
			.attr("y", 15);
			
			//End text
			bar.append("text")
				.attr("class", "end")
				.attr("text-anchor", "start")
				.text(function(d) {
				return format(d.end, d.type);
			})
				.attr("x", barWidth + slipMargin)
				.attr("y", 31);
		},
		addCounterButtons = function(selection) {
			var counters = selection.filter(function(d, i) {
				return d.type === "counter" && d.curly !== true;
			});

			d = 500;
			var counterValues;
			if (d < 40) counterValues = [1, 5, 10];
			if (d < 80) counterValues = [1, 5, 10];
			else if (d < 120) counterValues = [1, 5, 50];
			else if (d < 500) counterValues = [1, 10, 100];
			else counterValues = [1, 10, 100];

			counterValues = counterValues
				//Add the 0 value that stands in for the quick edit button (TODO)
				.concat([0])
				//Add negative versions to counter values
				.concat(counterValues.map(function(v) {
					return -v;
				}))
				//Sort descending (since buttons are places right to left
				.sort(function(a, b) {
					return b - a;
				});

			for (var i = 0; i < counterValues.length; i++) {
				var v = counterValues[i];
				if (v !== 0) {
					counters.append("button")
						.attr("class", "change-counter")
						.text((v >= 0 ? "+" : "-") + v)
						.style("float", "right")
						.on("click", (function(val) {
						return function(d) {
							changeCounter(d, val);
						};
					})(v) ///Yay private closures!
					);
				} else {
					// TODO: Make quick edit button
					//counters.append("button").html("Quick<br/>Edit").style("float", "right")
				}
			}
		},
		slipAdd = function(key, type, name, note, start, end, current) {
			if (!current) {
				current = start;
			}
			var newBar = {
				"key": key,
				"type": type,
				"name": name,
				"note": note,
				"start": start,
				"end": end,
				"current": current
				//"direction" : ((start>=end) ? "normal" : "reverse")
			};

			if (type === "timer") {
				newBar.progress = {
					"start": new Date().getTime(),
					"current": null
				};
			}
			input.bars.push(newBar);
			progress.save();
			progress.draw();
		},
		slipDelete = function(selection) {
			index = input.bars.indexOf(selection);
			input.bars.splice(index, 1);
			progress.save();
			progress.draw();
		},
		slipEdit = function(selection) {
			index = input.bars.indexOf(selection);
			draw.editDialog(index);
			progress.save();
			progress.draw();
		},
		//DATA FUNCTIONS
		changeCounter = function(data, change) {
			index = input.bars.indexOf(data);
			input.bars[index].current = parseInt(input.bars[index].current, 10) + parseInt(change, 10);
			progress.save();
			progress.draw();
		},
		saveLocalData = function() {
			/* 
		Save data to local storage as a JSON string
		*/
			//Stringify JSON
			var str = JSON.stringify(input);
			localStorage.setItem('progressData', str);
			return;
		},
		loadNewData = function(json) {
			/* 
		Load new JSON object to input var
		
		TODO:
		- checks to make sure the data is well-formed
		*/
			input = json;
			progress.save();
			progress.draw();
			return;
		},
		loadLocalData = function() {
			/* 
		Load local storage JSON string and parse to object 
		*/
			var str = localStorage.getItem('progressData');
			if (str === null || str === "") {
				//Use default data (see input variable above)
				progress.draw();

			} else {
				input = JSON.parse(str);
				parseDataTypes();
				progress.draw();
			}
			return;
		},
		parseDataTypes = function() {
			for (var i=0;i<input.bars.length;i++) {
				input.bars[i].start = parseFloat(input.bars[i].start);
				input.bars[i].current = parseFloat(input.bars[i].current);
				input.bars[i].end = parseFloat(input.bars[i].end);
			}
			input.settings = input.settings ? input.settings : {};
			input.settings.lastTip = input.settings.lastTip ? parseInt(input.settings.lastTip) : -1;
			input.settings.tipShow = (typeof(input.settings.tipShow) !=="undefined") ? input.settings.tipShow : true;
		},
		deleteLocalData = function() {
			/* 
		Remove Local storage data
		*/
			localStorage.removeItem('progressData');
		},
		//MENU DRAWING
		draw = (function() {
			/* 
			Functions for drawing certain elements
		*/
			var checkMinMax = function() {
				var min = parseInt($(this).attr("min"), 10);
				var value = parseInt($(this).attr("value"), 10);
				var max = parseInt($(this).attr("max"), 10);

				if (value < min) {
					$(this).attr("value", min);
				} else if (value > max) {
					$(this).attr("value", max);
				}
			},
			boundCurrent = function(start, current, end) {
				/*
				Make the 'current' slider bound between the start and end
				value, with provisions to account for either count-up or count-down
				*/
				var startVal = parseInt(start.attr("value"), 10),
					endVal = parseInt(end.attr("value"), 10),
					currentVal = parseInt(current.attr("value"), 10);
				if (startVal < endVal && currentVal < startVal) {
					/** Lower than min on count-up */
					current.attr("value", startVal);
				} else if (startVal < endVal && currentVal > endVal) {
					/** Higher than max on count-up */
					current.attr("value", endVal);
				} else if (startVal > endVal && currentVal > startVal) {
					/** Higher than max on count-down */
					current.attr("value", startVal);
				} else if (startVal > endVal && currentVal < endVal) {
					/** Lower than min on count-down */
					current.attr("value", endVal);
				}
			};
			return {
				descriptionBoxes: function(parentDiv, data) {
					$("<div class='progress-description'>")
						.html("<strong>Title</strong><br/>" + "<input type='text' name='title-input'>" + "<br/><strong>Description</strong>" + "<textarea name='description-input'>")
						.appendTo(parentDiv);

					if (data !== undefined) {
						$("input[name='title-input']").attr("value", data.name);
						$("textarea[name='description-input']").attr("value", data.note);
					}
				},
				clockControls: function(parentDiv, data) {
					var offset = getTimeOffset(),
						start = new Date( new Date().getTime() ),
						end = new Date(start);
						end.setMinutes(start.getMinutes() + 60);
					if (data !== undefined) {
						start = new Date(data.start);
						end = new Date(data.end);
					}
					parentDiv.empty();
					$("<div class='choose-timer'>")
						.html("<h3>Choose start time</h3>" + "<input type='text' name='start-date'>")
						.appendTo(parentDiv);
					//Choose end time
					$("<div class='choose-timer'>")
						.html("<h3>Choose end time</h3>" + "<input type='text' name='end-date'>")
						.appendTo(parentDiv);

					$('input[name="start-date"]')
						.datetimepicker({
							//altField: "input[name='start-time']",
							hourGrid: 6,
							minuteGrid: 15
						})
						.datetimepicker("setDate", start);
					$("input[name='end-date']")
						.datetimepicker({
							//altField: "input[name='end-time']",
							hourGrid: 6,
							minuteGrid: 15
						})
						.datepicker("setDate", end);
					/*$("input[name='start-time']")
						//Initialize timespinner
							.timepicker({
								 })
							.timepicker("value", msToday(start)+offset ); //set timespinner value
							
					$("input[name='end-time']")
						.timespinner({ stop: function( event, ui ) {checkDataQuality("clock");} })
						.timespinner("value", msToday(end)+offset);
					

					$("input[name='start-date'], input[name='end-date']").change(function() {
						checkDataQuality("clock");
					});*/
				},
				timerControls: function(parentDiv, data, index) {
					parentDiv.empty();
					var detailDiv = $("<em>A timer lets you count down for a given amount of time. Like an egg timer!</em><br/>").appendTo(parentDiv);

					var startDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 0)
						.appendTo(parentDiv);
					$("<h3>Hours</h3>").appendTo(startDiv);
					$("<input type='number' name='hours' min='0'>")
						.css("width", "4em")
						.attr("value", "0")
						.appendTo(startDiv)
						.change(function() {
							checkDataQuality("timer");
						});

					var currentDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 125)
						.appendTo(parentDiv);
					$("<h3>Minutes</h3>").appendTo(currentDiv);
					$("<input type='number' name='minutes' min='0' max='59'>")
						.css("width", "3em")
						.attr("value", "1")
						.appendTo(currentDiv)
						.change(function() {
							checkDataQuality("timer");
						});

					var endDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 250)
						.appendTo(parentDiv);
					$("<h3>Seconds</h3>").appendTo(endDiv);
					$("<input type='number' name='seconds' min='0' max='59'>")
						.css("width", "3em")
						.attr("value", "0")
						.appendTo(endDiv)
						.change(function() {
							checkDataQuality("timer");
						});

					//$("input[type=number]").spinner();

					if (data !== undefined) {
						var end = msToFullTime(new Date(data.end)),
							current;
						if (data.progress.start) {
							current = data.current + (new Date().getTime() - data.progress.start);
							//Pause and restart timer, to save updated progress
						} else {
							current = data.current;
						}
						$("input[name='hours']").attr("value", end.hours);
						$("input[name='minutes']").attr("value", end.minutes);
						$("input[name='seconds']").attr("value", end.seconds);

						var progressNote = $("<p style='position:absolute;top:130px;'>Your current timer progress is " + format(current, "timer") + ".</p>")
							.append(

						)
							.appendTo(detailDiv);

						$("<button>Reset progress?</button>").click(function() {
							resetTimer(data);
							pauseTimer(data);
							progressNote.html("Timer is reset. Currently paused.");
						})
							.appendTo(progressNote);
					}
					$(parentDiv).find("input").change(function() {
						checkDataQuality("timer", index);
					});
				},
				counterControls: function(parentDiv, data) {
					/* 
				Clears parent object and adds new controls for using the counter type.
				*/
					parentDiv.empty();
					$("<em>A counter lets you track progress between two numbers. You have to manually set the current place.</em><br/>").appendTo(parentDiv);

					var startDiv = $("<div style='position:absolute;width:150px;'>")
						.css("left", 0)
						.appendTo(parentDiv);
					$("<h3>Start Value</h3>").appendTo(startDiv);
					$("<input type='number' name='counter-start' min='0'>")
						.css("width", "4em")
						.attr("value", "0")
						.change(function() {
						checkDataQuality("counter");
					})
						.appendTo(startDiv);
					var currentDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 125)
						.appendTo(parentDiv);
					$("<h3>Current Value</h3>").appendTo(currentDiv);
					$("<input type='number' name='counter-current' min='0'>")
						.css("width", "4em")
						.attr("value", "0")
						.appendTo(currentDiv)
						.change(function() {
						checkDataQuality("counter");
					});

					var endDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 250)
						.appendTo(parentDiv);
					$("<h3>End Value</h3>").appendTo(endDiv);
					$("<input type='number' name='counter-end' min='0'>")
						.css("width", "4em")
						.attr("value", "100")
						.appendTo(endDiv)
						.change(function() {
						checkDataQuality("counter");
					});

					if (data !== undefined) {
						$("input[name=counter-start]").attr("value", data.start);
						$("input[name=counter-current]").attr("value", data.current);
						$("input[name=counter-end]").attr("value", data.end);
					}
				},
				editDialog: function(index) {
					/*
					Load dialog for adding or editing progress bars.
					@arg index: (optional) The index of the progress bar in 
						the app data. If empty, creates a new bar dialog.
				*/
					var oldData;
					if (index !== undefined) {
						oldData = input.bars[index];
					}
					var dialog = $("<div class='dialog'>").appendTo("#container");

					//Add Title and Optional description inputs
					var detailsDiv = $("<div id='details-div'>").appendTo(dialog);
					draw.descriptionBoxes(detailsDiv, oldData);
					//Block for contextual controls
					var contextDiv = $("<div id='context-div'>").prependTo(dialog);
					//Draw contextual controls and track for changes in bar type
					function drawControls(type) {
						switch (type) {
							case 'counter':
								draw.counterControls(contextDiv, oldData, index);
								break;
							case 'timer':
								draw.timerControls(contextDiv, oldData, index);
								break;
							case 'clock':
								draw.clockControls(contextDiv, oldData, index);
								break;
						}
					}
					if (index !== undefined) {
						/* If editing an existing bar. */
						$(".dialog").attr("title", "Edit an existing progress bar.");
						type = input.bars[index].type;
						$("input[name='title-input']").attr("value", input.bars[index].title);
						$("textarea[name='description-input']").attr("value", input.bars[index].description);
					} else {
						/* If adding a new bar */
						$(".dialog").attr("title", "Add a new progress bar.");
						//Choose bar type
						$("<h3>Choose progress bar type</h3>").appendTo(detailsDiv);
						$("<div id='choose-type'>")
							.html("<input type='radio' name='bar-type' value='Counter' checked>Counter" + "<input type='radio' name='bar-type' value='Timer'>Timer" + "<input type='radio' name='bar-type' value='Clock'>Clock")
							.appendTo(detailsDiv);
						type = $(".dialog input[name=bar-type]:checked").attr("value").toLowerCase();
						$(".dialog input[name=bar-type]").change(function() {
							type = $(this).attr("value").toLowerCase();
							drawControls(type);
						});
					}
					drawControls(type);

					$(dialog).dialog({
						autoOpen: true,
						width: 800,
						modal: true,
						height: 425,
						resizable: false,
						buttons: {
							"OK": function() {
								var key = generateKey(),
									curly = false;

								//Get Start and end values
								var values = getDialogValues(type, index),
									title = $("input[name='title-input']").attr("value"),
									description = $("textarea[name='description-input']").val();
								
								if (type === 'counter') {
									newCurrent = parseDescription(description);
									if (newCurrent !== null) {
										values.current = newCurrent;
										curly = true;
									} 
								}
								
								if (index !== undefined) {
									$.extend(input.bars[index], {
										"name": title,
										"note": description,
										"start": parseFloat(values.start),
										"current": parseFloat(values.current),
										"end": parseFloat(values.end),
										"curly":curly
									});
									console.log(input);
								} else {
									slipAdd(key, type, title, description,
									parseFloat(values.start), parseFloat(values.end), parseFloat(values.current));
								}
								
								dialog.remove();
							},
							"Cancel": function() {
								dialog.remove();
							}
						}
					});

				}
			};
		})(),
		setNewTip = function() {
			var nextTip = input.settings.lastTip+1<tips.length ? input.settings.lastTip+1:0,
				tip = tips[nextTip],
				fields = ["preamble","tip","image","example"];
			
			for (var i=0; i<fields.length;i++) {
				field = fields[i];
				if (tip[field] && tip[field] !== "") {
					var val = tip[field];
					if (field ==="image") {
						val = "<img src='"+val+"' />";
					}
					$(this).children("."+field)
						.html(val).show();
				} else {
					$(this).children("."+field).hide();
				}
			}
			input.settings.lastTip = nextTip;
		},
		prepareDialogs =function() { 
			//Defaults for all
			$(".dialog")
				.dialog({autoOpen: false, modal: true, resizable: false});

			//Setting Dialog
			$(".tip-toggle")
				.change(function() {
					var status = $(this).is(':checked');
					input.settings.tipShow = status;
					$(".tip-toggle").attr('checked', input.settings.tipShow);
					saveLocalData();
					});
					
			//Export Data Dialog
			$(".export.dialog").dialog({
				width: 800,
				open: function( event, ui ) {
					var str = JSON.stringify(input);
					$(".export.dialog textarea").text(str);
				},
				buttons: {
					"Close": function() {
						$(this).dialog("close");
					}
				}
			});
			//Import Data Dialog
			$("#import-dialog").dialog({
				width: 800,
				buttons: {
					"Import": function() {
						//Parse text, if there's an error than hopefully it will happen before sending to progress.load
						var input = JSON.parse($('#input-box').attr("value"));
						progress.load(input);
						$(this).dialog("close");
						document.location.reload();
					},
					"Cancel": function() {
						$(this).dialog("close");
					}
				}
			});		
			//Data reset dialog
			$(".delete.dialog").dialog({
				buttons: {
					"Delete all data": function() {
						deleteLocalData();
						progress.load();
						progress.draw();
						$(this).dialog("close");
					},
					Cancel: function() {
						$(this).dialog("close");
					}
				}
			});
			//Tips Dialog
			$(".tips.dialog").dialog({
				width: 700,
				open: setNewTip, //End Open
				buttons: {
					"New tip": setNewTip
				} //End buttons
			});
			//debug dialog
			$(".debug.dialog").dialog({
				modal: false, 
				resizable: true
			});
			
			//Introduction dialog
			$(".introduction.dialog").dialog({
				modal: false, 
				width: 500,
				buttons: {
					"Add a Bar" : function() {
						draw.editDialog();
						$(this).dialog("close");
						}
				}
			});
		},
		postLoad = function() {
			//Set correct settings
			$(".tip-toggle")
				.attr('checked', input.settings.tipShow)
				
			//Set-up Sample Bar
			var example = d3.selectAll(".slip.disabled");
			example.select(".bar-outline").attr("width", barWidth);
			example.select(".progress").attr("width", barWidth*0.75);
			
			var sample = sample_items[Math.floor(Math.random()*sample_items.length)];
			example.select("h2").text(sample.title);
			example.select(".note").text(sample.description);
			example.select(".start").text(sample.start);
			example.select(".current").text(sample.current);
			example.select(".end").text(sample.end);
			
			//If data is empty, draw the add dialog
			if (input.bars.length === 0) {
				//Show introduction window
				$(".introduction.dialog").dialog("open");
				return false;
			} else if (input.settings.tipShow) {
				$(".tips.dialog").dialog("open");
			};
			
		};

	return {
		load: function(json) {
			/*
			Load data. If json is specified, load new data. 
			*/
			//Initialise dialogs
			prepareDialogs();
			//Load Data
			if (json) {
				loadNewData(json);
			} else {
				loadLocalData();
			}
			
			//Add saving event for page unload
			$(window).unload(function() {
				progress.save();
			});
			
			postLoad();
		},
		save: function() {
			/*Public wrapper for saving.*/
			saveLocalData();
		},
		draw: function(debug) {
			/*
		Update the progress bar drawing. This implements the 
		Enter-Update-Exit model for D3.
		
		*/
			if (input === undefined) {
				progress.load();
			}
			if (debug !== undefined) {
				opts.debug = debug;
			}
			var container = d3.select("#container")
				.style("width", containerWidth);
				//.style("margin", "0 " + pageMargin + "px");

			var slips = container.selectAll(".slip.active")
				.data(input.bars, function(d) {
				return d.key;
			});

			//ENTER
			slips.enter().insert("div", ".slip.disabled")
				.attr("class", "slip active ui-widget-content")
				.call(enter);

			//UPDATE
			slips.call(update);

			//EXIT
			slips.exit().transition()
				.duration(300)
				.style("overflow", "hidden")
				.style("padding", 0 + "px 0")
				.style("height", 0 + "px")
				.remove();
		},
		add: function() {
			draw.editDialog();
		},
		reset: function() {
			$(".delete.dialog").dialog("open");
		},
		exportData: function() {
			/* Show a window with the full data string for the app */
			$(".export.dialog").dialog("open");
			
		},
		importData: function() {
			/* Show a window where you can input previously output data. */
			$(".import.dialog").dialog("open");
		},
		settingsMenu: function() {
			$(".settings.menu.dialog").dialog("open");
		}
	};
})();
var msToFullTime = function(milliseconds) {
			hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
			minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
			seconds = Math.floor(milliseconds / (1000)) % 60;
			return {
				"hours": hours,
				"minutes": minutes,
				"seconds": seconds
			};
		};
var fullTimeToMs = function(str) {
			/*
			Takes string in format hh:mm:ss and converts to milliseconds
			*/
			str = str.split(":");
			return (str[0] * 60 * 60 * 1000) + (str[1] * 60 * 1000) + (str[2] * 1000);
		};
//JQUERY TIMESPINNER EXTENSION (http://jqueryui.com/spinner/#time)
$.widget( "ui.timespinner", $.ui.spinner, {
        options: {
            // seconds
            step: 60 * 1000,
            // hours
            page: 60
        },
       _parse: function( value ) {
		
            if ( typeof value === "string" ) {
                // already a timestamp
                if ( Number( value ) == value ) {
                    return Number( value );
                }
		a = Globalize.parseDate( value );
                return +Globalize.parseDate( value );
            }
            return value;
        },
        _format: function( value ) {
             a = Globalize.format( new Date(value), "t" );
             return a;
        }
    });

//Main on-load script
jQuery(document).ready(function() {
	progress.load();
	progress.draw(true);
	
	//DEBUGGING
	var timer;
	timer = window.setInterval(function() {
		progress.draw();
	}, 1000);

	$(".add-question, .header .add.button").click(progress.add);
	$("#set").button().click(function() {
		timer = window.setInterval(function() {
			progress.draw();
		}, 1000);
	});
	$("#clear").button().click(function() {
		clearInterval(timer);
	});
	$("#debug").button().click(function(){
		$(".debug.dialog").dialog("open");
	});
	$(".header .tips.button").click(function(){
		$(".tips.dialog").dialog("open");
	});
	$(".header .help.button").click(function(){
		$(".introduction.dialog").dialog("open");
	});
	$("#reset").button().click(progress.reset);
	$("#export").button().click(progress.exportData);
	$("#import").button().click(progress.importData);
	$(".header .settings.button").click(progress.settingsMenu);
});