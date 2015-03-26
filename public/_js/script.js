var array_ordenado = [];
var ranking_fazenda = {
	'init':function(){
		this.buscaDados();
	},
	'insertHTML': function(fazendeiro){		
		var montHTML ='';
		
		for (var k = 0; k < fazendeiro.length; k++) {
			if( (k + 1) % 2 == 0){
				montHTML += '<li class="par">'; 
			}else{
				montHTML += '<li class="impar">';
			}

				montHTML += '<div class="midia">'+
								'<figure class="imagem_candidato">'+
									'<img class="foto_candidato" src='+fazendeiro[k].imagem+' alt="" width="88" height="68">'+
								'</figure>'+
							'</div>'+
							'<div class="posicao">'+(k + 1)+'</div>'+
							'<div class="info">'+
								'<span class="nome">'+fazendeiro[k].nome+'</span><br>'+
								'<span class="dados">'+fazendeiro[k].descricao+'</span>'+
							'</div>'+
							'<div class="votacao">'+
								'<ul>'+
									'<li class="esquerda">'+
										'<div class="aceitacao">Gostam</div>'+
										'<div class="porcentagem">'+fazendeiro[k].gostam+'<span>%</span></div>'+
									'</li>'+
									'<li class="direita">'+
										'<div class="aceitacao">Não Gostam</div>'+
										'<div class="porcentagem">'+fazendeiro[k].naogosta+'<span>%</span></div>'+
									'</li>'+
								'</ul>'+
							'</div>'+
						'</li>';	
		}
		$('.competidores ul').html(montHTML);
	},
	recuperaMaiorValor: function( p_array ){		
		var valor = 0,
			pos   = 0;
		//
		valor = Math.max.apply(null, p_array);
		pos = $.inArray(valor, p_array);
		//
		p_array.splice(pos,1);
		//
		array_ordenado.push( valor );
		//
		if( p_array.length > 0 )
			this.recuperaMaiorValor( p_array );
		
	},
	'novoOrdenaDados': function(fazendeiros){
		var total 				= fazendeiros.length,
			array_fazendeiros	= [],
			array_fazendeiros_ordenado = [];

		for ( var i = 0; i < total; i+=1 ) {			
			array_fazendeiros.push( fazendeiros[i].total );
		}

		ranking_fazenda.recuperaMaiorValor( array_fazendeiros );
		
		for ( var j = 0; j < array_ordenado.length; j+=1 ) {
			for ( var i = 0; i < total; i+=1 ) {				
				if ( array_ordenado[j] == fazendeiros[i].total ) {
					var current = fazendeiros[i];				
					array_fazendeiros_ordenado.push(current);					
				}

			}
		}
		
		this.insertHTML( array_fazendeiros_ordenado );;
	},
	montandoMeuArray: function(conteudo){
		var dados = conteudo.data;
		var resultado;		
		montaArray = [];
		for (var k = 0; k < dados.length; k++) {
			
			objFazendeiro = {
			 	'nome': '',
			 	'imagem': '',
			 	'descricao': '',
			 	'gostam': '',
			 	'naogosta': '',
			 	'total': ''
			 };

			 positivo  = Math.ceil(((parseInt(dados[k].positive) / (parseInt(dados[k].positive) + parseInt(dados[k].negative))) * 100));
			 negativo  = Math.ceil(((parseInt(dados[k].negative) / (parseInt(dados[k].positive) + parseInt(dados[k].negative))) * 100)); 
			 resultado = Math.ceil(((parseInt(dados[k].positive) / (parseInt(dados[k].positive) + parseInt(dados[k].negative))) * 100));			 

			 objFazendeiro.nome = dados[k].name;
			 objFazendeiro.imagem = dados[k].picture;
			 objFazendeiro.descricao = dados[k].description;
			 objFazendeiro.gostam = positivo;
			 objFazendeiro.naogosta = negativo;

			 if(dados[k].positive == null){
			 	objFazendeiro.total = 0;
			 	objFazendeiro.gostam = 0;
				objFazendeiro.naogosta = 0;

			 }else{
			 	objFazendeiro.total = resultado;
			 }

			 montaArray[k] = objFazendeiro;			 
		}		 
		
		ranking_fazenda.novoOrdenaDados(montaArray);	 

	},
	'buscaDados': function(){
		$.ajax({
			url:'./fazenda.json',
			data: 'json',
			success:function(conteudo){				
				ranking_fazenda.montandoMeuArray(conteudo);
			}
		});
	}
};

ranking_fazenda.init();