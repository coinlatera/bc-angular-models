angular.module('bc.account-resource', []).service "AccountResource", () ->
  class ResourceInfo
    constructor: (@verificationType, @fileName, @docType, @docId, @docStatus, @userDisplayName, @email) ->

  class AccountResource
    constructor: (@_id, @accountId, @awsKey, @createdAt, @verifiedAt, @failedStep, @resourceInfo) ->
      @actionStatus = if @resourceInfo.docStatus == 'pending'
        @resourceInfo.docStatus + '-' + @resourceInfo.verificationType
      else
        @resourceInfo.docStatus

      @imgResource = @resourceInfo.fileName.indexOf('.pdf') is -1
      @pdfResource = @resourceInfo.fileName.indexOf('.pdf') isnt -1

      @identity = @resourceInfo.verificationType == 'identity'
      @residency = @resourceInfo.verificationType == 'residency'

      @pending = @resourceInfo.docStatus is 'pending'
      @approved = @resourceInfo.docStatus is 'approved'
      @denied = @resourceInfo.docStatus is 'denied' or @resourceInfo.docStatus is 'denied-final'

      @verified = @approved or @denied

      @displayStatus = if @resourceInfo.docStatus is 'pending' then 'Pending'
      else if @resourceInfo.docStatus is 'approved' then 'Approved'
      else if @resourceInfo.docStatus is 'denied' then 'Denied'
      else if @resourceInfo.docStatus is 'denied-final' then 'Denied (Final)'
      else 'Unknown'

  FromMessage: (msg) ->
    resourceInfo = new ResourceInfo(msg.resourceInfo.verificationType, msg.resourceInfo.fileName, msg.resourceInfo.docType,
                                    msg.resourceInfo.docId, msg.resourceInfo.docStatus, msg.resourceInfo.userDisplayName, msg.resourceInfo.email)
    new AccountResource(msg._id, msg.accountId, msg.awsKey, msg.createdAt, msg.verifiedAt, msg.failedStep, resourceInfo)

