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


this["JST"] = this["JST"] || {};

this["JST"]["app/scripts/templates/module.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p>Your content here.</p>\n\n';

}
return __p
};
/*global Fazenda, Backbone*/


fazenda.Routers = fazenda.Routers || {};

(function () {
  'use strict';

  fazenda.Routers.Module = Backbone.Router.extend({});

})();



/*global Fazenda, Backbone, JST*/
fazenda.Views = fazenda.Views || {};

(function () {
  'use strict';


  fazenda.Views.Module = Backbone.View.extend({

    popoverTemplate: [
      '   <div class="popover">                          ',
      '   <div class="arrow"></div>                      ',
      '   <div class="popover-content">                  ',
      '   </div>                                         ',
      '   </div>                                         '
    ].join(''),

    popoverContent: [
      '   <div>                                         ',
      '     <table class="table">                       ',
      '       <tr>                                      ',
      '         <th>Gostam</th><th>Não gostam</th>      ',
      '      </tr>                                      ',
      '      <tr>                                       ',
      '        <td class="positive-votes">&nbsp;</td>   ',
      '        <td class="negative-votes">&nbsp;</td>   ',
      '      </tr>                                      ',
      '    </table>                                     ',
      '  </div>                                         ',
    ].join(''),

    el: $('body'),
    elParticipants: $('#participants'),
    elPopover: $('.ranking-content .content'),

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.render();

    },
    render: function () {
      //this.$el.html(this.template(this.model.toJSON()));
      //$(this.el).append("<span> + BackboneView!!!</span>");

    },
    participants: function (obj) {
      var
        jsonParticipants = obj,
        viewHtml = '',
        viewHtmlTmp = '',
        rankingPositionIndex;

      for (var i in jsonParticipants) {
        for (var j in jsonParticipants[i]) {
          viewHtmlTmp = '';
          rankingPositionIndex = parseInt(i) + 1;

          viewHtmlTmp += '<div class="row">';
          viewHtmlTmp += ' <dl class=participant-" + rankingPositionIndex + " rel="popover" ';
          viewHtmlTmp += '  data-positive-votes="' + jsonParticipants[i].positive_percentage + '" ';
          viewHtmlTmp += '  data-negative-votes="' + jsonParticipants[i].negative_percentage + '">';
          viewHtmlTmp += '   <dt>';
          viewHtmlTmp += '     <div class="participant-selfie" data-path-img="' + jsonParticipants[i].picture + '">';
          viewHtmlTmp += '     <em>' + rankingPositionIndex + '</em>';
          viewHtmlTmp += '     </div>';
          viewHtmlTmp += '   </dt>';
          viewHtmlTmp += '   <dd>' + jsonParticipants[i].name + '</dd>';
          viewHtmlTmp += '   <dd>' + jsonParticipants[i].description + '</dd>';
          viewHtmlTmp += ' </dl>';
          viewHtmlTmp += '</div>';
        }
        viewHtml += viewHtmlTmp;
      }
      this
        .elParticipants
        .empty()
        .append(viewHtml);

      $($('.participant-selfie')).each(function () {
        var cssAttrVal = 'transparent url("' + $(this).attr('data-path-img') + '") no-repeat 45% 50%';
        $(this)
          .css('background', cssAttrVal)
          .css('background-size', '150%');

      });

    },
    popOvers: function () {
      this.elPopover.popover({
        selector: '[rel=popover]',
        trigger: 'hover',
        content: this.popoverContent,
        template: this.popoverTemplate,
        placement: 'right',
        html: true
      }).parent()
        .delegate('dl', 'mouseover', function () {
          var
            dataPositiveText = $(this).attr('data-positive-votes'),
            dataNegativeText = $(this).attr('data-negative-votes');

          $(this)
            .parent()
            .find('tr td.positive-votes')
            .html(dataPositiveText);

          $(this)
            .parent()
            .find('tr td.negative-votes')
            .html(dataNegativeText);
        });

    }

  });

})();



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


