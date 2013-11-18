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
    constructor: (@userDetails, @accountResources = []) ->
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

      @residencyApproved = _.reduce @accountResources, (memo, resource) ->
        memo or (resource.residency and resource.approved)
      , false
      @residencyPending = not @residencyApproved and _.reduce @accountResources, (memo, resource) -> 
        memo or (resource.residency and resource.pending)
      , false
      @residencyDenied = not @residencyApproved and not @residencyPending and _.reduce @accountResources, (memo, resource) ->
        memo or (resource.residency and resource.denied)
      , false

      # Verified status requires approved resources for both ID and residency
      #  Pending status with one or more pending resources, and implies not verified
      #  Denied status with one or more denied resources, and implies not verified
      #   Denied takes precedence over pending - Alert user to upload new resource
      @verified = @idApproved and @residencyApproved
      @pending = @idPending or @residencyPending
      @denied = @idDenied or @residencyDenied
      @unverified = not @pending and not @verified and not @denied

      @displayVerificationStatus = if @verified then "Verified"
      else if @pending then "Pending"
      else if @denied then "Denied"
      else "Unverified"

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
    new UserAccountInfo(userDetails, accountResources)

  Empty: ->
    this.FromMessage()

