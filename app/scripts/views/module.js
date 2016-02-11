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


