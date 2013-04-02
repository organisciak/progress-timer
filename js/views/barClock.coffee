# Module: views/barClock
#
# Extends the Bar view specific to clocks

define([
  'jqueryui', 'underscore', 'backbone', 'views/bar'
], ($, _, Backbone, BarView) ->
  class BarCounterView extends BarView
    initialize: =>
      if @model.get('type') isnt 'clock'
        throw "You can't create a BarClock view for a model that isn't a clock!"
      super
)
