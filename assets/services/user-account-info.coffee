angular.module('bc.user-account-info', ['bc.account-resource']).service "UserAccountInfo", ['AccountResource', 'UserAccountSettings', (AccountResource, UserAccountSettings) ->
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
    constructor: (@prefix = '', @firstName = '', @middleName = '', @lastName = '', @dateOfBirth = '', @birthCountry = '', @occupation = '', @idType = '', @idNumber = '', @residencyAddress) ->
      @isEmpty = @firstName is '' or @lastName is '' or @dateOfBirth is '' or @birthCountry is ''
      @displayIdType = if @idType is "SIN" then 'Social Insurance Number' else 'Driver\' License Number'

    day: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.utc()?.date() || ''

    year: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.utc()?.year() || ''

    month: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.utc()?.format("MMM") || ''

    dayPad: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.utc()?.format("DD") || ''

    monthPad: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.utc()?.format("MMM - MM") || ''

    displayDateOfBirth: ->
      birthMoment = moment(@dateOfBirth)
      birthMoment?.utc()?.format("MM/DD/YYYY") or ''

    @FromMessage: (msg) ->
      address = Address.FromMessage(msg?.residencyAddress)
      new UserDetails(msg?.prefix, msg?.firstName, msg?.middleName, msg?.lastName, msg?.dateOfBirth, msg?.birthCountry, msg?.occupation, msg?.idType, msg?.idNumber, address)

  class UserAccountInfo
    constructor: (@userDetails, @accountSettings = {}, @accountResources = {}) ->
      @ensureVerificationStatus()

    ensureVerificationStatus : ->
      # Approved status is highest priority - User needs only one approved resource to be considered approved
      #  Otherwise, if no approved resources, any pending resource moves their status into pending
      #  Finally, if no approved or pending resources, any previously denied resource makes them temporarily denied
      @idApproved = _.reduce @accountResources, (memo, resource) ->
        memo or (resource.identity and resource.approved)
      , false
      @idPending = not @idApproved and _.reduce @accountResources, (memo, resource) ->
        memo or (resource.identity and resource.pending)
      , false
      @idDenied = not @idApproved and not @idPending and _.reduce @accountResources, (memo, resource) ->
        memo or (resource.identity and resource.denied)
      , false
      @idUnverified = not @idApproved and not @idPending and not @idDenied

      @residencyApproved = _.reduce @accountResources, (memo, resource) ->
        memo or (resource.residency and resource.approved)
      , false
      @residencyPending = not @residencyApproved and _.reduce @accountResources, (memo, resource) -> 
        memo or (resource.residency and resource.pending)
      , false
      @residencyDenied = not @residencyApproved and not @residencyPending and _.reduce @accountResources, (memo, resource) ->
        memo or (resource.residency and resource.denied)
      , false
      @residencyUnverified = not @residencyApproved and not @residencyPending and not @residencyDenied

      # Verified status requires approved resources for both ID and residency
      @verified = @idApproved and @residencyApproved

      # Unverified status when not resource is found for one or both types
      @unverified = @idUnverified or @residencyUnverified

      #  Pending status with one or more pending resources and no denied resources
      #  Denied status with one or more denied resources, and implies not verified
      #   Denied takes precedence over pending - Alert user to upload new resource
      @denied = not @unverified and (@idDenied or @residencyDenied)
      @pending = not @verified and not @unverified and not @denied

      @displayVerificationStatus = if @verified then "Verified"
      else if @pending then "Pending"
      else if @denied then "Denied"
      else "Unverified"

      @transactionUserStatus = if @confirmed then "accountConfirmed"
      else if @verified then "detailsApproved"
      else if @userDetails.isEmpty then "unverified"
      else "detailsPending"


    addAccountResource: (resource) ->
      @accountResources[resource._id] = resource
      @ensureVerificationStatus()

    deleteAccountResource: (resourceId) ->
      delete @accountResources[resourceId]
      @ensureVerificationStatus()

    displayName: ->
      @userDetails.firstName + " " + @userDetails.lastName

    fullName: ->
      if @userDetails.middleName is ''
        @userDetails.prefix + " " + @displayName()
      else
        @userDetails.prefix + " " + @userDetails.firstName + " " + @userDetails.middleName + " " + @userDetails.lastName

  FromMessage: (msg) ->
    userDetails = UserDetails.FromMessage(msg?.userDetails)
    accountSettings = UserAccountSettings.FromMessage(msg?.accountSettings)
    accountResources = {}
    angular.forEach msg?.accountResources or [], (resource) ->
      @[resource._id] = AccountResource.FromMessage(resource)
    , accountResources
    new UserAccountInfo(userDetails, accountSettings, accountResources)

  Empty: ->
    this.FromMessage()
  ]
