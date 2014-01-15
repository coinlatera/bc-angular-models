var app = angular.module('test-app', ['bc.angular-models']);

app.constant('CONFIG', { debug: true });
app.controller('MainCtrl', function MainCtrl ($scope, OrderInfo, TradeFee, AccountResource, UserAccountInfo, ErrorMessage, AdminRole, AdminAccountInfo, AccessLevel, UserAccountSettings, TransactionInfo, logger) {

  var resourceMsg1 = {
    _id: "11111111111111",
    accountId: "12345678-abcd-efgh-ijkl-09876543",
    awsKey: "12345678-abcd-efgh-ijkl-09876543_randomdigits_file.jpg",
    createdAt: new Date().getTime(),
    resourceInfo: {
      verificationType: "identity",
      fileName: "file.jpg",
      docId: "1234567890",
      docType: "Passport",
      docStatus: "pending",
      userDisplayName: "Walter White",
      email: "walter@lospolloshermanos.com",
    }
  };
  var resourceMsg2 = {
    _id: "22222222222222",
    accountId: "12345678-abcd-efgh-ijkl-09876543",
    awsKey: "12345678-abcd-efgh-ijkl-09876543_randomdigits_doc.pdf",
    createdAt: new Date().getTime(),
    resourceInfo: {
      verificationType: "residency",
      fileName: "doc.pdf",
      docId: "",
      docType: "Medical Bill",
      docStatus: "approved",
      userDisplayName: "Walter White",
      email: "walter@lospolloshermanos.com",
    }
  };
  var resourceMsg3 = {
    _id: "33333333333333",
    accountId: "12345678-abcd-efgh-ijkl-09876543",
    awsKey: "12345678-abcd-efgh-ijkl-09876543_randomdigits_fail.pdf",
    createdAt: new Date().getTime(),
    failedStep: 2,
    verifiedAt: new Date().getTime(),
    resourceInfo: {
      verificationType: "residency",
      fileName: "fail.pdf",
      docId: "",
      docType: "Electric Bill",
      docStatus: "denied",
      userDisplayName: "Walter White",
      email: "walter@lospolloshermanos.com",
    }
  };

  var userMsg = {
    userDetails: {
      firstName: "Walter",
      middleName: "Heisenberg",
      lastName: "White",
      dateOfBirth: new Date().getTime(),
      birthCountry: "United States",
      residencyAddress: {
        addressLine1: "1234 High St",
        addressLine2: "",
        city: "Albuquerque",
        region: "NM",
        zipCode: "87101",
        country: "United States"
      }
    },
    accountSettings: {
      security: {
        fiatWithdrawalConfirmation: false,
        btcWithdrawalConfirmation: true
      },
      notifications: {
        fiatDepositComplete: false,
        btcDepositComplete: true,
        bankAccountAdded: false,
        fundsWithdrawn: true
      }
    },
    accountResources: [resourceMsg1, resourceMsg2, resourceMsg3]
  };
  $scope.userAccount = UserAccountInfo.FromMessage(userMsg);

  var fieldErrorMsg = {
    _request_id: "0",
    result: "REQUEST_ERROR",
    request: {operation: "UPDATE_USER_ACCOUNT"},
    errors: [
      {"/userDetails/firstName": ["First name required"]},
      {"/userDetails/residencyAddress/zipCode": ["Invalid ZipCode", "ZipCode must contain between 5 and 9 digits"]}
    ]
  };
  $scope.fieldErrorMessage = ErrorMessage.FromMessage(fieldErrorMsg);

  var itemErrorMsg = {
    _request_id: "1",
    result: "REQUEST_ERROR",
    request: {operation: "ADD_BANK_ACCOUNT"},
    errors: ["Bank account routing number not found"]
  };
  $scope.itemErrorMessage = ErrorMessage.FromMessage(itemErrorMsg);

  var nodeFieldErrorMsg = {
    config: {
      data: { someData: "Test submission" },
      method: "POST",
      url: "/testurl"
    },
    data: {
      errors: [
        { "errorField": ["Test message error response"] },
        { "anotherField": ["Test field error", "Something went wrong with field"] }
      ]
    },
    header: function() {}
  };
  $scope.nodeFieldErrorMessage = ErrorMessage.FromMessage(nodeFieldErrorMsg);

  var nodeItemErrorMsg = {
    config: {
      data: { someData: "Test submission" },
      method: "POST",
      url: "/testurl"
    },
    data: { errors: ["Test message error response"] },
    header: function() {}
  };
  $scope.nodeItemErrorMessage = ErrorMessage.FromMessage(nodeItemErrorMsg);

  $scope.allRoles = [];
  angular.forEach(AdminRole.Roles, function (role, roleName) {
    this.push(role);
  }, $scope.allRoles);
  $scope.invalidRoleValue = AdminRole.MaxRoleValue << 2;
  $scope.invalidRole = AdminRole.FromRoleValue($scope.invalidRoleValue);

  $scope.allAccessLevels = [];
  angular.forEach(AccessLevel.AccessLevels, function(accessLevel, accessLevelKey) {
    this.push(AccessLevel.FromAccessLevelValue(accessLevel));
  }, $scope.allAccessLevels);

  var adminMsg = {
    _id: "1111111111111",
    displayName: "Walter White",
    email: "walterwhite@heisenberg.com",
    role: 8,
    name: {
      familyName: "White",
      givenName: "Walter"
    }
  };
  $scope.adminAccount = AdminAccountInfo.FromMessage(adminMsg);

  var tradeFeeMsg = {
    _id: "52cb40644dca69450053481b",
    createdAt: 1389052004000,
    feeAmount: {
      amount: "0.00002488",
      currency: "BTC"
    },
    feeRate: 0.005,
    fundedAmount: {
      amount: "0.00495024",
      currency: "BTC"
    },
    orderId: "72bab9bb-17a2-411a-a984-3175419ad9fc",
    result: "TRADE_FEE",
    tradeType: "LiquidityTaker"
  };
  $scope.tradeFee = TradeFee.Upsert(undefined, tradeFeeMsg);

  var orderEventMsg = { 
    "result": "ORDER_EVENT",
    "orderId": "ca4a2a66-80be-4b8c-aa37-c71d35f752fe",
    "status": {
      "spent": {"currency":"USD", "amount":"50.00000"},
      "earned": {"currency":"BTC", "amount":"0.50000000"},
      "_kind":"reopened"
    }
  };

  var orderInfoMsg = {
    "result": "ORDER_INFO",
    "order": {
      "orderId": "ca4a2a66-80be-4b8c-aa37-c71d35f752fe",
      "offered": {"currency":"USD", "amount":"100.50251"},
      "orderType": {
        "price": {"currency": "USD", "amount": "100.00000"},
        "quantity": {"currency":"BTC", "amount":"1.00502513"},
        "_kind":"limit"
      },
      "parity": "bid",
      "createdAt": 1389650482040
    }, 
    "_history": [
      { "event": {
          "quantity": {"currency":"BTC", "amount":"1.00502513"},
          "_kind":"opened"
        },
        "timestamp": 1389650482156
      },
      { "event": "pending", "timestamp": 1389650482080}
    ]
  };
  $scope.orderInfo = OrderInfo.FromMessage(orderInfoMsg);
  $scope.orderInfo.handleEvent(orderEventMsg.status);

  logger.log('Logger working.');

});

