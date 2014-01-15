(function() {
  angular.module('bc.angular-models', ['bc.access-level', 'bc.account-resource', 'bc.admin-account-info', 'bc.admin-role', 'bc.error-message', 'bc.logger', 'bc.order-info', 'bc.trade-fee', 'bc.transaction-info', 'bc.user-account-info', 'bc.user-account-settings']);

}).call(this);

(function() {
  angular.module('bc.access-level', ['bc.admin-role']).service("AccessLevel", [
    'AdminRole', function(AdminRole) {
      var AccessLevel, accessLevel;
      AccessLevel = (function() {
        function AccessLevel(value) {
          this.value = value != null ? value : accessLevel.AccessLevel.InvalidAccessLevel;
          this.displayAccessLevel = this.value === accessLevel.AccessLevels.InvalidAccessLevel ? 'Invalid Access Level' : this.value === accessLevel.AccessLevels.RestrictedOnly ? 'Restricted Only' : this.value === accessLevel.AccessLevels.StandardOnly ? 'Standard Only' : this.value === accessLevel.AccessLevels.AdminOnly ? 'Admin Only' : this.value === accessLevel.AccessLevels.SuperOnly ? 'Super Only' : this.value === accessLevel.AccessLevels.SuperOrAbove ? 'Super or Above' : this.value === accessLevel.AccessLevels.AdminOrAbove ? 'Admin or Above' : this.value === accessLevel.AccessLevels.StandardOrAbove ? 'Standard or Above' : this.value === accessLevel.AccessLevels.Unrestricted ? 'Unrestricted' : 'Unknown Access Level';
          this.allowedRole = function(role) {
            return this.value & role.value;
          };
          this.displayAllowedRoles = function() {
            var roles,
              _this = this;
            roles = [];
            angular.forEach(AdminRole.Roles, function(role) {
              if (_this.allowedRole(role)) {
                return roles.push(role.displayRole);
              }
            });
            if (roles.length === 0) {
              return "None";
            } else {
              return roles.join(', ');
            }
          };
        }

        return AccessLevel;

      })();
      accessLevel = {
        AccessLevels: {
          InvalidAccessLevel: AdminRole.RoleValues.InvalidUserRoleValue,
          RestrictedOnly: AdminRole.RoleValues.RestrictedUserRoleValue,
          StandardOnly: AdminRole.RoleValues.StandardUserRoleValue,
          AdminOnly: AdminRole.RoleValues.AdminUserRoleValue,
          SuperOnly: AdminRole.RoleValues.SuperUserRoleValue
        },
        FromAccessLevelValue: function(accessLevelValue) {
          return new AccessLevel(accessLevelValue);
        }
      };
      accessLevel.AccessLevels.SuperOrAbove = accessLevel.AccessLevels.SuperOnly;
      accessLevel.AccessLevels.AdminOrAbove = accessLevel.AccessLevels.SuperOrAbove | accessLevel.AccessLevels.AdminOnly;
      accessLevel.AccessLevels.StandardOrAbove = accessLevel.AccessLevels.AdminOrAbove | accessLevel.AccessLevels.StandardOnly;
      accessLevel.AccessLevels.Unrestricted = accessLevel.AccessLevels.StandardOrAbove | accessLevel.AccessLevels.RestrictedOnly;
      return accessLevel;
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.account-resource', []).service("AccountResource", function() {
    var AccountResource, IdentityErrorMessages, ResidencyErrorMessages, ResourceInfo;
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
    IdentityErrorMessages = ["Document is not an allowed ID type", "Document is not in full color", "Document has been modified", "Document is not clearly legible", "Document is no longer current or valid", "Document doesn't match personal details"];
    ResidencyErrorMessages = ["Document is not accepted document type", "Document has been modified", "Document is not clearly legible", "Document is no longer current or valid", "Document doesn't match residency details"];
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
        this.deniedFinal = this.resourceInfo.docStatus === 'denied-final';
        this.verified = this.approved || this.denied;
        this.displayStatus = this.resourceInfo.docStatus === 'pending' ? 'Pending' : this.resourceInfo.docStatus === 'approved' ? 'Approved' : this.resourceInfo.docStatus === 'denied' ? 'Denied' : this.resourceInfo.docStatus === 'denied-final' ? 'Denied (Final)' : 'Unknown';
        this.displayErrorMessage = (this.identity ? IdentityErrorMessages[this.failedStep] : ResidencyErrorMessages[this.failedStep]) || '';
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
  angular.module('bc.admin-account-info', ['bc.admin-role']).service("AdminAccountInfo", [
    'AdminRole', function(AdminRole) {
      var AdminAccountInfo, AdminName;
      AdminName = (function() {
        function AdminName(givenName, familyName) {
          this.givenName = givenName != null ? givenName : '';
          this.familyName = familyName != null ? familyName : '';
        }

        return AdminName;

      })();
      AdminAccountInfo = (function() {
        function AdminAccountInfo(_id, displayName, email, role, name) {
          this._id = _id != null ? _id : '';
          this.displayName = displayName != null ? displayName : '';
          this.email = email != null ? email : '';
          this.role = role;
          this.name = name;
          this.displayRole = this.role.displayRole;
        }

        return AdminAccountInfo;

      })();
      return {
        FromMessage: function(msg) {
          var adminName, adminRole, _ref, _ref1;
          adminRole = AdminRole.FromRoleValue(msg != null ? msg.role : void 0);
          adminName = new AdminName(msg != null ? (_ref = msg.name) != null ? _ref.givenName : void 0 : void 0, msg != null ? (_ref1 = msg.name) != null ? _ref1.familyName : void 0 : void 0);
          return new AdminAccountInfo(msg != null ? msg._id : void 0, msg != null ? msg.displayName : void 0, msg != null ? msg.email : void 0, adminRole, adminName);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.admin-role', []).service("AdminRole", function() {
    var AdminRole, adminRole;
    AdminRole = (function() {
      function AdminRole(value) {
        this.value = value != null ? value : adminRole.RoleValues.InvalidUserRoleValue;
        this.value = Number(this.value);
        if (this.value >= (adminRole.MaxRoleValue << 1)) {
          this.value = 0;
        }
        this.displayRole = adminRole.RoleValueToDisplayRoleMap[this.value] || 'Unknown Role';
      }

      return AdminRole;

    })();
    adminRole = {
      RoleValues: {
        InvalidUserRoleValue: 0,
        RestrictedUserRoleValue: 1 << 0,
        StandardUserRoleValue: 1 << 1,
        AdminUserRoleValue: 1 << 2,
        SuperUserRoleValue: 1 << 3
      },
      FromRoleValue: function(roleValue) {
        return new AdminRole(roleValue);
      },
      FromDisplayRole: function(displayRole) {
        return adminRole.DisplayRoleToRoleValueMap[displayRole] || adminRole.RoleValues.InvalidUserRoleValue;
      }
    };
    adminRole.MaxRoleValue = adminRole.RoleValues.SuperUserRoleValue;
    adminRole.RoleValueToDisplayRoleMap = {};
    adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.InvalidUserRoleValue] = 'Invalid Role';
    adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.RestrictedUserRoleValue] = 'Restricted User';
    adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.StandardUserRoleValue] = 'Standard User';
    adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.AdminUserRoleValue] = 'Admin User';
    adminRole.RoleValueToDisplayRoleMap[adminRole.RoleValues.SuperUserRoleValue] = 'Super User';
    adminRole.DisplayRoleToRoleValueMap = {};
    angular.forEach(adminRole.RoleValueToDisplayRoleMap, function(displayRole, roleValue) {
      return this[displayRole] = Number(roleValue);
    }, adminRole.DisplayRoleToRoleValueMap);
    adminRole.Roles = {
      InvalidUserRole: adminRole.FromRoleValue(adminRole.RoleValues.InvalidUserRoleValue),
      RestrictedUserRole: adminRole.FromRoleValue(adminRole.RoleValues.RestrictedUserRoleValue),
      StandardUserRole: adminRole.FromRoleValue(adminRole.RoleValues.StandardUserRoleValue),
      AdminUserRole: adminRole.FromRoleValue(adminRole.RoleValues.AdminUserRoleValue),
      SuperUserRole: adminRole.FromRoleValue(adminRole.RoleValues.SuperUserRoleValue)
    };
    return adminRole;
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
        if (fieldName == null) {
          fieldName = '';
        }
        if (fieldErrors == null) {
          fieldErrors = [];
        }
        this.errorType = "Field";
        this.errorMessages = fieldErrors;
        this.errorFieldId = fieldName.split('/').pop() || '';
        this.toString = function() {
          return this.errorMessages.join(', ');
        };
      }

      return FieldError;

    })();
    ErrorMessage = (function() {
      function ErrorMessage(message) {
        var _ref;
        this.request = (message != null ? message.request : void 0) || {};
        if ((message != null ? message.result : void 0) === "REQUEST_ERROR") {
          this.errors = ErrorMessage.ParseSocketErrors(message != null ? message.errors : void 0) || [];
        } else {
          this.errors = ErrorMessage.ParseServerErrors((message != null ? (_ref = message.data) != null ? _ref.errors : void 0 : void 0) || (message != null ? message.errors : void 0)) || [];
        }
      }

      ErrorMessage.ParseSocketErrors = function(serverErrors) {
        var errorList;
        if (serverErrors == null) {
          serverErrors = [];
        }
        errorList = [];
        angular.forEach(serverErrors, function(error) {
          if (typeof error === "string") {
            return this.push(new ItemError(error));
          } else if (typeof error === "object") {
            return angular.forEach(error, function(fieldErrorList, fieldName) {
              return this.push(new FieldError(fieldName, fieldErrorList));
            }, this);
          }
        }, errorList);
        return errorList;
      };

      ErrorMessage.ParseServerErrors = function(allErrors) {
        var errorList;
        if (allErrors == null) {
          allErrors = [];
        }
        errorList = [];
        angular.forEach(allErrors, function(error) {
          if (typeof error === "string") {
            return this.push(new ItemError(error));
          } else if (typeof error === "object") {
            return this.push(new FieldError(error.param, [error.msg]));
          }
        }, errorList);
        return errorList;
      };

      return ErrorMessage;

    })();
    return {
      FromMessage: function(msg) {
        return new ErrorMessage(msg);
      },
      ItemErrorFromMessage: function(msg) {
        return new ItemError(msg);
      },
      FieldErrorFromMessage: function(name, errors) {
        return new FieldError(name, errors);
      }
    };
  });

}).call(this);

