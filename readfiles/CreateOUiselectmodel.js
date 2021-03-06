module.exports = {
    save: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("theme").find({
                        "name": data.name
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            callback(data2);
                            db.close();
                        } else {
                            db.collection('theme').insert(data, function (err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (created) {
                                    callback({
                                        value: true,
                                        id: data._id
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: false,
                                        comment: "Not created"
                                    });
                                    db.close();
                                }
                            });
                        }
                    });
                } else {
                    var theme = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('theme').update({
                        _id: theme
                    }, {
                        $set: data
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            callback({
                                value: true,
                                comment: "Data already updated"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    findlimited: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                callbackfunc1();
                async.parallel([
                    function (callback) {
                        db.collection("theme").count({
                            name: {
                                '$regex': check
                            }
                        }, function (err, number) {
                            if (number && number != "") {
                                newreturns.total = number;
                                newreturns.totalpages = Math.ceil(number / data.pagesize);
                                callback(null, newreturns);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, null);
                            }
                        });
                    }

                    function (callback) {
                        db.collection("theme").find({
                            name: {
                                '$regex': check
                            }
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (found && found[0]) {
                                newreturns.data = found;
                                callback(null, newreturns);
                            } else {
                                callback(null, null);
                            }
                        });
                    }
                ], function (err, data3) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data3 && data3[0]) {
                        delete data3[0].password;
                        callback(newreturns);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        if (data.search && data.theme) {
            var returns = [];
            var exit = 0;
            var exitup = 1;
            var check = new RegExp(data.search, "i");

            function callback2(exit, exitup, data) {
                if (exit == exitup) {
                    callback(data);
                }
            }
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });

                }
                if (db) {
                    db.collection("theme").find({
                        name: {
                            '$regex': check
                        },
                    }).limit(10).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found != null) {
                            exit++;
                            if (data.theme.length != 0) {
                                var nedata;
                                nedata = _.remove(found, function (n) {
                                    var flag = false;
                                    _.each(data.theme, function (n1) {
                                        if (n1.name == n.name) {
                                            flag = true;
                                        }
                                    })
                                    return flag;
                                });
                            }
                            returns = returns.concat(found);
                            callback2(exit, exitup, returns);
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("theme").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var ctheme = db.collection('theme').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    }
};
