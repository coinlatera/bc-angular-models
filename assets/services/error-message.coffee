angular.module('bc.error-message', []).service "ErrorMessage", ->
  class ItemError
    constructor: (error) ->
      @errorType = "Item"
      @errorMessage = error

  class FieldError
    constructor: (fieldName, fieldErrors) ->
      @errorType = "Field"
      @errorField = fieldName
      @errorMessages = fieldErrors

  class ErrorMessage
    constructor: (message) ->
      @request = message?.request or {}
      @errors = ErrorMessage.ParseErrors(message?.errors) or []

    @ParseErrors = (serverError) ->
      if typeof serverError is "string"
        return [ new ItemError(serverError) ]
      if typeof serverError is "object"
        errorList = []
        angular.forEach serverError, (error) ->
          angular.forEach error, (fieldErrorList, fieldName) ->
            this.push new FieldError(fieldName, fieldErrorList)
          , this
        , errorList
        return errorList

  FromMessage: (msg) ->
    new ErrorMessage(msg)
