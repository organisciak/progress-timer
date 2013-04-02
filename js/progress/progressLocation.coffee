# Module: progress/progressLocation
#
define(->
  current = (() ->
    if data.type is 'timer' and data.progress.start?
        return data.current +
            new Date().getTime() - data.progress.start
    else
        return data.current
  )()
  (data, fullWidth) ->
    countUp = data.start < data.end
    if current <= data.start and countUp?
        percentage = 0
    else if (current >= data.end and countUp?)
        percentage = 1
    else if (current <= data.end and not countUp?)
        percentage = 1
    else if (current >= data.start and not countUp?)
        percentage = 0
    else
      if countUp?
        percentage = (current - data.start) / (data.end - data.start)
      else
        percentage = (data.start - current) / (data.start - data.end)
    location = percentage * fullWidth
    return location
)
