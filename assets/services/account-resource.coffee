angular.module('bc.account-resource', []).service "AccountResource", ->
  class ResourceInfo
    constructor: (@verificationType = '', @fileName = '', @docType = '', @docId = '', @docStatus = '', @userDisplayName = '', @email = '') ->

  IdentityErrorMessages = [
    "Document is not an allowed ID type",
    "Document is not in full color",
    "Document has been modified",
    "Document is not clearly legible",
    "Document is no longer current or valid",
    "Document doesn't match personal details"
  ]

  ResidencyErrorMessages = [
    "Document is not accepted document type",
    "Document has been modified",
    "Document is not clearly legible",
    "Document is no longer current or valid",
    "Document doesn't match residency details"
  ]

  class AccountResource
    constructor: (@_id = '', @accountId = '', @awsKey = '', @createdAt = '', @verifiedAt = '', @failedStep = '', @resourceInfo) ->
      @actionStatus = if @resourceInfo.docStatus == 'pending'
        @resourceInfo.docStatus + '-' + @resourceInfo.verificationType
      else
        @resourceInfo.docStatus

      empty = @resourceInfo.fileName is ''
      @imgResource = not empty and @resourceInfo.fileName.indexOf('.pdf') is -1
      @pdfResource = not empty and @resourceInfo.fileName.indexOf('.pdf') isnt -1

      @identity = @resourceInfo.verificationType is 'identity'
      @residency = @resourceInfo.verificationType is 'residency'

      @pending = @resourceInfo.docStatus is 'pending'
      @approved = @resourceInfo.docStatus is 'approved'
      @denied = @resourceInfo.docStatus is 'denied' or @resourceInfo.docStatus is 'denied-final'
      @deniedFinal = @resourceInfo.docStatus is 'denied-final'

      @verified = @approved or @denied

      @displayStatus = if @resourceInfo.docStatus is 'pending' then 'Pending'
      else if @resourceInfo.docStatus is 'approved' then 'Approved'
      else if @resourceInfo.docStatus is 'denied' then 'Denied'
      else if @resourceInfo.docStatus is 'denied-final' then 'Denied (Final)'
      else 'Unknown'

      @displayErrorMessage = (if @identity then IdentityErrorMessages[@failedStep] else ResidencyErrorMessages[@failedStep]) or ''

  FromMessage: (msg) ->
    msgResource = msg?.resourceInfo
    resourceInfo = new ResourceInfo(msgResource?.verificationType, msgResource?.fileName, msgResource?.docType,
                                    msgResource?.docId, msgResource?.docStatus, msgResource?.userDisplayName, msgResource?.email)
    new AccountResource(msg?._id, msg?.accountId, msg?.awsKey, msg?.createdAt, msg?.verifiedAt, msg?.failedStep, resourceInfo)

