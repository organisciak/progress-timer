# Module: models/bar

define([
  'jqueryui', 'underscore', 'backbone'
], ($, _, Backbone) ->
  class Bar extends Backbone.Model
    defaults:
      title: ''
      description: ''
      start: 0
      current: 0
      end: 100
      type: 'counter'

    percentProgress: () ->
      current = (() ->
        if @type is 'timer' and @progress.start?
            return @current +
                new Date().getTime() - @progress.start
        else
            return @current
      )()
      countUp = @start < @end
      if current <= @start and countUp?
          percentage = 0
      else if (current >= @end and countUp?)
          percentage = 1
      else if (current <= @end and not countUp?)
          percentage = 1
      else if (current >= @start and not countUp?)
          percentage = 0
      else
        if countUp?
          percentage = (current - @start) / (@end - @start)
        else
          percentage = (@start - current) / (@start - @end)
      return percentage
)
