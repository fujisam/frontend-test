/*global Fazenda, Backbone*/


fazenda.Collections = fazenda.Collections || {};

(function () {
  'use strict';

  fazenda.Collections.Module = Backbone.Collection.extend({
    initialize: function (model) {
    },
    parse: function (response) {
      return response;
    },

    calcPercentageVote: function (totalNegatives, totalPositives) {
      var iTotalNegatives = parseInt((totalNegatives) ? totalNegatives : 0),
        iTotalPositives = parseInt((totalPositives) ? totalPositives : 0),

        totalVotes = iTotalNegatives + iTotalPositives,
        negativePercentage = Math.round((iTotalNegatives * 100) / totalVotes),
        positivePercentage = Math.round((iTotalPositives * 100) / totalVotes);

      if (isNaN(negativePercentage)) {
        negativePercentage = 0
      }
      if (isNaN(positivePercentage)) {
        positivePercentage = 0
      }

      //ajustes nos valores porcentuais, caso ocorra uma aproximação errada com o 'round' - geralmente ocorre com números decimais!!!
      var totalPercentage = negativePercentage + positivePercentage;
      if (totalPercentage > 100) {
        var overMath = totalPercentage - 100;
        (positivePercentage > 100 ) ? (positivePercentage = positivePercentage - overMath) : (negativePercentage = negativePercentage - overMath);
      }
      if ((totalPercentage < 100) && (totalPercentage > 0)) {
        var downMath = 100 - totalPercentage;
        (positivePercentage == 0) ? (positivePercentage = positivePercentage + downMath) : (negativePercentage = negativePercentage + downMath);
      }
      return [negativePercentage + "%", positivePercentage + "%"];
    },

    percentagesVote: function (obj) {
      for (var i = 0, len = obj.length; i < len; i++) {
        obj[i]["negative_percentage"] = (this.calcPercentageVote(obj[i].negative, obj[i].positive))[0];
        obj[i]["positive_percentage"] = (this.calcPercentageVote(obj[i].negative, obj[i].positive))[1];
      }
      return obj;
    },

    reorderJson: function (obj, context) {
      var result = _.sortBy(obj, context).reverse();
      return result;
    },

    participantsJson: function (obj) {
      var percentagesVote, reorderJson;
      percentagesVote = this.percentagesVote(obj);
      reorderJson = this.reorderJson(percentagesVote, 'positive_percentage');

      return reorderJson;
    }

  });

})();


