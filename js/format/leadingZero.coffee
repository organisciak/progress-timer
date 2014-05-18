# Module: format/leadingZero
#
# Add a leading zero in converting an int to a string

define(->
  (integer)->
    "#{if integer <= 9 then '0' else ''}#{integer}"
)
