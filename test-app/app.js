var app = angular.module('test-app', ['bc.angular-models']);

app.controller('MainCtrl', function MainCtrl ($scope, OrderInfo, AccountResource, UserAccountInfo) {

  var userMsg = {
    accountId: "12345678-abcd-efgh-ijkl-09876543",
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
    }
  };
  $scope.userAccount = UserAccountInfo.FromMessage(userMsg);

  var resourceMsg = {
    _id: "11111111111111",
    accountId: "12345678-abcd-efgh-ijkl-09876543",
    awsKey: "12345678-abcd-efgh-ijkl-09876543_randomdigits_file.jpg",
    createdAt: new Date().getTime(),
    resourceInfo: {
      verificationType: "identity",
      fileName: "file.jpg",
      docId: "",
      docType: "Passport",
      docStatus: "pending",
      userDisplayName: "Walter White",
      email: "walter@lospolloshermanos.com",
    }
  };
  $scope.resource = AccountResource.FromMessage(resourceMsg);



});

