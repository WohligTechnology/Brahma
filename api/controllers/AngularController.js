/**
 * AngularController
 *
 * @description :: Server-side logic for managing Angulars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    cloneBlack: function (req, res) {
        Angular.cloneBlack(req.body, function (data) {
            res.json(data);
        })
    },
    addelements: function (req, res) {
        Angular.addelements(req.body, function (data) {
            res.json(data);
        })
    }
};