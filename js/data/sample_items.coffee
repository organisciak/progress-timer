# Filename: data/sample_items.coffee
# Examples of progress bars
# TODO: use for bootstrapping once backbone is being used

define([], ->
  [
     title: 'Losing Weight'
     description: 'Tracking my progress to my goal weight.'
     start: 220
     current: 190
     end: 180
  ,
     title: 'Essay Progress'
     description: 'Toward a max word count of 6000'
     start: 0
     current: 5000
     end: 6000
  ,
     title: 'Days until Christmas'
     description: ''
     start: 'Dec 1'
     current: 'Dec 18'
     end: 'Dec 24'
  ,
     title: 'Work Day'
     start: 0
     description: 'The end is coming..'
     current: 6
     end: 8
  ,
     title: 'Pokemon Collection'
     description: "Gotta catch 'em all!"
     start: 0
     current: 150
     end: 100
  ]
)
