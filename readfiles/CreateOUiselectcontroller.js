/**
 * ThemeController
 *
 * @description :: Server-side logic for managing themes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                theme();
            } else {
                res.json({
                    value: "false",
                    comment: "Theme-id is incorrect"
                });
            }
        } else {
            theme();
        }

        function theme() {
            var print = function(data) {
                res.json(data);
            }
            Theme.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Theme.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Theme-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Theme.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Theme.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Theme-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "" && req.body.search) {
            function callback(data) {
                res.json(data);
            };
            Theme.findlimited(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
