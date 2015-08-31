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
    cloneBlack: function (data, callback) {
        basepath = data.path + "/" + data.projectname + "/";
        projname = data.projectname + "Node";
        //    baseurl = sails.path.normalize(data.path) + "/" + data.projectname + "Node";
        //    makesailsproj(data);

        var jsontoparse = data.models;
        //        addService(data);
        //        addPath(data);
        _.each(jsontoparse, function (n) {
            addViews(n);
        });

        //        sails.simpleGit.clone('https://github.com/WohligTechnology/Black-Pearl.git', basepath, function (err) {
        //            if (err) {
        //                console.log(err);
        //                callback(err);
        //            } else {
        //                callback({
        //                    value: "true"
        //                });
        //            }
        //        });
    },
    addelements: function (data, callback) {
        basepath = data.path + "/" + data.projectname + "/";
        sails.fs.readFile('./readfiles/createpage.html', 'utf8', function (err, data) {
            if (data) {
                var splitted = data.split("<!--Add New Tags-->");
                console.log("Length=" + splitted.length)
                console.log(splitted[0]);
                console.log("---------------------------------------------------------------------");
                console.log(splitted[1]);
                console.log("---------------------------------------------------------------------");
                console.log(splitted[2]);
            }
        })

    }
};

function addHTMLTags(page) {
    var tagdata = "";
    var splited = [];
    sails.fs.readFile('./readfiles/createtag.txt', 'utf8', function (err, readed) {
        if (readed) {
            _.each(page.structure, function (n) {
                switch (n.type) {
                case "array":
                    {
                        splited = readed.split("//array tag");
                        splited[1] = splited[1].replace("GalleryStructure", sails._.capitalize(n.name) + "Structure");
                        splited[1] = splited[1].replace("GalleryLabel", sails._.capitalize(n.name));
                        splited[1] = splited[1].replace("GalleryEdit", page.name.toLowerCase() + "." + sails._.camelCase(n.name).toLowerCase());
                        tagdata += splited[1].toString();
                        break;
                    }

                case "uiselect":
                    {
                        splited = readed.split("//uiselect tag");
                        console.log(splited[1]);
                        console.log("_____________________________________________________________________");
                        tagdata += splited[1].toString();
                        break;
                    }
                case "select":
                    {
                        if (n.isfromdb == true) {
                            splited = readed.split("//select tag true");
                            console.log(splited[1]);
                            console.log("_____________________________________________________________________");
                            tagdata += splited[1].toString();
                        }
                        if (n.isfromdb == false) {
                            splited = readed.split("//select tag false");
                            console.log(splited[1]);
                            console.log("_____________________________________________________________________");
                            tagdata += splited[1].toString();
                            _.each(n.option, function (opt) {
                                tagdata += "<option value ='" + opt.value + "'>" + opt.name + "</option>";
                            })
                            tagdata += "</select></div>";
                        }
                        break;
                    }
                case "textarea":
                    {
                        splited = readed.split("//textarea tag");
                        console.log(splited[1]);
                        console.log("_____________________________________________________________________");
                        tagdata += splited[1].toString();
                        if (n.validation) {
                            _.each(n.validation, function (m) {
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
                        splited = readed.split("//default tag");
                        console.log(splited[1]);
                        console.log("_____________________________________________________________________");
                        tagdata += splited[1].toString();
                        if (n.validation) {
                            _.each(n.validation, function (m) {
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
        }
    });
    if (tagdata != "") {
        console.log("**********************************");
        console.log(tagdata);
        return tagdata;
    }
}

function addPath(Path) {

    var updowndata = "";
    var tagdata = "";
    var merge = "";
    var ctrl = basepath + "/js/app.js";
    sails.fs.readFile(basepath + "/js/app.js", 'utf8', function (err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitdata = updowndata.split("//Add New Path");
            _.each(Path.models, function (n) {
                tagdata = tagdata + "when('/" + n.name.toLowerCase() + "', {templateUrl: 'views/template.html',controller: '" + sails._.capitalize(n.name) + "Ctrl'}).";
                tagdata = tagdata + "when('/create" + n.name.toLowerCase() + "', {templateUrl: 'views/template.html',controller: 'create" + sails._.capitalize(n.name) + "Ctrl'}).";
                tagdata = tagdata + "when('/edit" + n.name.toLowerCase() + "/:id', {templateUrl: 'views/template.html',controller: 'edit" + sails._.capitalize(n.name) + "Ctrl'}).";
                merge = splitdata;
            })
            if (merge != "") {
                tagdata = tagdata + "//Add New Path";
                tagdata = merge[0] + tagdata + merge[1];
                console.log(tagdata);
                var ctrlpath = sails.fs.createWriteStream(ctrl);
                ctrlpath.write(tagdata);
            }
        }
    });
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
    sails.fs.readFile(basepath + "/js/controllers.js", 'utf8', function (err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitdata = updowndata.split("//Add New Controller");
            tagdata = "";
            _.each(service.models, function (n) {
                tagdata += "phonecatControllers.controller('" + sails._.capitalize(n.name) + "Ctrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {$scope.template = TemplateService;$scope.menutitle =NavigationService.makeactive('" + sails._.capitalize(n.name) + "');TemplateService.title = $scope.menutitle;TemplateService.submenu = '';TemplateService.content = 'views/" + n.name + ".html';TemplateService.list = 2;$scope.navigation = NavigationService.getnav();$scope." + n.name + " = [];$scope.pagedata = {};$scope.pagedata.page = 1;$scope.pagedata.limit = '20';$scope.pagedata.search = '';$scope.number = 100;$scope.reload = function (pagedata) {$scope.pagedata = pagedata;NavigationService.findLimited" + sails._.capitalize(n.name) + "($scope.pagedata, function (data, status) {$scope." + n.name.toLowerCase() + " = data;$scope.pages = [];var newclass = '';for (var i = 1; i <= data.totalpages; i++) {if (pagedata.page == i) {newclass = 'active';} else {newclass = '';}$scope.pages.push({pageno: i,class: newclass});}});}$scope.reload($scope.pagedata);$scope.confDelete = function() {NavigationService.delete" + sails._.capitalize(n.name) + "(function(data, status) {ngDialog.close();window.location.reload();});}$scope.deletefun = function(id) {$.jStorage.set('delete" + n.name.toLowerCase() + "', id);ngDialog.open({template: 'views/delete.html',closeByEscape: false,controller: '" + sails._.capitalize(n.name) + "Ctrl',closeByDocument: false});}});";


                function repeatctrl(data) {

                    tagdata += "phonecatControllers.controller('" + data + sails._.capitalize(n.name) + "Ctrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {$scope.template = TemplateService;$scope.menutitle =NavigationService.makeactive('" + sails._.capitalize(n.name) + "');TemplateService.title = $scope.menutitle;TemplateService.submenu = '';TemplateService.content = 'views/" + data + n.name.toLowerCase() + ".html';TemplateService.list = 2;$scope.navigation = NavigationService.getnav();$scope." + n.name.toLowerCase() + " = {};";

                    if (data == 'edit') {
                        tagdata += "NavigationService.getOne" + sails._.capitalize(n.name) + "($routeParams.id, function (data, status) {$scope." + n.name.toLowerCase() + " = data;";
                        _.each(n.structure, function (m) {
                            if (m.type == "array") {
                                tagdata += "if(!$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + "){$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + " = [];}";
                            }
                        });
                        tagdata += "});";

                        tagdata += "$scope.submitForm = function () {$scope." + n.name.toLowerCase() + "._id = $routeParams.id;NavigationService.save" + sails._.capitalize(n.name) + "($scope." + n.name.toLowerCase() + ", function (data, status) {$location.url('/" + n.name.toLowerCase() + "');});};";
                    } else {
                        tagdata += "$scope.submitForm = function () {NavigationService.save" + sails._.capitalize(n.name) + "($scope." + n.name.toLowerCase() + ", function (data, status) {$location.url('/" + n.name.toLowerCase() + "');});};";
                    }

                    _.each(n.structure, function (m) {

                        switch (m.type) {
                        case "uiselect":
                            {
                                tagdata += "$scope." + n.name.toLowerCase() + "." + m.name.toLowerCase() + " = [];$scope.ismatch = function (data, select) {_.each(data, function (l, key) {if (typeof l == 'string') {";
                                if (m.structure != '') {
                                    tagdata += "var item = {";
                                    _.each(m.structure, function (o) {
                                        tagdata += "_id:_.now()," + o + ":_.capitalize(l),";
                                    });
                                    tagdata += "};";
                                }
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

                    tagdata += "});";
                    merge = splitdata;
                }
                repeatctrl("create");
                repeatctrl("edit");

            })
            if (merge != "") {
                tagdata = tagdata + "//Add New Controller";
                tagdata = merge[0] + tagdata + merge[1];
                var ctrlpath = sails.fs.createWriteStream(ctrl);
                ctrlpath.write(tagdata);
            }
        }
    });


    sails.fs.readFile(basepath + "/js/navigation.js", 'utf8', function (err, data) {
        if (err) throw err;
        if (data) {
            tagdataservice = '';
            merge = '';
            var splitdataservice = data.split("//Add New Service");
            _.each(service.models, function (n) {

                tagdataservice += "getOne" + sails._.capitalize(n.name) + ": function (id, callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/findone',method: 'POST',data: {'_id':id}}).success(callback);},";

                tagdataleft += "{name: '" + sails._.capitalize(n.name) + "',active: '',link: '#/" + n.name.toLowerCase() + "',subnav: []},//Add New Left";


                tagdataservice += "findLimited" + sails._.capitalize(n.name) + ": function(" + n.name.toLowerCase() + ", callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/findlimited',method: 'POST',data: {'search': " + n.name.toLowerCase() + ".search,'pagesize': parseInt(" + n.name.toLowerCase() + ".limit),'pagenumber': parseInt(" + n.name.toLowerCase() + ".page)}}).success(callback);},";

                tagdataservice += "delete" + sails._.capitalize(n.name) + ": function (callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/delete',method: 'POST',data: {'_id': $.jStorage.get('delete" + n.name.toLowerCase() + "')}}).success(callback);},";

                tagdataservice += "save" + sails._.capitalize(n.name) + ": function (data, callback) {$http({url: adminurl + '" + n.name.toLowerCase() + "/save',method: 'POST',data: data}).success(callback);},";


                _.each(n.structure, function (m) {

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

                //        tagdata += "});";

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

function addController() {}

function addViews(page) {
    var updowndata = "";
    var tagdata = "";
    var merge = "";

    //make createview
    var makecreateview = sails.fs.createWriteStream(basepath + "/views/create" + page.name.toLowerCase() + ".html");
    var makeeditview = sails.fs.createWriteStream(basepath + "/views/edit" + page.name.toLowerCase() + ".html");
    sails.fs.readFile('./readfiles/createorder.html', 'utf8', function (err, data) {
        if (err) throw err;
        if (data) {
            updowndata = data;
            var splitdata = updowndata.split("<!--Add New Tags-->");
            //            tagdata = addHTMLTags(page);
            console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
            console.log(addHTMLTags(page));
            if (tagdata != "") {
                merge = splitdata;
            }
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
            sails.fs.readFile('./readfiles/order.html', 'utf8', function (err, data) {
                if (err) throw err;
                if (data) {
                    var filedata = data.replace("Show Order", "Show " + sails._.capitalize(page.name));
                    filedata = filedata.replace("createorder", "create" + page.name.toLowerCase());
                    filedata = filedata.replace("Create Order", "Create " + sails._.capitalize(page.name));
                    filedata = filedata.replace("order.data", page.name.toLowerCase() + ".data");
                    filedata = filedata.replace("editorder", "edit" + page.name.toLowerCase());
                    var textindex = sails._.findIndex(page.structure, function (rindex) {
                        return rindex.type == 'text';
                    })
                    filedata = filedata.replace("Artist", sails._.capitalize(page.structure[textindex].name));
                    filedata = filedata.replace("{{value.artist}}", "{{value." + page.structure[textindex].name.toLowerCase() + "}}");
                    makeviewpage.write(filedata);
                }
            })
        }
    });
}

function makesailsproj(data) {
    var mymodel = data.models;
    sails.exec("sails new " + baseurl, function (err, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
            _.each(data.models, function (n) {
                var makejsfile = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(n.name) + ".js");
                sails.fs.readFile('./readfiles/CreateOModel.txt', 'utf8', function (err, data) {
                    if (err) throw err;
                    var somedata = data.split("user").join(n.name.toLowerCase());
                    var index = _.findIndex(n.structure, function (chr) {
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
                sails.fs.readFile('./readfiles/CreateOController.txt', 'utf8', function (err, data) {
                    if (err) throw err;
                    var somecontdata = data.split("User.").join(sails._.capitalize(n.name) + ".");
                    makecontrolfile.write(somecontdata);
                });
                if (n.structure) {
                    _.each(n.structure, function (m) {
                        if (m.type == "array") {
                            var makearraymodel = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(m.name) + ".js");
                            sails.fs.readFile('./readfiles/CreateOArrayModel.txt', 'utf8', function (err, data) {
                                if (err) throw err;
                                var somedata = data.split("user").join(n.name.toLowerCase());
                                somedata = somedata.split("feed").join(m.name.toLowerCase());
                                var index = _.findIndex(m.structure, function (chr) {
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
                            sails.fs.readFile('./readfiles/CreateOArrayController.txt', 'utf8', function (err, data) {
                                if (err) throw err;
                                var somecontdata = data.split("Feed.").join(sails._.capitalize(m.name) + ".");
                                makearraycontrol.write(somecontdata);
                            });
                            _.each(m.structure, function (l) {
                                if ((l.type == "select" && l.isfromdb == "true") || l.type == "uiselect") {
                                    var nameindex = _.findIndex(mymodel, function (chr) {
                                        return chr.name == l.api;
                                    });
                                    if (nameindex == -1) {
                                        var makejsfile = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(l.api) + ".js");
                                        sails.fs.readFile('./readfiles/CreateOUiSelectmodel.txt', 'utf8', function (err, data) {
                                            if (err) throw err;
                                            var somedata = data.split("theme").join(l.api.toLowerCase());
                                            makejsfile.write(somedata);
                                        });
                                        var makecontrolfile = sails.fs.createWriteStream(baseurl + "/api/controllers/" + sails._.capitalize(l.api) + "Controller.js");
                                        sails.fs.readFile('./readfiles/CreateOUiselectcontroller.txt', 'utf8', function (err, data) {
                                            if (err) throw err;
                                            var somecontdata = data.split("Theme.").join(sails._.capitalize(l.api) + ".");
                                            makecontrolfile.write(somecontdata);
                                        });
                                    }
                                }
                            });
                        } else if ((m.type == "select" && m.isfromdb == "true") || m.type == "uiselect") {
                            var nameindex = _.findIndex(mymodel, function (chr) {
                                return chr.name == m.api;
                            });
                            if (nameindex == -1) {
                                var makejsfile = sails.fs.createWriteStream(baseurl + "/api/models/" + sails._.capitalize(m.api) + ".js");
                                sails.fs.readFile('./readfiles/CreateOUiSelectmodel.txt', 'utf8', function (err, data) {
                                    if (err) throw err;
                                    var somedata = data.split("theme").join(m.api.toLowerCase());
                                    makejsfile.write(somedata);
                                });
                                var makecontrolfile = sails.fs.createWriteStream(baseurl + "/api/controllers/" + sails._.capitalize(m.api) + "Controller.js");

                                sails.fs.readFile('./readfiles/CreateOUiselectcontroller.txt', 'utf8', function (err, data) {
                                    if (err) throw err;
                                    var somecontdata = data.split("Theme.").join(sails._.capitalize(m.api) + ".");
                                    makecontrolfile.write(somecontdata);
                                });
                            }
                        }
                    });
                }
            });
            var modelpath = baseurl + '/config/models.js';
            sails.fs.readFile(modelpath, 'utf8', function (err, data1) {
                var modeldata = data1.replace("// migrate", "migrate");
                modeldata = modeldata.replace("// connection: 'localDiskDb'", "connection: 'someMongodbServer'");
                var modelfile = sails.fs.createWriteStream(modelpath);
                modelfile.write(modeldata);
            });
            var connpath = baseurl + '/config/connections.js';
            sails.fs.readFile(connpath, 'utf8', function (err, data2) {
                var conndata = data2.replace("// database: 'your_mongo_db_name_here'", "database: '" + data.projectname.toLowerCase() + "'");
                var connfile = sails.fs.createWriteStream(connpath);
                connfile.write(conndata);
            });
            var bootpath = baseurl + '/config/bootstrap.js';
            sails.fs.readFile('./readfiles/CreateObootstrap.txt', 'utf8', function (err, data3) {
                var bootdata = data3.replace("27017/auraart", "27017/" + data.projectname.toLowerCase());
                var bootfile = sails.fs.createWriteStream(bootpath);
                bootfile.write(bootdata);
            });
            var corspath = baseurl + '/config/cors.js';
            sails.fs.readFile('./readfiles/CreateOcors.txt', 'utf8', function (err, data5) {
                var corsfile = sails.fs.createWriteStream(corspath);
                corsfile.write(data5);
            });
            var uploadpath = baseurl + '/api/controllers/UploadfileController.js';
            sails.fs.readFile('./readfiles/CreateOUpload.txt', 'utf8', function (err, data3) {
                var bootfile = sails.fs.createWriteStream(uploadpath);
                bootfile.write(data3);
            });
            var jsonpath = baseurl + '/package.json';
            sails.fs.readFile('./readfiles/CreateOPackage.txt', 'utf8', function (err, data4) {
                console.log(data4);
                var jsondata = data4.split("CreateONode").join(projname);
                var jsonfile = sails.fs.createWriteStream(jsonpath);
                jsonfile.write(jsondata);
            });
        }
    });
}