//PROGRESS CLASS
var progress = (function() {
	//PRIVATE VARIABLES
	var input = {
		"barWidth": 500,
		"bars": [
			{
			"type": "counter",
			"name": "Manual",
			"key": "sdffbs3",
			"note": "...and a note",
			"start": 0,
			"end": 100,
			"current": 30
		}
			]
	},
	opts = {
		debug: false
	},
	version = [
		{
		"number": "0.05",
		"new": []
	}
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
			return (date.getTime() - v.getTime());
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
				return date.toLocaleTimeString();
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
			var values = {}, errors = [],
				alerts = [],
				warnings = [];
			if (type !== "timer") {
				/**Since timers don't need a data quality check, don't bother with 
			getting values. We still want to run this check to remove earlier 
			errors (i.e. if you have an error with the counter, then switch to
			timer) and reactivate the OK button **/
				values = getDialogValues(type, index);
			}
			if (type === "clock") {
				if (values.start > values.end) {
					errors.push("Start time must be before end time.");
				} else if (values.start === values.end) {
					errors.push("Start and end times need to be different");
				}
				if (values.current > values.end) {
					errors.push("End time must be in the future.");
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
				if (current > high || current < low) {
					errors.push("Current value must be between start and end values.");
				}
			}

			if (errors.length >= 1) {
				$(".ui-dialog-buttonpane").append("<div class='errors ui-state-error'></div>");
				$(":button:contains('OK')").prop("disabled", true).addClass("ui-state-disabled");
			} else {
				$(":button:contains('OK')").prop("disabled", false).removeClass("ui-state-disabled");
			}

			for (var i = 0; i < errors.length; i++) {
				var error = errors[i];
				$(".ui-dialog-buttonpane .errors").append("ERROR:" + error + "</br>");
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
						startDate = $("input[name=start-date]").attr("value"),
						startTime = $("input[name=start-time]").timespinner( "value" ),
						endDate = $("input[name=end-date]").attr("value"),
						endTime = $("input[name=end-time]").timespinner( "value" );
					start = new Date(startDate).getTime()+ msToday(startTime),
					current = (new Date()).getTime(),	
					end = new Date(endDate).getTime() + msToday(endTime);
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
			d3.selectAll(".start")
				.text(function(d) {
				return format(d.start, d.type);
			});
			d3.selectAll(".end")
				.text(function(d) {
				return format(d.end, d.type);
			});

			//Update text for current progress
			//Currently, everything below happens twice, once for the text 
			//outline and once for the foreground text
			d3.selectAll(".current")
				.transition()
				.duration(300)
				.text(function(d) {
					var c = d.current;
					if (d.type === "clock") {
						c = currentTime;
					} else if (d.type === "timer" && d.progress.start) {
						c = d.current + (currentTime - d.progress.start);
					}
					if (d.start < d.end) {
						return format((c <= d.end ? c : d.end), d.type);
					} else if (d.start > d.end) {
						return format((c >= d.end ? c : d.end), d.type);
					}
				})
				.attr("x", function(d) {
					return progressLocation(d, barWidth) + slipMargin;
				})
				.style("fill", function(d) {
					if (d.type === "timer" && d.progress.start === undefined) {
						return "#ccc";
					} else {
						return;
					}
				})
				;

			$("#container").sortable({
				placeholder: "ui-state-highlight",
				axis: "y",
				containment: "parent",
				items: "> .slip",
				cancel: "h2, span",
				start: function(event, ui) {
					start = ui.item.prevAll().length;
				},
				update: function(e, ui) {
					end = ui.item.prevAll().length;
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
			//.text(function(d){ if(d.progress.start){return "Pause"} else return {"Start"}})
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
			var counterValues = [1, 5, 10, 50];

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
					counters.append("button").text((v >= 0 ? "+" : "-") + v).style("float", "right")
						.on("click", (function(val) {
						return function(d) {
							changeCounter(d, val);
						};
					})(v) ///Yay private closures!
					);
				} else {
					//TODO: MAKE A QUICK EDIT BUTTON
					/*
		counters.append("button").html("Quick<br/>Edit").style("float", "right")
		*/
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
			if (str === null) {
				input = {
					"barWidth": 500,
					"bars": []
				};
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
		},
		deleteLocalData = function() {
			/* 
		Remove Local storage data
		*/
			localStorage.removeItem('progressData');
		};
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
						start = new Date( new Date().getTime() + offset ),
						end = new Date(start);
					end.setMinutes(start.getMinutes() + 60);
					if (data !== undefined) {
						start = new Date(data.start + offset);
						end = new Date(data.end + offset);
					}

					parentDiv.empty();
					$("<div class='choose-timer'>")
						.html("<h3>Choose start time</h3>" + "<input type='text' name='start-date'>" + "<input name='start-time'>")
						.appendTo(parentDiv);
					//Choose end time
					$("<div class='choose-timer'>")
						.html("<h3>Choose end time</h3>" + "<input type='text' name='end-date'>" + "<input name='end-time'>")
						.appendTo(parentDiv);

					$('input[name="start-date"]')
						.datepicker({})
						.datepicker("setDate", start);
					$('input[name="end-date"]')
						.datepicker({})
						.datepicker("setDate", end);
					$("input[name='start-time']")
							.timespinner()							//Initialize timespinner
							.timespinner("value", msToday(start) ); //set timespinner value
					$("input[name='end-time']")
						.timespinner()
						.timespinner("value", msToday(end) );

					$(parentDiv).find("input").change(function() {
						checkDataQuality("clock");
					});
				},
				timerControls: function(parentDiv, data, index) {
					log(data);
					parentDiv.empty();
					var detailDiv = $("<em>A timer lets you count down for a given amount of time. Like an egg timer!</em><br/>").appendTo(parentDiv);

					var startDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 0)
						.appendTo(parentDiv);
					$("<h3>Hours</h3>").appendTo(startDiv);
					$("<input type='number' name='hours' min='0'>")
						.css("width", "4em")
						.attr("value", "0")
						.appendTo(startDiv);

					var currentDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 125)
						.appendTo(parentDiv);
					$("<h3>Minutes</h3>").appendTo(currentDiv);
					$("<input type='number' name='minutes' min='0' max='59'>")
						.css("width", "3em")
						.attr("value", "1")
						.appendTo(currentDiv);

					var endDiv = $("<div style='position:absolute;width:125px;'>")
						.css("left", 250)
						.appendTo(parentDiv);
					$("<h3>Seconds</h3>").appendTo(endDiv);
					$("<input type='number' name='seconds' min='0' max='59'>")
						.css("width", "3em")
						.attr("value", "0")
						.appendTo(endDiv);

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
						//var newVal = $(this).attr("value");
						// Commented out: you should be able to have bars that go in the negatives
						//$("input[name=counter-current]").attr("min", parseInt(newVal));
						//$("input[name=counter-end]").attr("min", parseInt(newVal)+1);
						//$("input").each(checkMinMax);
						//boundCurrent($("input[name=counter-start]"),$("input[name=counter-current]"),$("input[name=counter-end]"));
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
						//boundCurrent($("input[name=counter-start]"),$("input[name=counter-current]"),$("input[name=counter-end]"));
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
						//var newVal = $(this).attr("value");
						//boundCurrent($("input[name=counter-start]"),$("input[name=counter-current]"),$("input[name=counter-end]"));
						//$("input[name=counter-current]").attr("max", parseInt(newVal));
						//$("input[name=counter-start]").attr("max", parseInt(newVal)-1);
						//$("input").each(checkMinMax);
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
							log("Changed type to " + type);
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
		})();

	return {
		load: function(json) {
			/*
			Load data. If json is specified, load new data. 
		*/
			if (json) {
				loadNewData(json);
			} else {
				loadLocalData();
			}
			//If data is empty, draw the add dialog
			if (input.bars.length === 0) {
				progress.add();
				return false;
			}
			
			//Add saving event for page unload
			$(window).unload(function() {
			progress.save();
			});
		},
		save: function() {
			//Public rapper for saving.
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
				.style("width", containerWidth)
				.style("margin", "0 " + pageMargin + "px");

			var slips = container.selectAll(".slip")
				.data(input.bars, function(d) {
				return d.key;
			});

			//ENTER
			slips.enter().append("div")
				.attr("class", "slip ui-widget-content")
			//.style("background", "blue")
			.style("padding", 4 + "px " + slipMargin + "px")
				.style("width", slipWidth + "px")
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
			var dialog = $("<div class='dialog'>Are you sure?</div>")
				.appendTo("#container");

			dialog.dialog({
				resizable: false,
				//height:140,
				title: "Clear Data",
				modal: false,
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


		},
		exportData: function() {
			/* 
				Show a window with the full data string for the app 
				*/
			var str = JSON.stringify(input);
			$("<div title='Export your data' id='export-dialog'>If you'd like all your information back, select all the text in the box and then copy it.<br/><textarea readonly='true'>" + str + "</textarea></div>")
				.appendTo("body")
				.dialog({
				autoOpen: true,
				width: 800,
				modal: true,
				resizable: false,
				buttons: {
					"Close": function() {
						$(this).remove();
					}
				}
			});
		},
		importData: function() {
			/* 
				Show a window where you can input previously output data. 
				*/
			$("<div title='Import your data' id='import-dialog'>Paste your previously exported information below. </em>Importing information will overwrite your current progress bars.</em><br/><textarea id='input-box'></textarea></div>")
				.appendTo("body")
				.dialog({
				autoOpen: true,
				width: 800,
				modal: true,
				buttons: {
					"Import": function() {
						//Parse text, if there's an error than hopefully it will happen before sending to progress.load
						var input = JSON.parse($('#input-box').attr("value"));
						progress.load(input);
						$(this).remove();
					},
					"Cancel": function() {
						$(this).remove();
					}
				}
			});
		}
	};
})();


//

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
