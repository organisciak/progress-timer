# Module: views/barCounter
#
# Extends the Bar view specific to counters

define([
  'jqueryui', 'underscore', 'backbone', 'text!templates/bar.html', 'views/bar'
], ($, _, Backbone, BarSlipTemplate, BarView) ->
  class BarCounterView extends BarView
    initialize: =>
      if @model.get('type') isnt 'counter'
        throw "You can't create a BarCounter view for a model that isn't a counter!"
      super

    render: =>
      super
      @addCounterButtons()

    addCounterButtons: =>
      if @model.get('curly') is true
        return
      d = 100
      if d < 40
        counterValues = [1, 5, 10]
      if d < 80
        counterValues = [1, 5, 10]
      else if d < 120
        counterValues = [1, 5, 50]
      else if d < 500
        counterValues = [1, 10, 100]
      else
        counterValues = [1, 10, 100]

      counterValues = counterValues
        # Add the 0 value that stands in for the quick edit button(TODO)
        .concat([0])
        # Add negative versions to counter values
        .concat(counterValues.map((v) ->
          return -v
        ))
        # Sort descending (since buttons are places right to left
        .sort((a, b) ->
          return b - a
        )

      for v in counterValues
        if v isnt 0
          newButton = $('<button>')
            .attr('class', 'change-counter')
            .text("#{if v > 0 then '+' else ''}#{v}")
            .css('float', 'right')
            .on('click', () ->
              (
                (val) ->
                  return (d) ->
                    changeCounter(d, val)
                )(v) # Yay closures!
            )
            @$el.append(newButton)
        else
            # TODO: Make quick edit button
            # counters.append("button")
            #.html("Quick<br/>Edit").style("float", "right")
)
