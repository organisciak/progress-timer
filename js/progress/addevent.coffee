#Filename: progress/addevent.coffee
#AddEvent via http://html5demos.com/js/h5utils.js

define( () ->
  () ->
    if (document.addEventListener)
      return (el, type, fn) ->
        if (el && el.nodeName || el == window)
          el.addEventListener(type, fn, false)
        else if (el && el.length)
          for j in el.length
            addEvent(j, type, fn)
    else
      return (el, type, fn) ->
        if (el && el.nodeName || el == window)
          el.attachEvent('on' + type, () ->
              return fn.call(el, window.event)
          )
        else if (el && el.length)
          for j in el.length
            addEvent(j, type, fn)
)


