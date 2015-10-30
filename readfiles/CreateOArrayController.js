/**
 * FeedController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    feed();
                } else {
                    res.json({
                        value: "false",
                        comment: "Feed-id is incorrect"
                    });
                }
            } else {
                feed();
            }
        } else {
            res.json({
                value: "false",
                comment: "user-id is incorrect "
            });
        }

        function feed() {
            var print = function(data) {
                res.json(data);
            }
            Feed.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Feed.delete(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Feed-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "user-id is incorrect "
            });
        }
    },
    find: function(req, res) {
        if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
            function callback(data) {
                res.json(data);
            };
            Feed.find(req.body, callback);
        } else {
            res.json({
                value: "false",
                comment: "user-id is incorrect "
            });
        }
    },
    findone: function(req, res) {
        if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Feed.findone(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Feed-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "user-id is incorrect "
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Feed.findlimited(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "user-id is incorrect "
            });
        }
    }
};
