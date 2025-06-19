class UIScene extends Phaser.Scene {
    constructor() {
        super("UIScene");
    }
    create() {
        
        // Configura um evento local para mostrar mensagens na UI
        this.events.on('mostrarMensagem', this.mostrarMensagem, this);

        // A câmera da UI fica fixa (não se move com o mundo do jogo)
        this.cameras.main.setScroll(0, 0);
        
        // Inicializa variáveis para a mensagem temporária exibida na tela
        this.mensagemAtual = null;
        this.temporizadorMensagem = null;

        // Inicializa variáveis para o quadrado e ícone do gato
        this.gatoAtual = null;

        // Cria um gráfico para o quadrado que ficará atrás do ícone do gato
        this.quadradoGato = this.add.graphics()
            .setScrollFactor(0)
            .setDepth(1000);

        // Desenha o quadrado escuro arredondado para o gato
        this.quadradoGato.fillStyle(0x222222, 0.8);
        this.quadradoGato.fillRoundedRect(30, 53, 40, 40, 6); // x, y, w, h, radius

        // Cria o sprite do ícone do gato, inicialmente invisível
        this.iconeGatoAtual = this.add.sprite(51, 75, null)
            .setVisible(false)
            .setScrollFactor(0)
            .setScale(1.5)
            .setDepth(1001);
        
        // Cria fundo arredondado preto para o contador de entregas
        this.fundoContador = this.add.graphics()
            .fillStyle(0x000000, 0.6)
            .fillRoundedRect(595, 15, 120, 30, 10)
            .setScrollFactor(0)
            .setDepth(1000);

        // Cria o texto do contador de entregas com estilo personalizado
        this.contadorTexto = this.add.text(600, 20, 'Entregues: 0/4', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffffff',
            fontStyle: 'bold',
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
        })
        .setScrollFactor(0)
        .setDepth(1001);

        // Cria botão de menu no canto superior direito
        this.botaoMenu = this.add.image(760, 30, 'botao')
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .setDepth(1001)
            .setScale(0.3)
            .on('pointerdown', () => {
                this.scene.get('JogarJogo').sound.stopAll();
                this.scene.stop('JogarJogo');
                this.scene.stop();
                this.scene.start('InicioJogo');
            });
            


        // Quantidade máxima de vidas
        this.vidasMax = 3;
        this.vidas = [];

        // Posição inicial e espaçamento para os ícones de vida
        const vidaXInicial = 30;
        const vidaY = 30;
        const espacamento = 40;
        
        // Cria os ícones de vida e armazena-os no array this.vidas
        for (let i = 0; i < this.vidasMax; i++) {
            const vidaImg = this.add.image(vidaXInicial + i * espacamento, vidaY, 'vida')
                .setScrollFactor(0)
                .setDepth(1001)
                .setScale(0.2);
            this.vidas.push(vidaImg);
        }

        // Inicialmente mostra todas as vidas
        this.atualizarVidas(this.vidasMax);

        // Escuta evento da cena de jogo para atualizar o número de vidas exibidas
        this.scene.get('JogarJogo').events.on('vidasAtualizadas', this.atualizarVidas, this);

        // Emite evento informando que a UI está pronta para receber comandos
        this.scene.get('JogarJogo').events.emit('uiPronta');
    }

    // Retorna true se houver mensagem ativa na tela
    temMensagemAtiva() {
        return !!this.mensagemAtual;   
    }

    // Exibe uma mensagem temporária na tela
    mostrarMensagem(texto) {
    const larguraCaixa = 500;
    const alturaCaixa = 100;
    const x = this.scale.width / 2;
    const y = this.scale.height - 100;

     // Ignora se já está a mostrar exatamente a mesma mensagem
    if (this.mensagemAtual && this.mensagemAtual.texto === texto) {
        return;
    }

    // Cancela temporizador anterior (se houver)
    if (this.temporizadorMensagem) {
        this.temporizadorMensagem.remove(false);
        this.temporizadorMensagem = null;
    }

    // Remove imediatamente mensagem anterior para evitar sobreposição
    if (this.mensagemAtual) {
        this.mensagemAtual.destroy();
        this.mensagemAtual = null;
    }

    // Cria gráfico de fundo preto semi-transparente arredondado
    const fundo = this.add.graphics().setDepth(1000);
    fundo.fillStyle(0x000000, 0.85);
    fundo.fillRoundedRect(x - larguraCaixa / 2, y - alturaCaixa / 2, larguraCaixa, alturaCaixa, 20);
    fundo.setAlpha(0);

    // Cria texto da mensagem, centralizado, com sombra para melhor legibilidade
    const mensagem = this.add.text(x, y, texto, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: larguraCaixa - 30 },
        padding: { top: 10, bottom: 10 },
    }).setOrigin(0.5)
      .setDepth(1001)
      .setShadow(2, 2, '#000', 2, true, true)
      .setAlpha(0);

    // Container que agrupa fundo e texto para facilitar animações e remoção
    const caixa = this.add.container(0, 0, [fundo, mensagem]);
    caixa.texto = texto; // Guarda texto para evitar duplicidade

    this.mensagemAtual = caixa;

    // Anima fade-in para o fundo e texto
    this.tweens.add({
        targets: caixa.list,
        alpha: 1,
        duration: 300,
        ease: 'Power2'
    });

    // Define o tempo que a mensagem ficará visível
    const tempo = texto.length > 100 ? 4000 : 2000;

    // Cria temporizador para esconder a mensagem após o tempo
    this.temporizadorMensagem = this.time.delayedCall(tempo, () => {
        if (this.mensagemAtual === caixa) {
            this.tweens.add({
                targets: caixa.list,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    caixa.destroy();
                    this.mensagemAtual = null;
                    this.temporizadorMensagem = null;
                }
            });
        }
    });
}
     // Exibe o ícone do gato com o tipo informado (ex: 'siames', 'preto etc)
    mostrarGatoAtual(tipo) {
        this.iconeGatoAtual.setTexture(`gato_${tipo}`);
        this.iconeGatoAtual.setFrame(44);
        this.iconeGatoAtual.setVisible(true);
        this.quadradoGato.setVisible(true);
    }

    // Esconde o ícone do gato e o quadrado
    limparGatoAtual() {
        this.iconeGatoAtual.setVisible(false);
        this.quadradoGato.setVisible(false);
    }

    // Atualiza o texto do contador de entregas
    atualizarContador(qtd, total) {
        if (this.contadorTexto) {
            this.contadorTexto.setText(`Entregues: ${qtd}/${total}`);
        } else {
            console.warn('contadorTexto ainda não está definido!');
        }
    }

    // Atualiza a visualização das vidas na UI, mostrando somente a quantidade atual
    atualizarVidas(qtd) {
    for (let i = 0; i < this.vidasMax; i++) {
        this.vidas[i].setVisible(i < qtd);
    }
}

    limparMensagem() {
    if (this.temporizadorMensagem) {
        this.temporizadorMensagem.remove(false);
        this.temporizadorMensagem = null;
    }
    if (this.mensagemAtual) {
        this.mensagemAtual.destroy();
        this.mensagemAtual = null;
    }
}
}
