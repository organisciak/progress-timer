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
)
