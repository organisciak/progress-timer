# Module: format/formatHour
#
define(['format/leadingZero'], (lzero)->
  (date) ->
    return "#{ date.getHours() }: #{ lzero date.getMinutes() }"
    
)
