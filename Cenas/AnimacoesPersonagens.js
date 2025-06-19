class AnimacoesPersonagens extends Phaser.Scene {
    constructor() {
        super("Animacoes");
    }

    preload() {
        this.load.spritesheet('gato_siames', 'Assets/Siames.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('gato_cinza', 'Assets/Cinza.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('gato_tricolor', 'Assets/Calico.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('gato_castanho', 'Assets/Castanho.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('gato_preto', 'Assets/Preto.png', {
            frameWidth: 32,
            frameHeight: 32
        });


        this.load.spritesheet('player', 'Assets/Player.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('cao_parado', 'Assets/Cao_parado.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('cao_andar', 'Assets/Cao_andar.png', {
            frameWidth: 48,
            frameHeight: 48
        });

    }

    create() {
        this.anims.create({
            key: 'sentar_siames',
            frames: this.anims.generateFrameNumbers('gato_siames', { start: 44, end: 47 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'sentar_cinza',
            frames: this.anims.generateFrameNumbers('gato_cinza', { start: 44, end: 47 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'sentar_tricolor',
            frames: this.anims.generateFrameNumbers('gato_tricolor', { start: 44, end: 47 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'sentar_castanho',
            frames: this.anims.generateFrameNumbers('gato_castanho', { start: 44, end: 47 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'sentar_preto',
            frames: this.anims.generateFrameNumbers('gato_preto', { start: 44, end: 47 }),
            frameRate: 5,
            repeat: -1
        });
        
        // ANIMAÇÕES DO PLAYER

        // Parado
        this.anims.create({
            key: 'parado_baixo',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'parado_lado',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'parado_cima',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
            frameRate: 6,
            repeat: -1
        });

        // Andar player
        this.anims.create({
            key: 'andar_baixo',
            frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'andar_lado',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 29 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'andar_cima',
            frames: this.anims.generateFrameNumbers('player', { start: 30, end: 35 }),
            frameRate: 8,
            repeat: -1
        });

        //Animaçoes do cao

        this.anims.create({
            key: 'cao_parado',
            frames: this.anims.generateFrameNumbers('cao_parado', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'cao_andar',
            frames: this.anims.generateFrameNumbers('cao_andar', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });


        // Salta imediatamente para o MenuScene depois de preparar as animações
        this.scene.start("InicioJogo");
    }
}
