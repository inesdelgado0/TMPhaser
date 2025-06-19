class MenuScene extends Phaser.Scene {
    constructor() {
        super("InicioJogo");
    }

    preload() {
        // Carregar fundo do menu
        this.load.image('fundo_menu', 'Assets/fundoMenu.png');

         // Carregar o mapa e o tileset para a proxima cena
        this.load.tilemapTiledJSON('mapa', 'Mapas/inicio.json');
        this.load.image('tiles', 'Mapas/punyworld-overworld-tileset.png');

        //carregar outra imagens
        this.load.image('peixe', 'Assets/peixe.png');
        this.load.image('vida', 'Assets/heart.png');
        this.load.image('botao', 'Assets/botao.png');
        this.load.image('gameover', 'Assets/GameOver.gif');
        this.load.image('help', 'Assets/help.png');
        this.load.image('trofeu', 'Assets/trofeu.png');
        this.load.image('estrela', 'Assets/estrela.png');

        //carregar musicas e sons
        this.load.audio('musica_fundo', 'Assets/MusicaMenu.mp3');
        this.load.audio('entrega_sucesso', 'Assets/entrega_sucesso.mp3');
        this.load.audio('musica_jogo', 'Assets/MusicaFundo.mp3');
        this.load.audio('vitoria', 'Assets/vitoria.mp3');
        this.load.audio('gameover', 'Assets/gameover.wav');
        this.load.audio("damage", 'Assets/damage.wav');
        
    }


    create() {
    
    const largura = this.scale.width;
    const altura = this.scale.height;

    // Colocamos um fundo no menu
    const fundo = this.add.image(0, 0, 'fundo_menu');
    fundo.setOrigin(0, 0);
    fundo.setDisplaySize(largura, altura);
    
    // Adicionar música de fundo
    this.musica = this.sound.add('musica_fundo', {
        volume: 0.3,
        loop: true
        });
    this.musica.play();

    // Título do jogo
    this.add.text(largura / 2, altura / 4 - 40, 'Catventure', {
        fontFamily: 'monospace',
        fontSize: '72px',
        fill: '0x000000',
        stroke: '#000',
        strokeThickness: 5
    }).setOrigin(0.5);

    // Gatos no menu
    this.criarGato(120, altura / 2 + 120, 'gato_siames', 'sentar_siames');
    this.criarGato(largura - 120, altura / 2 + 120, 'gato_preto', 'sentar_preto');

    // Botões

    this.criarBotaoAjuda(largura - 48, 48);
    this.criarBotaoComecar(largura / 2, altura / 2 + 30);
    this.criarBotaoSair(largura / 2, altura / 2 + 90);
    this.criarBotaoSom(48, 48);
}

    criarGato(x, y, sprite, anim) {
        const gato = this.add.sprite(x, y, sprite, 48)
        .setScale(8)
        .setOrigin(0.5)
        .play(anim);
        return gato;
    }

    criarBotaoAjuda(x, y) {
    const btnAjuda = this.add.image(x, y, 'help')
        .setOrigin(0.5)
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });

        btnAjuda.on('pointerover', () => btnAjuda.setTint(0xaaaaaa));
        btnAjuda.on('pointerout', () => btnAjuda.clearTint());
        btnAjuda.on('pointerdown', () => this.mostrarAjuda());
    }

    criarBotaoComecar(x, y) {

        const btnComecar = this.add.rectangle(x, y, 220, 48, 0x32CD32)
        .setStrokeStyle(3, 0x000000)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        const txtComecar = this.add.text(x, y, 'COMEÇAR JOGO', {
        fontFamily: 'Monospace',
        fontSize: '20px',
        color: '#000000'
        }).setOrigin(0.5);

        btnComecar.on('pointerover', () => btnComecar.setFillStyle(0x7CFC00));
        btnComecar.on('pointerout', () => btnComecar.setFillStyle(0x32CD32));
        btnComecar.on('pointerdown', () => {
        this.musica.stop();
        this.scene.start("JogarJogo");
        });
    }

    criarBotaoSair(x, y) {

        const btnSair = this.add.rectangle(x, y, 220, 48, 0x32CD32)
        .setStrokeStyle(3, 0x000000)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        const txtSair = this.add.text(x, y, 'SAIR', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#000000'
        }).setOrigin(0.5);

        btnSair.on('pointerover', () => btnSair.setFillStyle(0x7CFC00));
        btnSair.on('pointerout', () => btnSair.setFillStyle(0x32CD32));
        btnSair.on('pointerdown', () => {
        console.log("Sair clicado");
        // Pode redirecionar ou fechar a aplicação, se for desktop
        });
    }

    criarBotaoSom(x, y) {
        const btnSom = this.add.text(x, y, '🔊', {
        fontFamily: 'PressStart2P', // estilo 8-bit
        fontSize: '16px',
        color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setScale(2);

        btnSom.on('pointerdown', () => {
        const mudo = !this.sound.mute;
        this.sound.mute = mudo;
        btnSom.setText(mudo ? '🔇' : '🔊');
        });

        btnSom.on('pointerover', () => btnSom.setColor('#cccccc'));
        btnSom.on('pointerout', () => btnSom.setColor('#ffffff'));
    }

    mostrarAjuda() {

        if (this.ajudaContainer) {
            return;
        }

        this.ajudaContainer = this.add.container(this.scale.width / 2, 200);

        const fundo = this.add.rectangle(0, 0, 380, 200, 0x000000, 1).setOrigin(0.5);

        const titulo = this.add.text(0, -70, 'Instruções do Jogo', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
        align: 'center'
        }).setOrigin(0.5);

        const texto = this.add.text(-170, -40,
        '- O seu objetivo é encontrar todos os gatos perdidos pela aldeia.\n\n- Usar as setas para mover e Space para correr.\n\n- Tecla E para interagir com o mundo!\n\n- Teclas A,D e S para um minijogo.',
        {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: 340, useAdvancedWrap: true }
        }
        );

        const botaoFechar = this.add.text(165, -75, '✖', {
        fontSize: '18px',
        fontFamily: 'monospace',
        color: '#ff4444'
        }).setInteractive().setOrigin(0.5);

        botaoFechar.on('pointerdown', () => {
            this.ajudaContainer.destroy();
            this.ajudaContainer = null;  // libera para poder abrir de novo
        });

        this.ajudaContainer.add([fundo, titulo, texto, botaoFechar]);
    
    }
}