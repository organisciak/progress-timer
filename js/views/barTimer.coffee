# Module: views/barTimer
#
# Extends the Bar view specific to timers

define([
  'jqueryui', 'underscore', 'backbone', 'views/bar'
], ($, _, Backbone, BarView) ->
  class BarCounterView extends BarView
    initialize: =>
      if @model.get('type') isnt 'timer'
        throw "You can't create a BarTimer view for a model that isn't a timer!"
      super
)
