#Filename: progress/sumarr.coffee
# Sum all the values in an array

define(() ->
  (arr) ->
    sum = 0
    for item in arr
      sum += item
    return sum
)
