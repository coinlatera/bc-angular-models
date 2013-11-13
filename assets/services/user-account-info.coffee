angular.module('bc.user-account-info', ['bc.account-resource']).service "UserAccountInfo", (AccountResource) ->
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

    day: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.date() || ''

    year: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.year() || ''

    month: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.format("MMM") || ''

    displayDateOfBirth: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.format("MM/DD/YYYY") or ''

    @FromMessage: (msg) ->
      address = Address.FromMessage(msg?.residencyAddress)
      new UserDetails(msg?.firstName, msg?.middleName, msg?.lastName, msg?.dateOfBirth, msg?.birthCountry, address)

  class UserAccountInfo
    constructor: (@accountId = '', @userDetails, @accountResources = []) ->

    displayName: ->
      @userDetails.firstName + " " + @userDetails.lastName

    fullName: ->
      if @userDetails.middleName is ''
        @displayName()
      else
        @userDetails.firstName + " " + @userDetails.middleName + " " + @userDetails.lastName

  FromMessage: (msg) ->
    userDetails = UserDetails.FromMessage(msg?.userDetails)
    accountResources = _.map msg?.accountResources or [], (resource) ->
      AccountResource.FromMessage(resource)
    new UserAccountInfo(msg?.accountId, userDetails, accountResources)

