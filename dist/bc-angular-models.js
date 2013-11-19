(function() {
  angular.module('bc.angular-models', ['bc.account-resource', 'bc.order-info', 'bc.user-account-info', 'bc.error-message', 'bc.transaction-info']);

}).call(this);

(function() {
  angular.module('bc.account-resource', []).service("AccountResource", function() {
    var AccountResource, ResourceInfo;
    ResourceInfo = (function() {
      function ResourceInfo(verificationType, fileName, docType, docId, docStatus, userDisplayName, email) {
        this.verificationType = verificationType != null ? verificationType : '';
        this.fileName = fileName != null ? fileName : '';
        this.docType = docType != null ? docType : '';
        this.docId = docId != null ? docId : '';
        this.docStatus = docStatus != null ? docStatus : '';
        this.userDisplayName = userDisplayName != null ? userDisplayName : '';
        this.email = email != null ? email : '';
      }

      return ResourceInfo;

    })();
    AccountResource = (function() {
      function AccountResource(_id, accountId, awsKey, createdAt, verifiedAt, failedStep, resourceInfo) {
        var empty;
        this._id = _id != null ? _id : '';
        this.accountId = accountId != null ? accountId : '';
        this.awsKey = awsKey != null ? awsKey : '';
        this.createdAt = createdAt != null ? createdAt : '';
        this.verifiedAt = verifiedAt != null ? verifiedAt : '';
        this.failedStep = failedStep != null ? failedStep : '';
        this.resourceInfo = resourceInfo;
        this.actionStatus = this.resourceInfo.docStatus === 'pending' ? this.resourceInfo.docStatus + '-' + this.resourceInfo.verificationType : this.resourceInfo.docStatus;
        empty = this.resourceInfo.fileName === '';
        this.imgResource = !empty && this.resourceInfo.fileName.indexOf('.pdf') === -1;
        this.pdfResource = !empty && this.resourceInfo.fileName.indexOf('.pdf') !== -1;
        this.identity = this.resourceInfo.verificationType === 'identity';
        this.residency = this.resourceInfo.verificationType === 'residency';
        this.pending = this.resourceInfo.docStatus === 'pending';
        this.approved = this.resourceInfo.docStatus === 'approved';
        this.denied = this.resourceInfo.docStatus === 'denied' || this.resourceInfo.docStatus === 'denied-final';
        this.verified = this.approved || this.denied;
        this.displayStatus = this.resourceInfo.docStatus === 'pending' ? 'Pending' : this.resourceInfo.docStatus === 'approved' ? 'Approved' : this.resourceInfo.docStatus === 'denied' ? 'Denied' : this.resourceInfo.docStatus === 'denied-final' ? 'Denied (Final)' : 'Unknown';
      }

      return AccountResource;

    })();
    return {
      FromMessage: function(msg) {
        var msgResource, resourceInfo;
        msgResource = msg != null ? msg.resourceInfo : void 0;
        resourceInfo = new ResourceInfo(msgResource != null ? msgResource.verificationType : void 0, msgResource != null ? msgResource.fileName : void 0, msgResource != null ? msgResource.docType : void 0, msgResource != null ? msgResource.docId : void 0, msgResource != null ? msgResource.docStatus : void 0, msgResource != null ? msgResource.userDisplayName : void 0, msgResource != null ? msgResource.email : void 0);
        return new AccountResource(msg != null ? msg._id : void 0, msg != null ? msg.accountId : void 0, msg != null ? msg.awsKey : void 0, msg != null ? msg.createdAt : void 0, msg != null ? msg.verifiedAt : void 0, msg != null ? msg.failedStep : void 0, resourceInfo);
      }
    };
  });

}).call(this);