(function() {
  var __slice = [].slice;

  angular.module('bc.logger', []).service('logger', [
    'CONFIG', function(CONFIG) {
      return this.log = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (CONFIG.debug) {
          return console.log(args);
        }
      };
    }
  ]);

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
      function OrderInfo(id, offered, received, orderType, status, timestamp, history) {
        this.id = id;
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
        order = new OrderInfo(order.id, order.offered, order.received, order.order_type, status, order.timestamp, msg._history);
        return OrderInfoHelper.Upsert(order, msg);
      };

      return OrderInfo;

    }).call(this);
    return OrderInfoHelper;
  });

}).call(this);

(function() {
  angular.module('bc.trade-fee', []).service("TradeFee", function() {
    var TradeFee, TradeFeeHelper,
      _this = this;
    TradeFeeHelper = {
      Upsert: function(obj, msg) {
        return TradeFee.FromMessage(msg);
      }
    };
    TradeFee = (function() {
      function TradeFee(id, createdAt, feeAmount, feeRate, fundedAmount, orderId, tradeType) {
        this.id = id;
        this.createdAt = createdAt;
        this.feeAmount = feeAmount;
        this.feeRate = feeRate;
        this.fundedAmount = fundedAmount;
        this.orderId = orderId;
        this.tradeType = tradeType;
      }

      TradeFee.FromMessage = function(msg) {
        return new TradeFee(msg._id, msg.createdAt, msg.feeAmount, msg.feeRate, msg.fundedAmount, msg.orderId, msg.tradeType);
      };

      return TradeFee;

    }).call(this);
    return TradeFeeHelper;
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
          obj.updateStatus();
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
        this.updateStatus();
      }

      TransactionInfo.prototype.updateStatus = function() {
        var _ref, _ref1;
        this.isFunded = this.status === "Funded";
        this.isDeposit = this.type === "Deposit";
        this.isWithdrawal = this.type === "Withdrawal";
        this.isFiat = ((_ref = this.orderType) != null ? _ref.currency : void 0) !== "BTC";
        return this.isBitcoin = ((_ref1 = this.orderType) != null ? _ref1.currency : void 0) === "BTC";
      };

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
  angular.module('bc.user-account-info', ['bc.account-resource']).service("UserAccountInfo", [
    'AccountResource', 'UserAccountSettings', function(AccountResource, UserAccountSettings) {
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
          var birthMoment, _ref;
          birthMoment = moment(this.dateOfBirth);
          return (birthMoment != null ? (_ref = birthMoment.utc()) != null ? _ref.date() : void 0 : void 0) || '';
        };

        UserDetails.prototype.year = function() {
          var birthMoment, _ref;
          birthMoment = moment(this.dateOfBirth);
          return (birthMoment != null ? (_ref = birthMoment.utc()) != null ? _ref.year() : void 0 : void 0) || '';
        };

        UserDetails.prototype.month = function() {
          var birthMoment, _ref;
          birthMoment = moment(this.dateOfBirth);
          return (birthMoment != null ? (_ref = birthMoment.utc()) != null ? _ref.format("MMM") : void 0 : void 0) || '';
        };

        UserDetails.prototype.dayPad = function() {
          var birthMoment, _ref;
          birthMoment = moment(this.dateOfBirth);
          return (birthMoment != null ? (_ref = birthMoment.utc()) != null ? _ref.format("DD") : void 0 : void 0) || '';
        };

        UserDetails.prototype.monthPad = function() {
          var birthMoment, _ref;
          birthMoment = moment(this.dateOfBirth);
          return (birthMoment != null ? (_ref = birthMoment.utc()) != null ? _ref.format("MMM - MM") : void 0 : void 0) || '';
        };

        UserDetails.prototype.displayDateOfBirth = function() {
          var birthMoment, _ref;
          birthMoment = moment(this.dateOfBirth);
          return (birthMoment != null ? (_ref = birthMoment.utc()) != null ? _ref.format("MM/DD/YYYY") : void 0 : void 0) || '';
        };

        UserDetails.FromMessage = function(msg) {
          var address;
          address = Address.FromMessage(msg != null ? msg.residencyAddress : void 0);
          return new UserDetails(msg != null ? msg.firstName : void 0, msg != null ? msg.middleName : void 0, msg != null ? msg.lastName : void 0, msg != null ? msg.dateOfBirth : void 0, msg != null ? msg.birthCountry : void 0, address);
        };

        return UserDetails;

      })();
      UserAccountInfo = (function() {
        function UserAccountInfo(userDetails, accountSettings, accountResources) {
          this.userDetails = userDetails;
          this.accountSettings = accountSettings != null ? accountSettings : {};
          this.accountResources = accountResources != null ? accountResources : {};
          this.ensureVerificationStatus();
        }

        UserAccountInfo.prototype.ensureVerificationStatus = function() {
          this.idApproved = _.reduce(this.accountResources, function(memo, resource) {
            return memo || (resource.identity && resource.approved);
          }, false);
          this.idPending = !this.idApproved && _.reduce(this.accountResources, function(memo, resource) {
            return memo || (resource.identity && resource.pending);
          }, false);
          this.idDenied = !this.idApproved && !this.idPending && _.reduce(this.accountResources, function(memo, resource) {
            return memo || (resource.identity && resource.denied);
          }, false);
          this.idUnverified = !this.idApproved && !this.idPending && !this.idDenied;
          this.residencyApproved = _.reduce(this.accountResources, function(memo, resource) {
            return memo || (resource.residency && resource.approved);
          }, false);
          this.residencyPending = !this.residencyApproved && _.reduce(this.accountResources, function(memo, resource) {
            return memo || (resource.residency && resource.pending);
          }, false);
          this.residencyDenied = !this.residencyApproved && !this.residencyPending && _.reduce(this.accountResources, function(memo, resource) {
            return memo || (resource.residency && resource.denied);
          }, false);
          this.residencyUnverified = !this.residencyApproved && !this.residencyPending && !this.residencyDenied;
          this.verified = this.idApproved && this.residencyApproved;
          this.unverified = this.idUnverified || this.residencyUnverified;
          this.denied = !this.unverified && (this.idDenied || this.residencyDenied);
          this.pending = !this.verified && !this.unverified && !this.denied;
          return this.displayVerificationStatus = this.verified ? "Verified" : this.pending ? "Pending" : this.denied ? "Denied" : "Unverified";
        };

        UserAccountInfo.prototype.addAccountResource = function(resource) {
          this.accountResources[resource._id] = resource;
          return this.ensureVerificationStatus();
        };

        UserAccountInfo.prototype.deleteAccountResource = function(resourceId) {
          delete this.accountResources[resourceId];
          return this.ensureVerificationStatus();
        };

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
          var accountResources, accountSettings, userDetails;
          userDetails = UserDetails.FromMessage(msg != null ? msg.userDetails : void 0);
          accountSettings = UserAccountSettings.FromMessage(msg != null ? msg.accountSettings : void 0);
          accountResources = {};
          angular.forEach((msg != null ? msg.accountResources : void 0) || [], function(resource) {
            return this[resource._id] = AccountResource.FromMessage(resource);
          }, accountResources);
          return new UserAccountInfo(userDetails, accountSettings, accountResources);
        },
        Empty: function() {
          return this.FromMessage();
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.user-account-settings', []).service("UserAccountSettings", function() {
    var NotificationsSettings, SecuritySettings, UserAccountSettings;
    SecuritySettings = (function() {
      function SecuritySettings(fiatWithdrawalConfirmation, btcWithdrawalConfirmation) {
        this.fiatWithdrawalConfirmation = fiatWithdrawalConfirmation != null ? fiatWithdrawalConfirmation : true;
        this.btcWithdrawalConfirmation = btcWithdrawalConfirmation != null ? btcWithdrawalConfirmation : true;
      }

      SecuritySettings.FromMessage = function(msg) {
        return new SecuritySettings(msg != null ? msg.fiatWithdrawalConfirmation : void 0, msg != null ? msg.btcWithdrawalConfirmation : void 0);
      };

      return SecuritySettings;

    })();
    NotificationsSettings = (function() {
      function NotificationsSettings(fiatDepositComplete, btcDepositComplete, bankAccountAdded, fundsWithdrawn) {
        this.fiatDepositComplete = fiatDepositComplete != null ? fiatDepositComplete : true;
        this.btcDepositComplete = btcDepositComplete != null ? btcDepositComplete : true;
        this.bankAccountAdded = bankAccountAdded != null ? bankAccountAdded : true;
        this.fundsWithdrawn = fundsWithdrawn != null ? fundsWithdrawn : true;
      }

      NotificationsSettings.FromMessage = function(msg) {
        return new NotificationsSettings(msg != null ? msg.fiatDepositComplete : void 0, msg != null ? msg.btcDepositComplete : void 0, msg != null ? msg.bankAccountAdded : void 0, msg != null ? msg.fundsWithdrawn : void 0);
      };

      return NotificationsSettings;

    })();
    UserAccountSettings = (function() {
      function UserAccountSettings(security, notifications) {
        this.security = security != null ? security : {};
        this.notifications = notifications != null ? notifications : {};
      }

      return UserAccountSettings;

    })();
    return {
      FromMessage: function(msg) {
        var notificationsSettings, securitySettings;
        securitySettings = SecuritySettings.FromMessage(msg != null ? msg.security : void 0);
        notificationsSettings = NotificationsSettings.FromMessage(msg != null ? msg.notifications : void 0);
        return new UserAccountSettings(securitySettings, notificationsSettings);
      }
    };
  });

}).call(this);
