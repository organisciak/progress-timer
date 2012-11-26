==V2==
TODO: Pause refreshing when screen is out of focus
TODO: Add browser checks (with Modernizer?). Don't allow browsers that don't work.
TODO: Collapsible bars. Show in one link, with time and an unlabeled, thin bar using up the rest of the space.
TODO: Color picking for bars (for psuedo grouping)
TODO: save user data to cloud
TODO: tooltip on icon only buttons
TODO: update size on window resize
TODO: group-able bars
TODO: Convert datepicker to jQuery (http://updates.html5rocks.com/2012/08/Quick-FAQs-on-input-type-date-in-Google-Chrome)
TODO: Confirmation warning when people reset a timer.
TODO: Confirmation warning when deleting a progress bar.
TODO: Convert input boxes to jQuery ui spinners (when not in chrome)
TODO: Copy to clipboard option, so people can paste progress in email e.g.
		TITLE : DESCRIPTION
		At B in progress from A to C
		[===================|-----] 80%
TODO: bell or alert when a clock or timer ends
TODO: "Last working backup": When a page loads successful, save a backup. Add a functionality to restore when a page isn't working.
TODO: Feedback form
TODO: Reminder to rate (after 6th load)
TODO: Handles alerts for add/edit dialog (in checkDataQuality function)
TODO: Switch bar to jQuery UI progressbar?
TODO: Remove D3 altogether
TODO: Curly Notation - add ability to change end with the notation: {1000/2000}
BUG: Setting counter to -10/-100/100 doesn't give an error
DONE: string backup / restore in settings menu

==Future==
TODO: Use Globalize for number parsing and dates (https://github.com/jquery/globalize)
TODO: Is this worth it: http://trentrichardson.com/examples/timepicker/ ?
TODO: Favicon progress bar (an option on a bar lets you set that bar to favicon)
TODO: Incremental alerts for clocks or timers (i.e. alert progress at 25%/50%/75%)
TODO: Grouping boxes: combine bars into a "group". Can be done with jQuery sortables: adding a group adds an empty colored container, bars can be dragged into it.
TODO: string variables (e.g."only {remaining}lbs to go!" becomes "only 10lbs to go!")
TODO: Editing clock in browsers without HTML5 datepicker automatically opens a datepicking calendar
TODO: Curly notation - when end is changed (i.e. {x/y}) replace in description with a small inline bar

==Unsorted==
TODO: change input object to only include bars
TODO: Restrict invalid data in add bar selector (i.e. no setting clock start time after the end)
TODO: documentation
TODO: Add error handing for edit dialog
TODO: reverse bars
TODO: don't let counter increment beyond boundaries (in data, current it simply doesn't display the real location)
TODO: Curly notation - add inline links to curly notation in descriptions that let you change the value on demand (i.e. a popup just for that value)