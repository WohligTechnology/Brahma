//var adminurl = "http://130.211.118.86/";
var adminurl = "http://localhost:1337/";
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function ($http) {
    var navigation = [{
        name: "Dashboard",
        classis: "active",
        link: "#/home",
        subnav: []
  }];

    return {
        getnav: function () {
            return navigation;
        },
        makeactive: function (menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        setJson: function (json) {
            $http({
                method: 'POST',
                url: './views/demo.json', //this is the json file with all the information I use
                data: json //this contains the modified data
            }).success(function (response) {
                console.log("Success message.");
            }).error(function (response) {
                console.log("Error message.");
            });
            $.jStorage.set("json", json);
        },
        getJson: function () {
            return $.jStorage.get("json");
        },
        createproject: function (data, callback) {
            $http({
                url: adminurl + "angular/cloneBlack",
                method: "POST",
                data: data
            }).success(callback);
        }
    }
});