# Filename: progress/setNewTip.coffee
#

define(['data/input', 'data/tips'], (input, tips) ->
  () ->
    nextTip = if input.settings.lastTip + 1 < tips.length then input.settings.lastTip + 1 else 0
    tip = tips[nextTip]
    fields = ['preamble', 'tip', 'image', 'example']

    for field in fields
        if (tip[field] and tip[field] isnt '')
          val = tip[field]
          if field is 'image'
            val = "<img src='" + val + "' />"
          $(this).children('.' + field)
            .html(val).show()
        else
          $(this).children('.' + field).hide()
    input.settings.lastTip = nextTip
  

)
