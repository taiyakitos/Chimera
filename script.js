
        function proximaPagina() {
            // 1. Pega o endereço atual do navegador
            let urlAtual = window.location.href;

            // 2. Remove barras no final da URL para não quebrar o código (ex: /1/ vira /1)
            if (urlAtual.endsWith('/')) {
                urlAtual = urlAtual.slice(0, -1);
            }

            // 3. Pega tudo que está depois da última barra '/'
            let partesUrl = urlAtual.split('/');
            let ultimoSegmento = partesUrl[partesUrl.length - 1];

            // 4. Converte o texto em número inteiro
            let numeroAtual = parseInt(ultimoSegmento, 10);

            // 5. Verifica se o final é realmente um número válido
            if (!isNaN(numeroAtual)) {
                // Soma 1 ao número atual
                let proximoNumero = numeroAtual + 1;
                
                // Substitui o número antigo pelo novo no final da URL
                partesUrl[partesUrl.length - 1] = proximoNumero;
                let novaUrl = partesUrl.join('/');

                // Redireciona o navegador para o novo endereço
                window.location.href = novaUrl;
            } else {
                // Mensagem de aviso caso a URL não termine em número
                alert("O final da URL atual não é um número! Exemplo esperado: https://sitelink/1");
            }
        }
  
