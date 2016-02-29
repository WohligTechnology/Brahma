var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog']);

phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = false;
    $scope.navigation = NavigationService.getnav();
    $scope.json = {};

    $scope.jsontext = NavigationService.getJson();
    if ($scope.jsontext != null) {
        _.each($scope.jsontext.models, function(n) {
            _.each(n.structure, function(m) {
                m.order = parseInt(m.order);
            });
            n.structure = _.sortByOrder(n.structure, ['order'], ['asc']);
        });
        $scope.json = $scope.jsontext;
        console.log($scope.json);
    }

    $scope.submitForm = function() {
        NavigationService.createproject($scope.jsontext, function(data, status) {
            console.log(data);
        })
    }

    $scope.openNext = function() {
        NavigationService.setJson($scope.json);
        $location.url("/models");
    }


});

phonecatControllers.controller('models', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/models.html";
    TemplateService.list = false;
    $scope.navigation = NavigationService.getnav();
    $scope.json = {};
    $scope.json.default = [];
    $scope.json.image = [];
    $scope.json.select = [];
    $scope.json.uiselect = [];
    $scope.newjson = {};
    $scope.newjson.structure = [];
    $scope.jsonpass = {};
    $scope.json.array = [];
    $scope.json.radiocheck = [];

    if ($.jStorage.get("json"))
        $scope.jsonpass = NavigationService.getJson();
    if ($scope.jsonpass.models) {
        console.log("yes models");
    } else {
        console.log("no models");
        $scope.jsonpass.models = [];
    }

    $scope.DefaultStructure = [{
        "name": "order",
        "type": "text"
    }, {
        "name": "name",
        "type": "text"
    }, {
        "name": "type",
        "type": "text"
    }, {
        "name": "validation",
        "type": "text",
    }];

    $scope.ImageStructure = [{
        "name": "order",
        "type": "text"
    }, {
        "name": "name",
        "type": "text"
    }, {
        "name": "uploadtype",
        "type": "text"
    }, {
        "name": "whichone",
        "type": "number"
    }];

    $scope.RadioCheckStructure = [{
        "name": "name",
        "type": "text"
    }, {
        "name": "type",
        "type": "text"
    }];

    $scope.SelectOptionStructure = [{
        "name": "value",
        "type": "text"
    }, {
        "name": "name",
        "type": "text"
    }];

    $scope.UiSelect = [{
        "name": "order",
        "type": "text"
    }, {
        "name": "name",
        "type": "text"
    }, {
        "name": "api",
        "type": "text"
    }];

    $scope.ArrayStructure = [{
        "name": "name",
        "type": "text"
    }, {
        "name": "type",
        "type": "text"
    }];

    // $scope.submitForm = function() {
    //     console.log($scope.json);
    // }

    $scope.addSelect = function() {
        $scope.json.select.push({
            "order": "",
            "name": "",
            "type": "select",
            "isfromdb": "true",
            "api": "",
            "option": []
        });
    }
    $scope.deleteSelect = function(index) {
        $scope.json.select.splice(index, 1);
    }

    $scope.addRadioCheck = function() {
        $scope.json.radiocheck.push({
            "order": "",
            "headname": "",
            "radiocheck": []
        });
    }
    $scope.deleteRadioCheck = function(index) {
        $scope.json.radiocheck.splice(index, 1);
    }

    $scope.addArray = function() {
        $scope.json.array.push({
            "order": "",
            "name": "",
            "structure": []
        });
    }
    $scope.deleteArray = function(index) {
        $scope.json.array.splice(index, 1);
    }

    $scope.submitForm = function() {
        $scope.newjson = {};
        $scope.newjson.structure = [];
        $scope.newjson.name = $scope.json.pagename;

        console.log($scope.json.radiocheck);

        _.each($scope.json.default, function(n) {
            if (n.validation)
                n.validation = n.validation.split(",");
            $scope.newjson.structure.push(n);
        });

        _.each($scope.json.image, function(n) {
            n.type = "image";
            $scope.newjson.structure.push(n);
        });

        _.each($scope.json.radiocheck, function(n) {
            n.type = "radio";
            $scope.newjson.structure.push(n);
        });

        _.each($scope.json.select, function(n) {
            if ($scope.json.select.isfromdb == "true")
                $scope.json.select.isfromdb = true;
            if ($scope.json.select.isfromdb == "false")
                $scope.json.select.isfromdb = false;
            $scope.newjson.structure.push(n);
        });

        _.each($scope.json.uiselect, function(n) {
            n.type = "uiselect";
            $scope.newjson.structure.push(n);
        });

        _.each($scope.json.array, function(n) {
            n.type = "array";
            $scope.newjson.structure.push(n);
        });

        $scope.jsonpass.models.push($scope.newjson);
        NavigationService.setJson($scope.jsonpass);

        $location.url("/home");
    }
});

phonecatControllers.controller('headerctrl', ['$scope', 'TemplateService',
    function($scope, TemplateService) {
        $scope.template = TemplateService;
    }
]);
