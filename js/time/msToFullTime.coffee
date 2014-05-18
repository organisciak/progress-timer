# Module: time/msToFullTime
#
define(->
    (milliseconds, fullHours) ->
      hours = Math.floor(milliseconds / (1000 * 60 * 60))
      minutes = Math.floor(milliseconds / (1000 * 60)) % 60
      seconds = Math.floor(milliseconds / (1000)) % 60
      if fullHours isnt true
          hours = hours % 24
      return {
          hours: hours,
          minutes: minutes,
          seconds: seconds
      }
)
