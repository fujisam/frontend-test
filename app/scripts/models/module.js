/*global Fazenda, Backbone*/


fazenda.Models = fazenda.Models || {};

(function () {
  'use strict';

  fazenda.Models.Module = Backbone.Model.extend({
    url: 'data/fazenda.json',
    initialize: function () {
    },
    defaults: {},
    validate: function (attrs, options) {
    },
    parse: function (response, options) {
      return response;
    }
  });
})();


