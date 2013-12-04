angular.module('bc.capitalize', []).filter 'capitalize', ->
  (input = "") ->
    result = ""
    if typeof input is "string"
      result = input.charAt(0).toUpperCase() + input.slice(1)
    else if input is true
      result = "True"
    else if input is false
      result = "False"
    result