(function() {
  angular.module('bc.error-message', []).service("ErrorMessage", function() {
    var ErrorMessage, FieldError, ItemError;
    ItemError = (function() {
      function ItemError(error) {
        this.errorType = "Item";
        this.errorMessage = error;
        this.toString = function() {
          return this.errorMessage;
        };
      }

      return ItemError;

    })();
    FieldError = (function() {
      function FieldError(fieldName, fieldErrors) {
        this.errorType = "Field";
        this.errorField = fieldName;
        this.errorMessages = fieldErrors;
        this.toString = function() {
          return this.errorMessages.join(', ');
        };
      }

      return FieldError;

    })();
    ErrorMessage = (function() {
      function ErrorMessage(message) {
        this.request = (message != null ? message.request : void 0) || {};
        this.errors = ErrorMessage.ParseErrors(message != null ? message.errors : void 0) || [];
      }

      ErrorMessage.ParseErrors = function(serverError) {
        var errorList;
        if (typeof serverError === "string") {
          return [new ItemError(serverError)];
        }
        if (typeof serverError === "object") {
          errorList = [];
          angular.forEach(serverError, function(error) {
            return angular.forEach(error, function(fieldErrorList, fieldName) {
              return this.push(new FieldError(fieldName, fieldErrorList));
            }, this);
          }, errorList);
          return errorList;
        }
      };

      return ErrorMessage;

    })();
    return {
      FromMessage: function(msg) {
        return new ErrorMessage(msg);
      }
    };
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('bc.order-info', []).service("OrderInfo", function() {
    var OrderInfo, OrderInfoHelper,
      _this = this;
    OrderInfoHelper = {
      Upsert: function(obj, msg) {
        if (obj) {
          obj.set_status(msg.order.status);
          obj.history = _(obj.history || []).concat({
            event: msg.order.status,
            timestamp: new Date().getTime
          });
          return obj;
        } else {
          return OrderInfo.FromMessage(msg);
        }
      }
    };
    OrderInfo = (function() {
      function OrderInfo(id, accountId, offered, received, orderType, status, timestamp, history) {
        this.id = id;
        this.accountId = accountId;
        this.offered = offered;
        this.received = received;
        this.orderType = orderType;
        this.status = status;
        this.timestamp = timestamp;
        this.history = history;
        this.set_status = __bind(this.set_status, this);
        this.original_offered = this.offered;
        this.original_received = this.received;
      }

      OrderInfo.prototype.set_status = function(stat) {
        this.status = stat;
        if ((stat != null ? stat.status : void 0) === 'reopened') {
          this.status = 'reopened';
          this.offered = stat.offered;
          return this.received = stat.received;
        } else {
          this.offered = this.original_offered;
          return this.received = this.original_received;
        }
      };

      OrderInfo.FromMessage = function(msg) {
        var order, status, _ref;
        order = msg.order;
        status = order.status;
        if (((_ref = order.status) != null ? _ref.status : void 0) === 'reopened') {
          status = 'reopened';
        }
        order = new OrderInfo(order.id, order.accountId, order.offered, order.received, order.order_type, status, order.timestamp, msg._history);
        return OrderInfoHelper.Upsert(order, msg);
      };

      return OrderInfo;

    }).call(this);
    return OrderInfoHelper;
  });

}).call(this);

(function() {
  angular.module('bc.transaction-info', []).service("TransactionInfo", function() {
    var TransactionInfo, TransactionInfoHelper,
      _this = this;
    TransactionInfoHelper = {
      Upsert: function(obj, msg) {
        if (obj) {
          obj.status = msg.status;
          obj.history = _(obj.history || []).concat({
            event: msg.status,
            timestamp: new Date().getTime
          });
          return obj;
        } else {
          return TransactionInfo.FromMessage(msg);
        }
      }
    };
    TransactionInfo = (function() {
      function TransactionInfo(id, type, fundingSourceId, orderType, status, history) {
        this.id = id;
        this.type = type;
        this.fundingSourceId = fundingSourceId;
        this.orderType = orderType;
        this.status = status;
        this.history = history;
      }

      TransactionInfo.FromMessage = function(msg) {
        var transaction;
        transaction = new TransactionInfo(msg._id, msg._type, msg.fundingSourceId, msg.amount, msg.status, msg._history);
        return TransactionInfoHelper.Upsert(transaction, msg);
      };

      return TransactionInfo;

    }).call(this);
    return TransactionInfoHelper;
  });

}).call(this);

(function() {
  angular.module('bc.user-account-info', ['bc.account-resource']).service("UserAccountInfo", function(AccountResource) {
    var Address, UserAccountInfo, UserDetails;
    Address = (function() {
      function Address(addressLine1, addressLine2, city, region, zipCode, country) {
        this.addressLine1 = addressLine1 != null ? addressLine1 : '';
        this.addressLine2 = addressLine2 != null ? addressLine2 : '';
        this.city = city != null ? city : '';
        this.region = region != null ? region : '';
        this.zipCode = zipCode != null ? zipCode : '';
        this.country = country != null ? country : '';
      }

      Address.prototype.toString = function() {
        var result;
        result = this.addressLine1;
        if (this.addressLine2 !== '') {
          result = result + " " + this.addressLine2;
        }
        return result + " " + this.city + " " + this.region + " " + this.zipCode;
      };

      Address.FromMessage = function(msg) {
        return new Address(msg != null ? msg.addressLine1 : void 0, msg != null ? msg.addressLine2 : void 0, msg != null ? msg.city : void 0, msg != null ? msg.region : void 0, msg != null ? msg.zipCode : void 0, msg != null ? msg.country : void 0);
      };

      return Address;

    })();
    UserDetails = (function() {
      function UserDetails(firstName, middleName, lastName, dateOfBirth, birthCountry, residencyAddress) {
        this.firstName = firstName != null ? firstName : '';
        this.middleName = middleName != null ? middleName : '';
        this.lastName = lastName != null ? lastName : '';
        this.dateOfBirth = dateOfBirth != null ? dateOfBirth : '';
        this.birthCountry = birthCountry != null ? birthCountry : '';
        this.residencyAddress = residencyAddress;
      }

      UserDetails.prototype.day = function() {
        var birthMoment;
        birthMoment = moment(this.dateOfBirth);
        return (birthMoment != null ? birthMoment.date() : void 0) || '';
      };

      UserDetails.prototype.year = function() {
        var birthMoment;
        birthMoment = moment(this.dateOfBirth);
        return (birthMoment != null ? birthMoment.year() : void 0) || '';
      };

      UserDetails.prototype.month = function() {
        var birthMoment;
        birthMoment = moment(this.dateOfBirth);
        return (birthMoment != null ? birthMoment.format("MMM") : void 0) || '';
      };

      UserDetails.prototype.displayDateOfBirth = function() {
        var birthMoment;
        birthMoment = moment(this.dateOfBirth);
        return (birthMoment != null ? birthMoment.format("MM/DD/YYYY") : void 0) || '';
      };

      UserDetails.FromMessage = function(msg) {
        var address;
        address = Address.FromMessage(msg != null ? msg.residencyAddress : void 0);
        return new UserDetails(msg != null ? msg.firstName : void 0, msg != null ? msg.middleName : void 0, msg != null ? msg.lastName : void 0, msg != null ? msg.dateOfBirth : void 0, msg != null ? msg.birthCountry : void 0, address);
      };

      return UserDetails;

    })();
    UserAccountInfo = (function() {
      function UserAccountInfo(userDetails, accountResources) {
        this.userDetails = userDetails;
        this.accountResources = accountResources != null ? accountResources : [];
        this.idApproved = _.reduce(this.accountResources, function(memo, resource) {
          return memo || (resource.identity && resource.approved);
        }, false);
        this.idPending = !this.idApproved && _.reduce(this.accountResources, function(memo, resource) {
          return memo || (resource.identity && resource.pending);
        }, false);
        this.idDenied = !this.idApproved && !this.idPending && _.reduce(this.accountResources, function(memo, resource) {
          return memo || (resource.identity && resource.denied);
        }, false);
        this.residencyApproved = _.reduce(this.accountResources, function(memo, resource) {
          return memo || (resource.residency && resource.approved);
        }, false);
        this.residencyPending = !this.residencyApproved && _.reduce(this.accountResources, function(memo, resource) {
          return memo || (resource.residency && resource.pending);
        }, false);
        this.residencyDenied = !this.residencyApproved && !this.residencyPending && _.reduce(this.accountResources, function(memo, resource) {
          return memo || (resource.residency && resource.denied);
        }, false);
        this.verified = this.idApproved && this.residencyApproved;
        this.pending = this.idPending || this.residencyPending;
        this.denied = this.idDenied || this.residencyDenied;
        this.unverified = !this.pending && !this.verified && !this.denied;
        this.displayVerificationStatus = this.verified ? "Verified" : this.pending ? "Pending" : this.denied ? "Denied" : "Unverified";
      }

      UserAccountInfo.prototype.displayName = function() {
        return this.userDetails.firstName + " " + this.userDetails.lastName;
      };

      UserAccountInfo.prototype.fullName = function() {
        if (this.userDetails.middleName === '') {
          return this.displayName();
        } else {
          return this.userDetails.firstName + " " + this.userDetails.middleName + " " + this.userDetails.lastName;
        }
      };

      return UserAccountInfo;

    })();
    return {
      FromMessage: function(msg) {
        var accountResources, userDetails;
        userDetails = UserDetails.FromMessage(msg != null ? msg.userDetails : void 0);
        accountResources = _.map((msg != null ? msg.accountResources : void 0) || [], function(resource) {
          return AccountResource.FromMessage(resource);
        });
        return new UserAccountInfo(userDetails, accountResources);
      },
      Empty: function() {
        return this.FromMessage();
      }
    };
  });

}).call(this);
