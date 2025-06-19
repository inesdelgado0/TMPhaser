class JogoScene extends Phaser.Scene {
    constructor() {
        super("JogarJogo");
    }

    create() {
        
        // Inicia a música de fundo
        this.musica = this.sound.add('musica_jogo', { loop: true, volume: 0.5 });
        this.musica.play();

        // Cria o mapa com a key 'mapa' e o tileset com a key 'tiles'
        const map = this.make.tilemap({ key: 'mapa' });
        const tileset = map.addTilesetImage('punyworld-overworld-tileset', 'tiles');

        // Camadas visuais do mapa, sem colisão para já
        map.createLayer('Chao', tileset, 0, 0); 
        const casasLayer = map.createLayer('Casas', tileset, 0, 0);
        const arvoresLayer = map.createLayer('Arvores', tileset, 0, 0);
        const riosMurosLayer = map.createLayer('RiosMuros', tileset, 0, 0);

        // Cria o sprite do jogador com física
        this.player = this.physics.add.sprite(10, 375, 'player', 0);
        this.player.setCollideWorldBounds(true);// não deixa sair da área do mundo
        this.player.anims.play('parado_baixo');

        // Ajusta a HITBOX do player
        this.player.setSize(8, 10); // largura, altura
        this.player.setOffset(11, 13); // deslocamento X e Y

        //Cria barreira topo invisível para limitar o mapa
        const barreiraTopo = this.add.rectangle(
            this.scale.width / 2, // centro da tela (horizontalmente)
            0,                    // y = 0 (topo do mundo)
            map.widthInPixels,    // largura total do mapa
            32,                   // altura da barreira 
            0xff0000,
            0                 
        );
        this.physics.add.existing(barreiraTopo, true); // corpo estático
        this.physics.add.collider(this.player, barreiraTopo); //colisao com o player


        // Criar objetos interativos (exemplo peixe, gatos,etc)
        this.objetosInterativos = [];

        // Criar sprite do peixe e zona interativa para captura
        this.peixe = this.physics.add.sprite(45, 580, 'peixe').setScale(0.05);

        const zonaPeixe = this.add.rectangle(
            this.peixe.x,
            this.peixe.y,
            this.peixe.width * this.peixe.scaleX, 
            this.peixe.height * this.peixe.scaleY,
            0x0000ff,
            0 
        );
        zonaPeixe.setStrokeStyle(1, 0xffff00);
        this.physics.add.existing(zonaPeixe, true);
        zonaPeixe.setVisible(false); 

        this.objetosInterativos.push({ tipo: "peixe", zona: zonaPeixe });


        // Criar o cao patrulha

        this.cao = this.physics.add.sprite(690, 550, 'cao_parado').setScale(0.7);
        this.cao.body.setSize(40, 30);      // largura, altura do corpo físico (rosa)
        this.cao.body.setOffset(8, 20);
        this.cao.setImmovable(true);
        this.cao.body.pushable = false;
        this.cao.anims.play('cao_parado');

        this.caoPatrulhaX1 = 700;  // limite esquerdo 
        this.caoPatrulhaX2 = 770;  // limite direito 
        this.caoDirecao = 1;       // 1 = coemça a andar pra direita, -1 = começa a andar pra esquerda
        this.caoVelocidade = 40;

        // // colisão entre player e cao, causa perda de vida
        this.physics.add.collider(this.player, this.cao, () => {
            this.perderVida();
        });


        //Cria os gatos
        this.gatos = {
            siames: this.physics.add.sprite(325, 45, 'gato_siames').setScale(1).play('sentar_siames'),
            tricolor: this.physics.add.sprite(750, 90, 'gato_tricolor').setScale(1).play('sentar_tricolor'),
            castanho: this.physics.add.sprite(300, 450, 'gato_castanho').setScale(1).play('sentar_castanho'),
            preto: this.physics.add.sprite(740, 495, 'gato_preto').setScale(1).play('sentar_preto')
        };

        // Ajusta hitbox de um gato
        this.gatos.siames.setSize(20, 15);   // define largura e altura menores para a caixa de colisão
        this.gatos.siames.setOffset(5, 15);  // ajusta o deslocamento da caixa dentro do sprite

        Object.values(this.gatos).forEach(gato => {
            gato.setImmovable(true);
            this.physics.add.collider(this.player, gato);
        });

        // Criar zonas de interação invisíveis para cada gato
        Object.entries(this.gatos).forEach(([tipo, gato]) => {
            const zona = this.add.rectangle(
                gato.x,
                gato.y,
                gato.width * gato.scaleX + 10,
                gato.height * gato.scaleY + 10,
                0x0000ff,
                0
            );
            zona.setStrokeStyle(1, 0xffff00);
            this.physics.add.existing(zona, true);
            zona.setVisible(false); // deixe visível para testar, depois coloque false

            this.objetosInterativos.push({
                tipo: `gato_${tipo}`,
                zona: zona
            });
        });

        // Ler objetos do mapa criado no tiled (tiles e objetos de interação)
        const objetos = map.getObjectLayer("Objeto").objects;

        objetos.forEach(obj => {
            const { x, y, width, height, properties } = obj;
            let tipo = "";

            if (properties) {
                const tipoProp = properties.find(p => p.name === "tipo");
                if (tipoProp) tipo = tipoProp.value;
            }

            const posX = x + width / 2;
            const posY = y + height / 2;

            // Zona de interação para a teclaE
            const zonaInteracao = this.add.rectangle(
                posX,
                posY,
                width + 6,
                height + 6,
                0x00ff00,
                0.15
            );
            zonaInteracao.setStrokeStyle(1, 0xffff00);
            this.physics.add.existing(zonaInteracao, true);
            zonaInteracao.setVisible(false);
            this.objetosInterativos.push({ tipo, zona: zonaInteracao });

            //Zona separada para bloqueio físico
            if (tipo.startsWith("bau_") || tipo === "placar") {
                const colisor = this.add.rectangle(posX, posY, width, height);
                this.physics.add.existing(colisor, true);
                this.physics.add.collider(this.player, colisor);
            }
        });


        const colisionGroup = this.criarColisoresDosTiles(map, tileset, [
            casasLayer,
            arvoresLayer,
            riosMurosLayer
        ]);
        this.physics.add.collider(this.player, colisionGroup);


        // Configurar camara e limites do mundo 
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;

        // Configurar teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Para QTE (quick time event)
        this.qteTeclas = {
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D')
        }


        //Estados iniciais de jogo
        this.gatoNaMochila = null;
        this.totalGatos = 4;
        this.gatosEntregues = 0;
        this.temPeixe = false;
        this.lives = 3;
        this.vidaPerdidaCooldown = false;
        
        this.qteAtiva = false;
        this.qteSequencia = [];
        this.qteIndex = 0;
        this.qteTipoGato = null;

        // Inicializa a cena de UI
        this.time.delayedCall(100, () => {
                    this.scene.launch('UIScene');
                    this.scene.get('UIScene').limparMensagem();
                    this.scene.bringToTop('UIScene'); //garante que a UI está visível
                });

        // Quando a UI estiver pronta, reseta contador e ícone
        this.events.once('uiPronta', () => {
            this.scene.get('UIScene').limparGatoAtual();
            this.scene.get('UIScene').atualizarContador(this.gatosEntregues, this.totalGatos);
        });
}

update() {

    if (this.qteAtiva)
    {
        const teclaEsperada = this.qteSequencia[this.qteIndex];
        const teclaPressionada = Phaser.Input.Keyboard.JustDown(this.qteTeclas[teclaEsperada]);

        if (teclaPressionada)
        {
            this.qteIndex++;
            if (this.qteIndex >= this.qteSequencia.length)
            {
                this.qteSucesso();
            }
        }
        else
        {
            const todasTeclas = ['A', 'S', 'D'].map(k =>
                Phaser.Input.Keyboard.JustDown(this.qteTeclas[k])
            );

            if (todasTeclas.some(p => p))
            {
                this.mostrarMensagem("Errou a sequência!");
                this.qteIndex = 0;
                this.perderVida();

                this.time.delayedCall(1000, () => {
                this.mostrarMensagem(`Tenta novamente: ${ this.qteSequencia.join(" ➜ ")}`);
            });
        }
    }

    return
    }

    const p = this.player;
    const t = this.cursors;

    const velocidadeNormal = 100;
    const velocidadeCorrida = 200;

    const velocidade = this.space.isDown ? velocidadeCorrida : velocidadeNormal;

    let vx = 0;
    let vy = 0;
    let novaAnim = null;

    if (t.left.isDown)
    {
        vx = -velocidade;
        p.setFlipX(true);
        novaAnim = 'andar_lado';
    }
    else if (t.right.isDown)
    {
        vx = velocidade;
        p.setFlipX(false);
        novaAnim = 'andar_lado';
    }
    else if (t.up.isDown)
    {
        vy = -velocidade;
        novaAnim = 'andar_cima';
    }
    else if (t.down.isDown)
    {
        vy = velocidade;
        novaAnim = 'andar_baixo';
    }

    p.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0)
    {
        if (p.anims.currentAnim?.key !== novaAnim)
        {
            p.anims.play(novaAnim, true);
        }
    }
    else
    {
        const animAtual = p.anims.currentAnim?.key;
        if (animAtual?.includes('baixo')) p.anims.play('parado_baixo', true);
        else if (animAtual?.includes('lado')) p.anims.play('parado_lado', true);
        else if (animAtual?.includes('cima')) p.anims.play('parado_cima', true);
    }

    this.cao.setVelocityX(this.caoVelocidade * this.caoDirecao);


    if (this.cao.x >= this.caoPatrulhaX2)
    {
        this.caoDirecao = -1;
        this.cao.setFlipX(true);
    }
    else if (this.cao.x <= this.caoPatrulhaX1)
    {
        this.caoDirecao = 1;
        this.cao.setFlipX(false);
    }


    // Animações do cão
    if (this.cao.body.velocity.x !== 0 || this.cao.body.velocity.y !== 0)
    {
        if (this.cao.anims.currentAnim?.key !== 'cao_andar')
        {
            this.cao.anims.play('cao_andar', true);
        }
    }
    else
    {
        if (this.cao.anims.currentAnim?.key !== 'cao_parado')
        {
            this.cao.anims.play('cao_parado', true);
        }
    }


    if (Phaser.Input.Keyboard.JustDown(this.teclaE))
    {
        const objProximo = this.objetosInterativos.find(obj =>
            this.physics.overlap(this.player, obj.zona)
        );

        if (objProximo && objProximo.tipo)
        {
            if (objProximo.tipo === "placar")
            {
                this.mostrarMensagem("📢 Perdidos e Achados\nOfereço recompensa a quem encontrar os meus gatos perdidos e colocar nos seus respetivos baús.");

            }

            else if (objProximo.tipo === "peixe")
            {
                if (!this.temPeixe)
                {
                    this.temPeixe = true;
                    this.mostrarMensagem("Apanhaste um peixe fresco do rio!");
                    objProximo.zona.destroy(); // Remove zona de interação
                    if (this.peixe) this.peixe.destroy(); // Remove sprite se existir
                }
            }



            else if (objProximo.tipo.startsWith("bau_"))
            {
                const tipo = objProximo.tipo.replace("bau_", "");

                if (this.gatoNaMochila === tipo)
                {
                    this.mostrarMensagem(`Colocaste o gato ${ tipo} no baú certo!`);
                    this.sound.play('entrega_sucesso', { volume: 0.3 });


                    this.gatoNaMochila = null;
                    this.gatosEntregues++;
                    this.scene.get('UIScene').limparGatoAtual();
                    this.scene.get('UIScene').atualizarContador(this.gatosEntregues, this.totalGatos);

                    if (this.gatosEntregues == this.totalGatos && !this.transicaoFinal)
                    {
                        this.transicaoFinal = true;

                        this.time.delayedCall(1000, () => {
                            this.cameras.main.fadeOut(1000, 0, 0, 0); // duração em ms, cor RGB (preto)

                            this.cameras.main.once('camerafadeoutcomplete', () => {
                                this.sound.stopAll(); // parar música
                                this.scene.stop('UIScene');       // Para a UI
                                this.scene.stop();                // Para a própria JogoScene
                                this.scene.start('CenaFinal');
                            });
                        });
                    }

                }
                else if (this.gatoNaMochila)
                {
                    this.mostrarMensagem(`Este baú não é para o gato ${ this.gatoNaMochila}.`);
                }
                else
                {
                    this.mostrarMensagem(`Este é o baú para o gato ${ tipo}.`);
                }
            }

            else if (objProximo.tipo.startsWith("gato_"))
            {
                const tipo = objProximo.tipo.replace("gato_", "");

                if (this.gatoNaMochila)
                {
                    this.mostrarMensagem(`Estás a carregar o gato ${ this.gatoNaMochila}. Leva - o até o baú correspondente.`);
                }
                else
                {

                    if (tipo === "castanho")
                    {
                        this.mostrarMensagem("*Fazes festas* O gato castanho deixa-se pegar.");
                    }

                    else if (tipo === "tricolor")
                    {
                        if (!this.temPeixe)
                        {
                            this.mostrarMensagem("Não deixa que pegues nele. Talvez haja algo que o convença.");
                            return;
                        }
                        else
                        {
                            this.temPeixe = false;
                            this.mostrarMensagem("O gato tricolor adora o peixe e deixa-se pegar!");
                        }
                    }

                    else if (tipo === "siames")
                    {
                        this.startQTEparaGato(tipo);
                        return; // espera o QTE antes de permitir pegar
                    }

                    else
                    {
                        this.mostrarMensagem(`Pegaste no gato ${ tipo}.`);
                    }

                    // Guarda o tipo e remove o sprite do gato
                    this.gatoNaMochila = tipo;
                    const gatoSprite = this.gatos[tipo];
                    if (gatoSprite)
                    {
                        gatoSprite.disableBody(true, true); // esconde e desativa fisicamente
                        delete this.gatos[tipo]; // remove da lista ativa
                        this.scene.get('UIScene').mostrarGatoAtual(tipo);
                    }
                }
            }
        }
    }
}

    mostrarMensagem(texto) {
        this.scene.get('UIScene').events.emit('mostrarMensagem', texto);
    }

    criarColisoresDosTiles(map, tileset, layers) {
        const grupo = this.physics.add.staticGroup();
        const tileData = tileset.tileData;

        layers.forEach(layer => {
            layer.forEachTile(tile => {
                const tileId = tile.index - tileset.firstgid;
                const data = tileData[tileId];
                if (!data || !data.objectgroup) return;

                data.objectgroup.objects.forEach(obj => {
                    const x = tile.pixelX + obj.x;
                    const y = tile.pixelY + obj.y;
                    const width = obj.width;
                    const height = obj.height;

                    const collider = this.add.rectangle(
                        x + width / 2,
                        y + height / 2,
                        width,
                        height,
                        0xff0000,
                        0 // visível para debug
                    );

                    this.physics.add.existing(collider, true);
                    grupo.add(collider);
                });
            });

            layer.setCollision(false); // desativa colisão 16x16 padrão
        });

        return grupo;
    }

    startQTEparaGato(tipo) {
        const opcoes = ['A', 'S', 'D'];
        const comprimento = 7; // muda para mais se quiseres mais longa

        this.qteSequencia = Array.from({ length: comprimento }, () =>
            Phaser.Utils.Array.GetRandom(opcoes)
            );

        this.qteIndex = 0;
        this.qteAtiva = true;
        this.qteTipoGato = tipo;

        this.mostrarMensagem(`Pressiona rapidamente: ${ this.qteSequencia.join(" ➜ ")}`);
    }

    qteSucesso() {
        this.qteAtiva = false;

        const tipo = this.qteTipoGato;

        this.mostrarMensagem(`Pegaste no gato ${ tipo}.`);
        this.scene.get('UIScene').limparMensagem();

        this.gatoNaMochila = tipo;

        const gato = this.gatos[tipo];
        if (gato)
        {
            gato.disableBody(true, true);
            delete this.gatos[tipo];
            this.scene.get('UIScene').mostrarGatoAtual(tipo);
        }

        this.qteTipoGato = null;
    }

    perderVida() {
        if (this.vidaPerdidaCooldown) return; // evita múltiplas perdas rápidas

        this.lives--;
        // Emitir evento para UIScene atualizar a vida visual
        this.events.emit('vidasAtualizadas', this.lives);

        this.sound.play('damage');
        this.vidaPerdidaCooldown = true;

        // Piscar o player para feedback visual
        this.tweens.add({
        targets: this.player,
                alpha: 0,
                yoyo: true,
                repeat: 5,
                duration: 100,
                onComplete: () => {
                    this.player.setAlpha(1);
                }
            });

        this.time.delayedCall(1000, () => {
            this.vidaPerdidaCooldown = false;
        });

        if (this.lives <= 0)
        {
            this.time.delayedCall(700, () => {
                this.sound.stopAll();
                this.scene.stop('UIScene');       // Para a UI
                this.scene.stop();                // Para a própria JogoScene
                this.scene.start('GameOver');     // Inicia a tela de fim de jogo
            });
        }
    }
}

