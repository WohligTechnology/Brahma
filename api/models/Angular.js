/**
 * Angular.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var basepath = "";
var baseurl = "";
var projname = "";
module.exports = {
    cloneBlack: function(data, callback) {
        basepath = data.path + "/" + data.projectname + "/";
        projname = data.projectname + "Node";
        baseurl = sails.path.normalize(data.path) + "/" + data.projectname + "Node";
        makesailsproj(data);

        //        var jsontoparse = data.models;
        //        addService(data);
        //        addPath(data);
        //        _.each(jsontoparse, function (n) {
        //            addViews(n);
        //        });

        sails.simpleGit.clone('https://github.com/WohligTechnology/BackSpace.git', basepath, function(err) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var jsontoparse = data.models;
                addService(data);
                addPath(data);
                _.each(jsontoparse, function(n) {
                    addViews(n);
                });
            }
        });

    },
    addelements: function(data, callback) {
        var tagdata = "";
        basepath = data.path + "/" + data.projectname + "/";
        editController(data);
        var filename = data.models.name.toLowerCase();
        var modifycreatefile = basepath + "views/create" + filename + ".html";
        var modifyeditfile = basepath + "views/edit" + filename + ".html";
        tagdata += addHTMLTags(data.models);
        tagdata += "<!--Add New Tags-->";
        sails.fs.readFile(modifycreatefile, 'utf8', function(err, data) {
            if (data) {
                var splited = data.split("<!--Add New Tags-->");
                var merge = splited[0] + tagdata + splited[1];
                var writepath = sails.fs.createWriteStream(modifycreatefile);
                writepath.write(merge);
            }
        });
        sails.fs.readFile(modifyeditfile, 'utf8', function(err, data) {
            if (data) {
                var splited = data.split("<!--Add New Tags-->");
                var merge = splited[0] + tagdata + splited[1];
                var writepath = sails.fs.createWriteStream(modifyeditfile);
                writepath.write(merge);
            }
        });
    }
};

function addHTMLTags(page) {
    var tagdata = "";
    _.each(page.structure, function(n) {
        switch (n.type) {
            case "array":
                {
                    tagdata += "<array objval='" + sails._.capitalize(n.name) + "Structure' label='" + sails._.capitalize(n.name) + "' editval='" + page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase() + "'></array>";
                    break;
                }

            case "uiselect":
                {
                    tagdata += "<div class='form-group ui-selecter'><label for='exampleInputEmail1'>Select " + sails._.capitalize(n.name) + "</label><div class='form-group'><ui-select multiple tagging tagging-label='false' ng-model = '" + page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase() + "' on-select='ismatch" + sails._.capitalize(sails._.camelCase(n.name)) + "(" + page.name.toLowerCase() + "." + n.name.toLowerCase() + ",$select);'><ui-select-match placeholder='Select " + sails._.capitalize(n.name) + "'>{{$item.name}}</ui-select-match><ui-select-choices repeat='person in " + n.name.toLowerCase() + " track by person._id' refresh='refresh" + sails._.capitalize(n.name) + "($select.search,$select.selected)' refresh-delay='0'><div ng-bind-html='person.name'></div></ui-select-choices></ui-select></div></div>";
                    break;
                }
            case "select":
                {
                    if (n.isfromdb == true || n.isfromdb == "true") {
                        tagdata += "<div class='form-group'><label>" + sails._.capitalize(n.name) + "</label> <select ng-model = '" + page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase() + "' class = 'form-control'> <option value =''>Please Select</option> <option ng-repeat = 'value in " + sails._.camelCase(n.name).toLowerCase() + "' value='{{value._id}}'>{{value.name}}</option></select></div>";
                    }
                    if (n.isfromdb == false || n.isfromdb == "false") {
                        tagdata += "<div class='form-group'><label>" + sails._.capitalize(n.name) + "</label> <select ng-model = '" + page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase() + "' class = 'form-control'>";
                        _.each(n.option, function(opt) {
                            tagdata += "<option value ='" + opt.value + "'>" + opt.name + "</option>";
                        })
                        tagdata += "</select></div>";
                    }
                    break;
                }
            case "textarea":
                {
                    tagdata += "<div class='form-group'><label for='exampleInputEmail1'>" + sails._.capitalize(n.name) + "</label><textarea class='form-control' ng-model = '" + page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase() + "' placeholder='" + sails._.capitalize(n.name) + "'";
                    if (n.validation) {
                        _.each(n.validation, function(m) {
                            tagdata += " " + m;
                        })
                        tagdata += " ></textarea></div>";
                    } else {
                        tagdata += " ></textarea></div>";
                    }
                    break;
                }
            default:
                {
                    tagdata += "<div class='form-group'><label>" + sails._.capitalize(n.name) + "</label><input type='" + n.type + "' class='form-control' ng-model = '" + page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase() + "' placeholder='" + sails._.capitalize(n.name) + "'";
                    if (n.validation) {
                        _.each(n.validation, function(m) {
                            tagdata += " " + m;
                        })
                        tagdata += " > </div>";
                    } else {
                        tagdata += " > </div>";
                    }
                    break;
                }
        }
    });
    if (tagdata != "")
        return tagdata;
}

function addPath(Path) {

    var updowndata = "";
    var tagdata = "";
    var merge = "";
    var ctrl = basepath + "/js/app.js";
    sails.fs.readFile(basepath + "/js/app.js", 'utf8', function(err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitdata = updowndata.split("//Add New Path");
            _.each(Path.models, function(n) {
                tagdata = tagdata + "when('/" + n.name.toLowerCase() + "', {templateUrl: 'views/template.html',controller: '" + sails._.capitalize(n.name) + "Ctrl'}).";
                tagdata = tagdata + "when('/create" + n.name.toLowerCase() + "', {templateUrl: 'views/template.html',controller: 'create" + sails._.capitalize(n.name) + "Ctrl'}).";
                tagdata = tagdata + "when('/edit" + n.name.toLowerCase() + "/:id', {templateUrl: 'views/template.html',controller: 'edit" + sails._.capitalize(n.name) + "Ctrl'}).";
                merge = splitdata;
            })
            if (merge != "") {
                tagdata = tagdata + "//Add New Path";
                tagdata = merge[0] + tagdata + merge[1];
                var ctrlpath = sails.fs.createWriteStream(ctrl);
                ctrlpath.write(tagdata);
            }
        }
    });
}

function editController(jsondata) {
    var updowndata = "";
    var updowndataservice = "";
    var tagdata = "";
    var tagdataservice = "";
    var tagdataleft = "";
    var merge = "";
    var mergeservice = "";
    var mergeleft = "";
    var ctrl = basepath + "/js/controllers.js";
    var serv = basepath + "/js/navigation.js";
    sails.fs.readFile(basepath + "/js/controllers.js", 'utf8', function(err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitcontroller = sails._.capitalize(jsondata.models.name);
            tagdata = "";


            var splitdatac = updowndata.split("//create" + splitcontroller + " Controller");
            tagdata += getControllerData("", jsondata.models, splitdatac[1], "create");
            merge = splitdatac;

            if (merge != "") {

                tagdata = merge[0] + tagdata + merge[2];
                splitdatac = tagdata.split("//edit" + splitcontroller + " Controller");

                tagdata = getControllerData("", jsondata.models, splitdatac[1], "edit");

                merge = splitdatac;
                if (merge != "") {
                    tagdata = merge[0] + tagdata + merge[2];
                    //          tagdata = tagdata;
                    var ctrlpath = sails.fs.createWriteStream(ctrl);
                    ctrlpath.write(tagdata);
                }

                var ctrlpath = sails.fs.createWriteStream(ctrl);
                ctrlpath.write(tagdata);
            }


        }
    });


    sails.fs.readFile(basepath + "/js/navigation.js", 'utf8', function(err, data) {
        if (err) throw err;
        if (data) {
            tagdataservice = '';
            merge = '';
            var splitdataservice = data.split("//Add New Service");
            _.each(service.models, function(n) {

                tagdataservice += addServiceData(n);

                merge = splitdataservice;

            })


            if (merge != "") {
                tagdataservice = tagdataservice + "//Add New Service";
                var leftdata = merge[0].split("//Add New Left");
                leftdata = leftdata[0] + tagdataleft + leftdata[1];
                tagdataservice = leftdata + tagdataservice + merge[1];

                var ctrlpath = sails.fs.createWriteStream(serv);
                ctrlpath.write(tagdataservice);
            }
        }
    });
}

function getControllerData(data, n, fromdata, state) {
    var tagdata = '';
    var formdataaray = '';
    var aaraydata = '';
    var a = sails._.capitalize(n.name);
    if (state == "create") {
        fromdata = fromdata.split("//create" + a);
    }
    if (state == "edit") {
        fromdata = fromdata.split("//edit" + a);
    }

    if (data != "" || state == "edit") {
        if (data != "") {
            tagdata += "//" + data + sails._.capitalize(n.name) + " Controller\nphonecatControllers.controller('" + data + sails._.capitalize(n.name) + "Ctrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {$scope.template = TemplateService;$scope.menutitle =NavigationService.makeactive('" + sails._.capitalize(n.name) + "');TemplateService.title = $scope.menutitle;TemplateService.submenu = '';TemplateService.content = 'views/" + data + n.name.toLowerCase() + ".html';TemplateService.list = 2;$scope.navigation = NavigationService.getnav();$scope." + n.name.toLowerCase() + " = {};";
        }


        if (data == 'edit' || state == 'edit') {
            if (data == "edit") {
                tagdata += "NavigationService.getOne" + sails._.capitalize(n.name) + "($routeParams.id, function (data, status) {$scope." + n.name.toLowerCase() + " = data;";
            }
            _.each(n.structure, function(m) {
                if (m.type == "array") {
                    if (state == "edit") {
                        formdataaray = fromdata[0].split("//Add More Array");
                        aaraydata = "if(!$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + "){$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + " = [];}";
                        fromdata[0] = formdataaray[0] + aaraydata + "//Add More Array" + formdataaray[1];
                    }
                    if (data == "edit") {
                        tagdata += "if(!$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + "){$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + " = [];}";
                    }

                }
            });
            if (data == "edit") {
                tagdata += "//Add More Array\n});";

                tagdata += "$scope.submitForm = function () {$scope." + n.name.toLowerCase() + "._id = $routeParams.id;NavigationService.save" + sails._.capitalize(n.name) + "($scope." + n.name.toLowerCase() + ", function (data, status) {$location.url('/" + n.name.toLowerCase() + "');});};";
            }
        } else {
            tagdata += "$scope.submitForm = function () {NavigationService.save" + sails._.capitalize(n.name) + "($scope." + n.name.toLowerCase() + ", function (data, status) {$location.url('/" + n.name.toLowerCase() + "');});};";
        }
    }

    _.each(n.structure, function(m) {

        switch (m.type) {
            case "uiselect":
                {
                    tagdata += "$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + " = [];$scope.ismatch" + sails._.capitalize(sails._.camelCase(m.name)) + " = function (data, select) {_.each(data, function (l, key) {if (typeof l == 'string') {";
                    tagdata += "var item = {_id:_.now(),name:_.capitalize(l)};";
                    tagdata += "NavigationService.save" + m.name + "(item, function (data, status) {if (data.value == true) {item._id = data.id;}});select.selected = _.without(select.selected, l);select.selected.push(item);$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + " = select.selected;}});}$scope.refresh" + sails._.capitalize(m.name) + " = function (search) {$scope." + m.name.toLowerCase() + " = [];if (search) {NavigationService.find" + sails._.capitalize(m.name) + "(search, $scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + ", function (data, status) {if (data.value != false){$scope." + m.name.toLowerCase() + " = data;}});}};";
                    break;
                };

            case "select":
                {
                    if (m.isfromdb == "true") {
                        tagdata += "NavigationService.get" + sails._.capitalize(m.api) + "(function(data,status){$scope." + m.name.toLowerCase() + " = data;});"
                    }
                    break;
                };

            case "array":
                {
                    var stuct = m.structure;
                    if (data == "create") {
                        tagdata += "$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + "=[];";
                    }
                    tagdata += "$scope." + sails._.capitalize(m.name) + "Structure=" + JSON.stringify(m.structure) + ";";
                    break;
                }
        };

    });
    if (fromdata == "") {
        tagdata += "\n//" + data + sails._.capitalize(n.name) + "\n});\n//" + data + sails._.capitalize(n.name) + " Controller\n";
    } else {
        if (state == "create") {
            tagdata = "\n//create" + data + sails._.capitalize(n.name) + " Controller\n" + fromdata[0] + tagdata + "//create" + sails._.capitalize(n.name) + fromdata[1] + "\n//create" + data + sails._.capitalize(n.name) + " Controller\n";
        }
        if (state == "edit") {
            tagdata = "\n//edit" + data + sails._.capitalize(n.name) + " Controller\n" + fromdata[0] + tagdata + "//edit" + sails._.capitalize(n.name) + fromdata[1] + "\n//edit" + data + sails._.capitalize(n.name) + " Controller\n";
        }
    }
    return tagdata;
}

function addServiceData(n) {
    tagdataservice = '';
    _.each(n.structure, function(m) {

        switch (m.type) {
            case "uiselect":
                {
                    tagdataservice += "save" + sails._.capitalize(m.name) + ": function (data, callback) {$http({url: adminurl + '" + m.name.toLowerCase() + "/save',method: 'POST',data: {'name':data.name}}).success(callback);},";

                    tagdataservice += "find" + sails._.capitalize(m.name) + ": function (data, " + m.name.toLowerCase() + ", callback) {$http({url: adminurl + '" + m.name.toLowerCase() + "/find',method: 'POST',data: {search: data," + m.name.toLowerCase() + ": " + m.name.toLowerCase() + "}}).success(callback);},"
                    break;
                };

            case "select":
                {
                    if (m.isfromdb == "true") {
                        tagdataservice += "get" + sails._.capitalize(m.api) + ": function (callback) {$http({url: adminurl+ '" + m.api.toLowerCase() + "/find',method: 'POST',data: {}}).success(callback);},"
                    }
                    break;
                };

        };

    });
    return tagdataservice;
}

function addService(service) {

    var updowndata = "";
    var updowndataservice = "";
    var tagdata = "";
    var tagdataservice = "";
    var tagdataleft = "";
    var merge = "";
    var mergeservice = "";
    var mergeleft = "";
    var ctrl = basepath + "/js/controllers.js";
    var serv = basepath + "/js/navigation.js";
    sails.fs.readFile(basepath + "/js/controllers.js", 'utf8', function(err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitdata = updowndata.split("//Add New Controller");
            tagdata = "";
            _.each(service.models, function(n) {
                tagdata += "//" + sails._.capitalize(n.name) + " Controller\nphonecatControllers.controller('" + sails._.capitalize(n.name) + "Ctrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {$scope.template = TemplateService;$scope.menutitle =NavigationService.makeactive('" + sails._.capitalize(n.name) + "');TemplateService.title = $scope.menutitle;TemplateService.submenu = '';TemplateService.content = 'views/" + n.name.toLowerCase() + ".html';TemplateService.list = 2;$scope.navigation = NavigationService.getnav();$scope." + n.name + " = [];$scope.pagedata = {};$scope.pagedata.page = 1;$scope.pagedata.limit = '20';$scope.pagedata.search = '';$scope.number = 100;$scope.reload = function (pagedata) {$scope.pagedata = pagedata;NavigationService.findLimited" + sails._.capitalize(n.name) + "($scope.pagedata, function (data, status) {$scope." + n.name.toLowerCase() + " = data;$scope.pages = [];var newclass = '';for (var i = 1; i <= data.totalpages; i++) {if (pagedata.page == i) {newclass = 'active';} else {newclass = '';}$scope.pages.push({pageno: i,class: newclass});}});}$scope.reload($scope.pagedata);$scope.confDelete = function() {NavigationService.delete" + sails._.capitalize(n.name) + "(function(data, status) {ngDialog.close();window.location.reload();});}$scope.deletefun = function(id) {$.jStorage.set('delete" + n.name.toLowerCase() + "', id);ngDialog.open({template: 'views/delete.html',closeByEscape: false,controller: '" + sails._.capitalize(n.name) + "Ctrl',closeByDocument: false});}\n//End " + sails._.capitalize(n.name) + "\n});\n//" + n.name.toLowerCase() + " Controller\n";

                tagdata += getControllerData("create", n, "", "");
                tagdata += getControllerData("edit", n, "", "");

                merge = splitdata;
            })
            if (merge != "") {
                tagdata = tagdata + "//Add New Controller";
                tagdata = merge[0] + tagdata + merge[1];
                var ctrlpath = sails.fs.createWriteStream(ctrl);
                ctrlpath.write(tagdata);
            }
        }
    });


    sails.fs.readFile(basepath + "/js/navigation.js", 'utf8', function(err, data) {
        if (err) throw err;
        if (data) {
            tagdataservice = '';
            merge = '';
            var splitdataservice = data.split("//Add New Service");
            _.each(service.models, function(n) {

                tagdataservice += "getOne" + sails._.capitalize(n.name) + ": function (id, callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/findone',method: 'POST',data: {'_id':id}}).success(callback);},";

                tagdataleft += "{name: '" + sails._.capitalize(n.name) + "',active: '',link: '#/" + n.name.toLowerCase() + "',subnav: []},";


                tagdataservice += "findLimited" + sails._.capitalize(n.name) + ": function(" + n.name.toLowerCase() + ", callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/findlimited',method: 'POST',data: {'search': " + n.name.toLowerCase() + ".search,'pagesize': parseInt(" + n.name.toLowerCase() + ".limit),'pagenumber': parseInt(" + n.name.toLowerCase() + ".page)}}).success(callback);},";

                tagdataservice += "delete" + sails._.capitalize(n.name) + ": function (callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/delete',method: 'POST',data: {'_id': $.jStorage.get('delete" + n.name.toLowerCase() + "')}}).success(callback);},";

                tagdataservice += "save" + sails._.capitalize(n.name) + ": function (data, callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/save',method: 'POST',data: data}).success(callback);},";


                tagdataservice += addServiceData(n);

                merge = splitdataservice;

            })


            if (merge != "") {
                tagdataservice = tagdataservice + "//Add New Service";
                var leftdata = merge[0].split("//Add New Left");
                leftdata = leftdata[0] + tagdataleft + "//Add New Left\n" + leftdata[1];
                tagdataservice = leftdata + tagdataservice + merge[1];

                var ctrlpath = sails.fs.createWriteStream(serv);
                ctrlpath.write(tagdataservice);
            }
        }
    });
}

function addController() {}

function addViews(page) {
    var updowndata = "";
    var tagdata = "";
    var merge = "";

    //make createview
    var makecreateview = sails.fs.createWriteStream(basepath + "/views/create" + page.name.toLowerCase() + ".html");
    var makeeditview = sails.fs.createWriteStream(basepath + "/views/edit" + page.name.toLowerCase() + ".html");
    sails.fs.readFile('./readfiles/createorder.html', 'utf8', function(err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitdata = updowndata.split("<!--Add New Tags-->");
            tagdata = addHTMLTags(page, page.structure);
            if (tagdata != "")
                merge = splitdata;
        }
        if (merge != "") {
            tagdata += "<!--Add New Tags-->";
            merge[0] = merge[0].replace("Create Order", "Create " + page.name);
            tagdata = merge[0] + tagdata + merge[1];
            makecreateview.write(tagdata);

            //make editview
            var editdata = tagdata;
            editdata = editdata.split("Create").join("Edit");
            makeeditview.write(editdata);


            //make view
            var makeviewpage = sails.fs.createWriteStream(basepath + "/views/" + page.name.toLowerCase() + ".html");
            sails.fs.readFile('./readfiles/order.html', 'utf8', function(err, data) {
                if (err) throw err;
                if (data) {
                    console.log(page.name);
                    var filedata = data.replace("Show Order", "Show " + sails._.capitalize(page.name));
                    filedata = filedata.replace("createorder", "create" + page.name.toLowerCase());
                    filedata = filedata.replace("Create Order", "Create " + sails._.capitalize(page.name));
                    filedata = filedata.replace("order.data", page.name.toLowerCase() + ".data");
                    filedata = filedata.replace("editorder", "edit" + page.name.toLowerCase());
                    var textindex = sails._.findIndex(page.structure, function(rindex) {
                        return rindex.type == 'text';
                    })
                    filedata = filedata.replace("Artist", sails._.capitalize(page.structure[textindex].name));
                    filedata = filedata.replace("{{value.artist}}", "{{value." + page.structure[textindex].name.toLowerCase() + "}}");
                    makeviewpage.write(filedata);
                }
            });
            sails.fs.readFile(basepath + "views/login.html", 'utf8', function(err, logindata) {
                if (data) {
                    var onlogin = projname.split("Node");
                    var loginname = "";
                    onlogin[0] = onlogin[0].split(/(?=[A-Z])/);
                    _.each(onlogin[0], function(n) {
                        loginname += n + " ";
                    })
                    logindata = logindata.replace("Aura Art Admin", loginname);
                    var editloginpage = sails.fs.createWriteStream(basepath + "views/login.html");
                    editloginpage.write(logindata);
                }
            })
        }
    });
}

function makesailsproj(data) {
    var newarr = [];
    var mymodel = data.models;
    sails.exec("sails new " + baseurl, function(err, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
            _.each(data.models, function(n) {
                var makejsfile = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(n.name) + ".js");
                sails.fs.readFile('./readfiles/CreateOModel.js', 'utf8', function(err, data) {
                    if (err) throw err;
                    var somedata = data.split("user").join(n.name.toLowerCase());
                    var index = _.findIndex(n.structure, function(chr) {
                        return chr.type == 'text';
                    });
                    if (index != -1) {
                        somedata = somedata.split("name").join(n.structure[index].name.toLowerCase());
                        makejsfile.write(somedata);
                    } else if (index == -1) {
                        somedata = somedata.split("//Findlimited");
                        somedata = somedata[0] + somedata[2];
                        makejsfile.write(somedata);
                    }
                });
                var makecontrolfile = sails.fs.createWriteStream(baseurl + "/api/controllers/" + sails._.capitalize(n.name) + "Controller.js");
                sails.fs.readFile('./readfiles/CreateOController.js', 'utf8', function(err, data) {
                    if (err) throw err;
                    var somecontdata = data.split("User").join(sails._.capitalize(n.name));
                    makecontrolfile.write(somecontdata);
                });
                if (n.structure) {
                    _.each(n.structure, function(m) {
                        if (m.type == "array") {
                            var apiname = _.indexOf(newarr, m.name);
                            if (apiname == -1) {
                                newarr.push(m.name);
                                var makearraymodel = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(m.name) + ".js");
                                sails.fs.readFile('./readfiles/CreateOArrayModel.js', 'utf8', function(err, data) {
                                    if (err) throw err;
                                    var somedata = data.split("user").join(n.name.toLowerCase());
                                    somedata = somedata.split("feed").join(m.name.toLowerCase());
                                    var index = _.findIndex(m.structure, function(chr) {
                                        return chr.type == 'text';
                                    });
                                    if (index != -1) {
                                        somedata = somedata.split("name").join(m.structure[index].name.toLowerCase());
                                        makearraymodel.write(somedata);
                                    } else if (index == -1) {
                                        somedata = somedata.split("//Findlimited");
                                        somedata = somedata[0] + somedata[2];
                                        makearraymodel.write(somedata);
                                    }
                                });
                                var makearraycontrol = sails.fs.createWriteStream(baseurl + "/api/controllers/" + sails._.capitalize(m.name) + "Controller.js");
                                sails.fs.readFile('./readfiles/CreateOArrayController.js', 'utf8', function(err, data) {
                                    if (err) throw err;
                                    var somecontdata = data.split("Feed").join(sails._.capitalize(m.name));
                                    makearraycontrol.write(somecontdata);
                                });
                            }
                        } else if (m.type == "uiselect") {
                            var nameindex = _.findIndex(mymodel, function(chr) {
                                return chr.name == m.api;
                            });
                            if (nameindex == -1) {
                                var makejsfile = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(m.api) + ".js");
                                sails.fs.readFile('./readfiles/CreateOUiSelectmodel.js', 'utf8', function(err, data) {
                                    if (err) throw err;
                                    var somedata = data.split("theme").join(m.api.toLowerCase());
                                    makejsfile.write(somedata);
                                });
                                var makecontrolfile = sails.fs.createWriteStream(baseurl + "/api/controllers/" + sails._.capitalize(m.api) + "Controller.js");
                                sails.fs.readFile('./readfiles/CreateOUiselectcontroller.js', 'utf8', function(err, data) {
                                    if (err) throw err;
                                    var somecontdata = data.split("Theme").join(sails._.capitalize(m.api));
                                    makecontrolfile.write(somecontdata);
                                });
                            }
                        } else if (m.type == "select" && m.isfromdb == "true") {
                            var nameindex = _.findIndex(mymodel, function(chr) {
                                return chr.name == m.api;
                            });
                            if (nameindex == -1) {
                                var makejsfile = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(m.api) + ".js");
                                sails.fs.readFile('./readfiles/CreateOModel.js', 'utf8', function(err, data) {
                                    if (err) throw err;
                                    var somedata = data.split("user").join(m.api.toLowerCase());
                                    makejsfile.write(somedata);
                                });
                                var makecontrolfile = sails.fs.createWriteStream(baseurl + "/api/controllers/" + sails._.capitalize(m.api) + "Controller.js");
                                sails.fs.readFile('./readfiles/CreateOController.js', 'utf8', function(err, data) {
                                    if (err) throw err;
                                    var somecontdata = data.split("User").join(sails._.capitalize(m.api));
                                    makecontrolfile.write(somecontdata);
                                });
                            }
                        }

                    });
                }
            });
            var modelpath = baseurl + '/config/models.js';
            sails.fs.readFile(modelpath, 'utf8', function(err, data1) {
                var modeldata = data1.replace("// migrate", "migrate");
                modeldata = modeldata.replace("// connection: 'localDiskDb'", "connection: 'someMongodbServer'");
                var modelfile = sails.fs.createWriteStream(modelpath);
                modelfile.write(modeldata);
            });
            var connpath = baseurl + '/config/connections.js';
            sails.fs.readFile(connpath, 'utf8', function(err, data2) {
                var conndata = data2.replace("// database: 'your_mongo_db_name_here'", "database: '" + data.projectname.toLowerCase() + "'");
                var connfile = sails.fs.createWriteStream(connpath);
                connfile.write(conndata);
            });
            var bootpath = baseurl + '/config/bootstrap.js';
            sails.fs.readFile('./readfiles/CreateObootstrap.txt', 'utf8', function(err, data3) {
                var bootdata = data3.replace("27017/auraart", "27017/" + data.projectname.toLowerCase());
                var bootfile = sails.fs.createWriteStream(bootpath);
                bootfile.write(bootdata);
            });
            var corspath = baseurl + '/config/cors.js';
            sails.fs.readFile('./readfiles/CreateOcors.txt', 'utf8', function(err, data5) {
                var corsfile = sails.fs.createWriteStream(corspath);
                corsfile.write(data5);
            });
            var uploadpath = baseurl + '/api/controllers/UploadfileController.js';
            sails.fs.readFile('./readfiles/CreateOUpload.txt', 'utf8', function(err, data3) {
                var bootfile = sails.fs.createWriteStream(uploadpath);
                bootfile.write(data3);
            });
            var jsonpath = baseurl + '/package.json';
            sails.fs.readFile('./readfiles/CreateOPackage.txt', 'utf8', function(err, data4) {
                var jsondata = data4.split("CreateONode").join(projname);
                var jsonfile = sails.fs.createWriteStream(jsonpath);
                jsonfile.write(jsondata);
            });
            var startpath = baseurl + '/start.bat';
            sails.fs.readFile('./readfiles/CreateOstart.txt', 'utf8', function(err, data4) {
                var startfile = sails.fs.createWriteStream(startpath);
                startfile.write(data4);
            });
            var bluepath = baseurl + '/config/blueprints.js';
            sails.fs.readFile('./readfiles/CreateOBlueprint.txt', 'utf8', function(err, data5) {
                var bluefile = sails.fs.createWriteStream(bluepath);
                bluefile.write(data5);
            });
        }
    });
}
