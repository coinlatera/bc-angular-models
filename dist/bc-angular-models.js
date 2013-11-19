(function() {
  angular.module('bc.angular-models', ['bc.account-resource', 'bc.order-info', 'bc.user-account-info', 'bc.transaction-info']);

}).call(this);

(function() {
  angular.module('bc.account-resource', []).service("AccountResource", function() {
    var AccountResource, ResourceInfo;
    ResourceInfo = (function() {
      function ResourceInfo(verificationType, fileName, docType, docId, docStatus, userDisplayName, email) {
        this.verificationType = verificationType;
        this.fileName = fileName;
        this.docType = docType;
        this.docId = docId;
        this.docStatus = docStatus;
        this.userDisplayName = userDisplayName;
        this.email = email;
      }

      return ResourceInfo;

    })();
    AccountResource = (function() {
      function AccountResource(_id, accountId, awsKey, createdAt, verifiedAt, failedStep, resourceInfo) {
        this._id = _id;
        this.accountId = accountId;
        this.awsKey = awsKey;
        this.createdAt = createdAt;
        this.verifiedAt = verifiedAt;
        this.failedStep = failedStep;
        this.resourceInfo = resourceInfo;
        this.actionStatus = this.resourceInfo.docStatus === 'pending' ? this.resourceInfo.docStatus + '-' + this.resourceInfo.verificationType : this.resourceInfo.docStatus;
        this.imgResource = this.resourceInfo.fileName.indexOf('.pdf') === -1;
        this.pdfResource = this.resourceInfo.fileName.indexOf('.pdf') !== -1;
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
        var resourceInfo;
        resourceInfo = new ResourceInfo(msg.resourceInfo.verificationType, msg.resourceInfo.fileName, msg.resourceInfo.docType, msg.resourceInfo.docId, msg.resourceInfo.docStatus, msg.resourceInfo.userDisplayName, msg.resourceInfo.email);
        return new AccountResource(msg._id, msg.accountId, msg.awsKey, msg.createdAt, msg.verifiedAt, msg.failedStep, resourceInfo);
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
  angular.module('bc.user-account-info', []).service("UserAccountInfo", function() {
    var Address, UserAccountInfo, UserDetails;
    Address = (function() {
      function Address(addressLine1, addressLine2, city, region, zipCode, country) {
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.region = region;
        this.zipCode = zipCode;
        this.country = country;
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
        return new Address(msg.addressLine1, msg.addressLine2, msg.city, msg.region, msg.zipCode, msg.country);
      };

      return Address;

    })();
    UserDetails = (function() {
      function UserDetails(firstName, middleName, lastName, dateOfBirth, birthCountry, residencyAddress) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.birthCountry = birthCountry;
        this.residencyAddress = residencyAddress;
        this.displayDateOfBirth = moment(this.dateOfBirth).format("MM/DD/YYYY");
      }

      UserDetails.FromMessage = function(msg) {
        var address;
        address = Address.FromMessage(msg.residencyAddress);
        return new UserDetails(msg.firstName, msg.middleName, msg.lastName, msg.dateOfBirth, msg.birthCountry, address);
      };

      return UserDetails;

    })();
    UserAccountInfo = (function() {
      function UserAccountInfo(accountId, userDetails, accountResources) {
        this.accountId = accountId;
        this.userDetails = userDetails;
        this.accountResources = accountResources != null ? accountResources : [];
        this.displayName = this.userDetails.firstName + " " + this.userDetails.lastName;
        if (this.userDetails.middleName === '') {
          this.fullName = this.userDetails.firstName + " " + this.userDetails.lastName;
        } else {
          this.fullName = this.userDetails.firstName + " " + this.userDetails.middleName + " " + this.userDetails.lastName;
        }
      }

      return UserAccountInfo;

    })();
    return {
      FromMessage: function(msg) {
        var userDetails;
        userDetails = UserDetails.FromMessage(msg.userDetails);
        return new UserAccountInfo(msg.accountId, userDetails);
      }
    };
  });

}).call(this);
