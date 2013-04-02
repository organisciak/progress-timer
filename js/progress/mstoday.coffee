#Filename: progress/mstoday.coffee
# Return the number of milliseconds since the start of the day.

define(() ->
  (date) ->
    if typeof date == 'number'
      date = new Date(date)
    v = new Date(date)
    v.setHours(0, 0, 0, 0)
    return (date.getTime() - v.getTime())
)
