// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'lib/jquery-1.8.2.min',
    jqueryui: 'lib/jquery-ui',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    json2: 'lib/json2',
    d3: 'lib/d3.v2.min',
    modernizer: 'delta/modernizr-2.0.6.min',
    globalize: 'globalize-master/lib/globalize',
    timepicker: 'lib/jquery-ui-timepicker-addon',
    delta: 'delta/custom'
  },
  shim: {
       'jqueryui': {
            exports: '$',
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            exports: 'Backbone',
            deps: ['underscore', 'jquery']
        },
        'timepicker': {
            deps: ['jquery', 'jqueryui']
        },
        'd3': {
            // Tell RequireJS to use the global d3 object as d3's export
            exports: 'd3'
        }
  }
});

require(['progress', 'progressBackbone'], function(Progress, ProgressB) {
    // Start Backbone refactor code
    ProgressB.start();

    // Old code below
    Progress.load();
    Progress.draw();

    var timer;
    timer = window.setInterval(function() {
            Progress.draw();
    }, 1000);

    $('.add-question, .header .add.button').click(Progress.add);
    $('#set').button().click(function() {
            timer = window.setInterval(function() {
                    Progress.draw();
            }, 1000);
    });
    $('#clear').button().click(function() {
            clearInterval(timer);
    });
    $('#debug').button().click(function() {
            $('.debug.dialog').dialog('open');
    });
    $('.header .tips.button').click(function() {
            $('.tips.dialog').dialog('open');
    });
    $('.header .help.button').click(function() {
            $('.introduction.dialog').dialog('open');
    });
    $('#reset').button().click(Progress.reset);
    $('#export').button().click(Progress.exportData);
    $('#import').button().click(Progress.importData);
    $('.header .settings.button').click(Progress.settingsMenu);
});

