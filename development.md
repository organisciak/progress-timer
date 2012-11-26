''Backup''

{"barWidth":500,"bars":[{"key":"5bb46e","type":"clock","name":"Field Exam Writing","note":"Taking 11 days, final three days are for editing","start":1351864800000,"end":1352818800000,"current":1352253631080},{"key":"cdc512","type":"counter","name":"Field Exam Word count","note":"infovis:1783;crowd:1682","start":"0","end":"7500","current":"3745"},{"key":"f0fea5","type":"counter","name":"Questions Written","note":"stem:0.2;infovis:0.8;crowd:0.9","start":"0","end":"5","current":"1.9"},{"key":"725394","type":"counter","name":"Progress Bar Development","note":"Version 1 Milestones","start":"0","end":"37","current":"20"},{"key":"7c9d6c","type":"counter","name":"","note":"Version 2 Milestones","start":"0","end":"17","current":"1"}]}






==V1==
BUG: Bar jumps to the end when you edit a counter and change the end point (e.g. create counter with 0/4/100, then edit to 0/4/20)
BUG: Timer takes a second to stop when paused.
BUG: Unpausing Timer causes the text for current progress to temporarily jump to the beginning
BUG: Adding dialog centers on #container rather that display (problem with long pages)
BUG: Curly notation allows current to be higher than end, entering number doesn't. Which one is correct? I say current should go higher (and write it), even while the bar sticks to the end. > I think it can go higher, but warn when it does
TODO: Add description parsing and data checking as the user edits
TODO: Preset options for time slider
TODO: Improve styling of "choose a progress bar"
TODO: Update app to use globalize
TODO: Import positioning and sizing of elements in datapicker + time picker
TODO: Check if clock "current" keeps showing progress when it hits the end (and maybe a red "-10:00" message)
TODO: Curly notation - when using curly notation, disable -5/-1/+1/+5 buttons (but add note about why it is not there)
TODO: Curly notation - disable current value selector and add note in the dialog about the curly notation overwriting it
TODO: Curly notation - add formatting for curly notation. Change color of current/end, possibly remove curly braces (only in display)
TODO: More flexible button values for counter
TODO: Formatting of text on bars
TODO: introduction window (same as help window?)
TODO: add tips window
TODO: add help window
TODO: In clock, account for start date before current date
TODO: introductory page that shows up on the first run (help link for future reference)
TODO: settings menu 
TODO: add a subtle background message for when there aren't any progress bars | include link to 'add bar'
TODO: alert for pointing out that bars are going in reverse
TODO: Add page exit action > Save data
TODO: Make sure timer state isn't lost on reload (above todo should fix this)
TODO: What's new dialog. See "version" variable (remember version number in localstorage, ignore what's new flag on first run).
TODO: Fix relation between selecting text and dragging (you should be able to copy text, w/o accidentally dragging)
TODO: Event for when a bar ends
TODO: Stop timer when a timer ends
TODO: Update script to use Modernizer for testing for browser spinner and datepicker
DONE: Style description textarea appropriately
DONE: Hacker pro-tip: descriptions with numbers in the form of {100} will use those numbers to set the current value. Make sure the parser makes sure that the data is correct, and that it still goes through the data sanitation checks
DONE: Better functionality for placing buttons
DONE: Fixed Date width in clock dialog in Chrome
DONE: Make sidebar controls fixed (remain in side with scroll)
DONE: Add data quality check for counter
DONE: Add data quality check for timer
DONE: Add data quality check for clock
DONE: Add error display to add/edit dialog
DONE: default date and time should be current time
DONE: set up dragging or at least reordering (persistent, i.e. saves the data also)
DONE: Autostart Timer upon creating
DONE: Add a reset button to timer
DONE: Show current progress when editing timer, link to timer reset
DONE: deletion of localstorage in settings menu
DONE: restrict relative resizing in CSS
DONE: contact info
DONE: Description should be textarea
FIXED: !!! Adding a clock in Chrome is broken. Title doesn't save, editing loses the date.
FIXED: Curly notation: ParseFloat isn't cutting it. i.e. "{0.7}{0.8}{0.8}{0.9}" = 3.1999999999
FIXED: Curly notation - "{}" breaks bar
FIXED: checking clock data and labels of clock bar are GMT
FIXED: Clear data doesn't show until refresh
FIXED: Refreshing the page automatically turns on timer.
FIXED: Pausing timer and then refreshing the page shows that the timer kept going...
FIXED: Editing a timer fills in a date instead of time (and subsequently creates an 'undefined' error).
FIXED: Clear data doesn't show until refresh
FIXED: Resizing triangles in "add bar" dialog. Shouldn't be there, and is in a strange place too.
FIXED: Clock picking/editing doesn't work in Firefox.
FIXED: Update SVG clock time to use globalize

==V1.1 Public==
TODO: Favicon
TODO: Make into plugin
TODO: Write copy for app store
TODO: App Image
TODO: Splash image
TODO: Screenshots
TODO: Update jQuery UI and Modernizer to only user what's need (rather than full dev version)
TODO: remove logs (or debug status)
TODO: remove Modernizer?
TODO: Create production branch, clean all unnecessary files, code

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