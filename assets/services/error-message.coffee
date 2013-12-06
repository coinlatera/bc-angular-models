angular.module('bc.error-message', []).service "ErrorMessage", ->
  class ItemError
    constructor: (error) ->
      @errorType = "Item"
      @errorMessage = error

      @toString = -> @errorMessage

  class FieldError
    constructor: (fieldName = '', fieldErrors = []) ->
      @errorType = "Field"
      @errorMessages = fieldErrors
      @errorFieldId = fieldName.split('/').pop() or ''

      @toString = -> @errorMessages.join(', ')

  class ErrorMessage
    constructor: (message) ->
      @request = message?.request or {}
      if message?.result is "REQUEST_ERROR"
        @errors = ErrorMessage.ParseErrors(message?.errors) or []
      else
        @errors = ErrorMessage.ParseErrors(message?.data?.errors) or []

    @ParseErrors = (serverErrors = []) ->
      errorList = []
      angular.forEach serverErrors, (error) ->
        if typeof error is "string"
          @push new ItemError(error)
        else if typeof error is "object"
          angular.forEach error, (fieldErrorList, fieldName) ->
            @push new FieldError(fieldName, fieldErrorList)
          , @
      , errorList
      errorList

  FromMessage: (msg) ->
    new ErrorMessage(msg)
