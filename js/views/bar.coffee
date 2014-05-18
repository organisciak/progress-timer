#Module: views/bar

define([
  'jqueryui', 'underscore', 'backbone', 'text!templates/bar.html'
], ($, _, Backbone, BarSlipTemplate) ->
  class BarView extends Backbone.View
    tagName: 'div'
    className: 'slip ui-widget-content'
    #template: _.template(BarSlipTemplate)
    events:
      'click .delete-button' : "confirmDelete"
      'click .edit-button' : "editDialog"

    initialize: ->
      _.bindAll @

      # Event Bindings
      #@model.on('change', @render, @)
      #@model.on('change:pupilLeft change:pupilTop', @movePupil, @)
      #@model.on('change:eyeLeft change:eyeTop', @renderPosition, @)
      #@model.on('change:size', @renderSize, @)
      @model.on('destroy', @remove, @)
      #@model.on('hide', @remove, @)

      # UI Interaction, apply only once, on initialize
      
    render: =>
      @$el
        .html(@template({model:@model}))

      # Setup Buttons
      @$el.find('.delete-button').text('').button({
          text: false,
          icons: {
              primary: 'ui-icon-closethick'
          }
      })
        
      @$el.find('.edit-button').text('').button({
          text: false,
          icons: {
              primary: 'ui-icon-pencil'
          }
      })

      #@el.children(button)

    confirmDelete: =>
      @model.destroy()
      #@save()

    remove: =>
      @$el.remove()

    editDialog: =>
      console.log "TODO: Edit dialog"

    progressLocation: =>
      @model.percentProgress() * @page.get("barWidth")
)
