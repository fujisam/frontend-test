/*global fazenda, $*/
window.fazenda = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  init: function () {
    'use strict';

    this.collections = new fazenda.Collections.Module();
    this.model = new fazenda.Models.Module();
    this.view = new fazenda.Views.Module();

    this.model.fetch({
      success: function (collection, response) {
        fazenda.participants(response.data);
        fazenda.popOvers();
      },
      error: function (collection, response) {
        console.log('erro ao carregar o JSON!!!');
      }
    });
  },

  participants: function (obj) {
    var participantsJson = fazenda.collections.participantsJson(obj);
    fazenda.view.participants(participantsJson);
  },

  popOvers: function () {
    fazenda.view.popOvers();
  }
};

$(document).ready(function () {
  'use strict';
  fazenda.init();
});

