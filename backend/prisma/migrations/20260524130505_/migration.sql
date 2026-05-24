-- CreateTable
CREATE TABLE `nichos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(80) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nichos_nome_key`(`nome`),
    UNIQUE INDEX `nichos_slug_key`(`slug`),
    INDEX `nichos_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `influenciadores` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `descricao` TEXT NULL,
    `imagem_url` VARCHAR(500) NULL,
    `nicho_id` VARCHAR(191) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    INDEX `influenciadores_nome_idx`(`nome`),
    INDEX `influenciadores_nicho_id_idx`(`nicho_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfis_sociais` (
    `id` VARCHAR(191) NOT NULL,
    `influenciador_id` VARCHAR(191) NOT NULL,
    `plataforma` ENUM('YOUTUBE', 'INSTAGRAM', 'TIKTOK') NOT NULL,
    `identificador_externo` VARCHAR(150) NOT NULL,
    `nome_usuario` VARCHAR(150) NOT NULL,
    `url_perfil` VARCHAR(500) NULL,
    `total_seguidores` BIGINT NOT NULL DEFAULT 0,
    `total_visualizacoes` BIGINT NOT NULL DEFAULT 0,
    `total_conteudos` INTEGER NOT NULL DEFAULT 0,
    `ultima_sincronizacao_em` DATETIME(3) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    INDEX `perfis_sociais_influenciador_id_idx`(`influenciador_id`),
    INDEX `perfis_sociais_plataforma_idx`(`plataforma`),
    INDEX `perfis_sociais_plataforma_total_seguidores_idx`(`plataforma`, `total_seguidores`),
    UNIQUE INDEX `perfis_sociais_plataforma_identificador_externo_key`(`plataforma`, `identificador_externo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conteudos` (
    `id` VARCHAR(191) NOT NULL,
    `perfil_social_id` VARCHAR(191) NOT NULL,
    `plataforma` ENUM('YOUTUBE', 'INSTAGRAM', 'TIKTOK') NOT NULL,
    `tipo_conteudo` ENUM('VIDEO', 'SHORT', 'POST', 'REEL') NOT NULL,
    `identificador_externo` VARCHAR(150) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `url_conteudo` VARCHAR(500) NULL,
    `url_thumbnail` VARCHAR(500) NULL,
    `total_views` BIGINT NOT NULL DEFAULT 0,
    `total_likes` BIGINT NOT NULL DEFAULT 0,
    `total_comentarios` BIGINT NOT NULL DEFAULT 0,
    `taxa_engajamento` DOUBLE NOT NULL DEFAULT 0,
    `publicado_em` DATETIME(3) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    INDEX `conteudos_perfil_social_id_idx`(`perfil_social_id`),
    INDEX `conteudos_plataforma_idx`(`plataforma`),
    INDEX `conteudos_tipo_conteudo_idx`(`tipo_conteudo`),
    INDEX `conteudos_plataforma_tipo_conteudo_idx`(`plataforma`, `tipo_conteudo`),
    INDEX `conteudos_taxa_engajamento_idx`(`taxa_engajamento`),
    INDEX `conteudos_total_views_idx`(`total_views`),
    INDEX `conteudos_publicado_em_idx`(`publicado_em`),
    UNIQUE INDEX `conteudos_plataforma_identificador_externo_key`(`plataforma`, `identificador_externo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `influenciadores` ADD CONSTRAINT `influenciadores_nicho_id_fkey` FOREIGN KEY (`nicho_id`) REFERENCES `nichos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfis_sociais` ADD CONSTRAINT `perfis_sociais_influenciador_id_fkey` FOREIGN KEY (`influenciador_id`) REFERENCES `influenciadores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conteudos` ADD CONSTRAINT `conteudos_perfil_social_id_fkey` FOREIGN KEY (`perfil_social_id`) REFERENCES `perfis_sociais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
