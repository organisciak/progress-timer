# Module: format/formatDate.coffee
#

define(['format/leadingZero'], (lzero) ->
  (date) ->
    y = date.getFullYear()
    m = 1 + date.getMonth()
    d = date.getDate()
    return "#{ y }-#{ lzero(m) }-#{ lzero(d) }"
)
