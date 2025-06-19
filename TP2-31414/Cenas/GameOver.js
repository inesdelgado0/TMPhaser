class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.sound.play('gameover', { volume: 0.5, loop: false });

        // Adicionar uma imagem de Game Over
        this.add.image(this.scale.width / 2 + 15, this.scale.height / 2 - 15, 'gameover')
            .setOrigin(0.5)
            .setScale(0.5);

        // Opcional: Adicionar um texto abaixo da imagem
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 85,
            'Não conseguiste recuperar todos os gatos',
            {
                fontSize: '18px',
                fontFamily: 'monospace',
                color: '#cccccc'
            })
            .setOrigin(0.5);

        // Botão de voltar ao menu
        const menuButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 170,
            '▶ Voltar ao Menu',
            {
                fontSize: '18px',
                fontFamily: 'monospace',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 12, y: 8 },
                align: 'center'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuButton.setStyle({ backgroundColor: '#222222' }))
            .on('pointerout', () => menuButton.setStyle({ backgroundColor: '#000000' }))
            .on('pointerdown', () => {
                this.scene.get('UIScene').limparMensagem();
                this.sound.stopAll();
                this.scene.stop();
                this.scene.start('InicioJogo');
            });
    }
}