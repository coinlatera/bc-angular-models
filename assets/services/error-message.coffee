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
        @errors = ErrorMessage.ParseSocketErrors(message?.errors) or []
      else
        @errors = ErrorMessage.ParseServerErrors(message?.data?.errors) or []

    @ParseSocketErrors = (serverErrors = []) ->
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

    @ParseServerErrors = (allErrors = []) ->
      errorList = []
      angular.forEach allErrors, (error) ->
        if typeof error is "string"
          @push new ItemError error
        else if typeof error is "object"
          @push new FieldError error.param, [error.msg]
      , errorList
      errorList

  FromMessage: (msg) ->
    new ErrorMessage(msg)
