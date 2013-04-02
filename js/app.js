// Generated by CoffeeScript 1.4.0
(function() {

  define(['jqueryui', 'underscore', 'backbone', 'app/collections/eyes', 'app/views/eyes', 'app/views/eye', 'app/models/eye'], function($, _, Backbone, Eyes, EyesView, EyeView, Eye) {
    var App;
    App = new (Backbone.View.extend({
      Models: {},
      Views: {},
      Collections: {},
      events: {},
      start: function() {
        var eye, eyeList, eyeListView;
        eyeList = new Eyes();
        eyeListView = new EyesView({
          collection: eyeList
        });
        eye = new Eye({
          title: "Hello"
        });
        eyeList.add(eye);
        eye = new Eye({
          title: "World",
          size: 80
        });
        eyeList.add(eye);
        eyeListView.render();
        console.log(eyeList.toJSON());
        return $('body').prepend(eyeListView.el);
      }
    }))({
      el: document.body
    });
    return App;
  });

}).call(this);
