angular.module('bc.user-account-info', []).service "UserAccountInfo", () ->
  class Address
    constructor: (@addressLine1 = '', @addressLine2 = '', @city = '', @region = '', @zipCode = '', @country = '') ->

    toString: ->
      result = @addressLine1
      if @addressLine2 isnt ''
        result = result + " " + @addressLine2
      result + " " + @city + " " + @region + " " + @zipCode

    @FromMessage: (msg) ->
      new Address(msg?.addressLine1, msg?.addressLine2, msg?.city, msg?.region, msg?.zipCode, msg?.country)

  class UserDetails
    constructor: (@firstName = '', @middleName = '', @lastName = '', @dateOfBirth = '', @birthCountry = '', @residencyAddress) ->
      @displayDateOfBirth = moment(@dateOfBirth).format("MM/DD/YYYY")

    @FromMessage: (msg) ->
      address = Address.FromMessage(msg?.residencyAddress)
      new UserDetails(msg?.firstName, msg?.middleName, msg?.lastName, msg?.dateOfBirth, msg?.birthCountry, address)

  class UserAccountInfo
    constructor: (@accountId = '', @userDetails) ->
      @displayName = @userDetails.firstName + " " + @userDetails.lastName

      if @userDetails.middleName is ''
        @fullName = @userDetails.firstName + " " + @userDetails.lastName
      else
        @fullName = @userDetails.firstName + " " + @userDetails.middleName + " " + @userDetails.lastName

  FromMessage: (msg) ->
    userDetails = UserDetails.FromMessage(msg?.userDetails)
    new UserAccountInfo(msg?.accountId, userDetails)

