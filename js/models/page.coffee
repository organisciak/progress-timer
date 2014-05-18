# Module: models/page
#

define(['jqueryui', 'backbone'], () ->
  class Page extends Backbone.Model
    defaults:
      pageMargin: 50
      slipMargin: 10

    initialize: ->
      @setSizes()

    setSizes: =>
      pageWidth = if document.width <= 1200 then document.width else 1200
      containerWidth = pageWidth - @get("pageMargin") * 2
      slipWidth = containerWidth - @get("slipMargin") * 2
      barWidth = slipWidth - @get("slipMargin") * 2

      @set({
        pageWidth: pageWidth
        containerWidth: containerWidth
        slipWidth: slipWidth
        barWidth: barWidth
      })

)
