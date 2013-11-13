var app = angular.module('test-app', ['bc.angular-models']);

app.controller('MainCtrl', function MainCtrl ($scope, OrderInfo, AccountResource, UserAccountInfo) {

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
    },
    accountResources: [resourceMsg1, resourceMsg2, resourceMsg3]
  };
  $scope.userAccount = UserAccountInfo.FromMessage(userMsg);
  console.log('Agg');
});

