# Filename: progressBackbone.coffee

define(['jqueryui', 'underscore', 'backbone',
  'views/bar', 'views/barCounter', 'views/barTimer', 'models/bar', 'models/page'],
  ($, _, Backbone, BarView, BarCounterView, BarTimerView, Bar, Page) ->
    Progress = new (Backbone.View.extend({
      events: {}
      start: ->
        #barList = new Bars()
        #barListView = new BarsView({collection: barList})

        page = new Page()
        bar = new Bar({title:"Hello", type:"counter"})
        barView = new BarCounterView({model:bar, page:page})
        #barList.add(bar)
        barView.render()
        $('#container').prepend(barView.el)

        bar = new Bar({title:"World", current:80, type:"timer"})
        barView = new BarTimerView({model:bar, page: page})
        #barList.add(bar)
        barView.render()
        console.log barView.progressLocation()
        $('#container').prepend(barView.el)

        #barListView.render()
        #console.log barList.toJSON()
        #$('body').prepend(barListView.el)
    }))({el: document.body})
    return Progress
)
