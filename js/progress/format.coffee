# Filename: progress/format.coffee
# 
# Format text based on the bar type

define(['jqueryui', 'format/leadingZero', 'time/msToFullTime'],
  ($, leadingZero, msToFullTime) ->
    (value, type) ->
      if type is 'counter'
        return value
      else if type is 'clock'
        date = new Date(value)
        d = $.datepicker.formatDate('mm-dd', date)
        t = date.toLocaleTimeString()
        return "#{ d } #{ t }"
      else if type is 'timer'
        time = msToFullTime(value, true)
        return "#{ time.hours }:#{leadingZero(time.minutes)}:#{leadingZero(time.seconds)}"
      else
          throw 'No valid bar type'
)
