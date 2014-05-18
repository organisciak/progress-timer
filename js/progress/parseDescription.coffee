# Filename: progress/parseDescription.coffee
# 
# Check description for numbers in the format {0}. All numbers between
# curly braces are added and the value is returned.

define(['progress/sumArr'], (sumArr) ->

  (text) ->
    # Find integers between curly braces (including negative numbers and
    # decimals)
    re = /\{(-?[\d\.]+?)\}/g
    values = text.match(re)
    newCount = null

    if (values isnt null)
      # Count the max precision after the decimal place, then use
      # toFixed() to overcome floating point numbers problems
      max_precision = 0
      values = values.map((d) ->
        v = d.replace('{', '').replace('}', '')
        decimals = v.split('.')
        precision = if decimals.length > 1 then decimals[1].length else 0
        if precision > max_precision
          max_precision = precision
        return parseFloat(v)
        )
      return parseFloat(sumArr(values).toFixed(max_precision))
    else
      return null
)
        
