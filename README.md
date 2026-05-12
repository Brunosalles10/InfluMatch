# InfluMatch

## Descrição do Projeto

O InfluMatch é um sistema desenvolvido como parte do Trabalho de Conclusão de Curso (TCC), com o objetivo de auxiliar empresas e gestores de marketing na análise de influenciadores digitais.

A proposta do projeto é centralizar informações de influenciadores, permitindo o cadastro, organização e análise de métricas importantes como seguidores, curtidas, comentários e engajamento.

Com o sistema, será possível identificar quais influenciadores apresentam melhor desempenho, facilitando a tomada de decisão em campanhas de marketing digital.

---

# Objetivo do Projeto

O principal objetivo do InfluMatch é permitir o gerenciamento e análise de influenciadores digitais de forma organizada e eficiente.

O sistema busca transformar dados em informações estratégicas para auxiliar empresas na escolha de influenciadores para campanhas de marketing.

---

# Funcionalidade Principal

A funcionalidade principal do sistema será o gerenciamento de usuários e influenciadores digitais.

O usuário poderá:

- realizar login no sistema;
- cadastrar influenciadores;
- armazenar métricas;
- visualizar informações e análises de desempenho;
- acompanhar métricas de engajamento.

---

# Regra de Negócio Principal

A principal regra de negócio do sistema é permitir o gerenciamento e análise dos dados dos influenciadores digitais de forma organizada.

O sistema será responsável por:

- validar usuários;
- armazenar informações;
- calcular métricas de engajamento;
- exibir análises para apoio na tomada de decisão.

---

# Fluxo da Regra de Negócio

Fluxo principal da funcionalidade:

1. O usuário acessa o sistema.
2. O usuário realiza login ou cadastro.
3. O sistema valida os dados.
4. Caso os dados estejam incorretos, o sistema exibe erro.
5. Caso estejam corretos, o usuário acessa o sistema.
6. O sistema salva os dados no banco.
7. O usuário poderá visualizar informações e métricas.

---

# Fluxo no Draw.io

O fluxo da funcionalidade principal será desenvolvido utilizando Draw.io.

Os arquivos ficarão armazenados na pasta:

```bash
docs/
```

Arquivos:

```bash
docs/fluxo-regra-negocio.drawio
docs/fluxo-regra-negocio.png
```

---

# Stack de Desenvolvimento

## Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication

O backend será responsável pelas regras de negócio, autenticação, validações e integração com banco de dados.

---

## Banco de Dados

- MySQL

O banco de dados será utilizado para armazenar informações dos usuários e futuramente dados relacionados aos influenciadores digitais.

---

## Ferramentas Utilizadas

- Visual Studio Code
- Git
- GitHub
- Draw.io
- DBeaver
- Postman / Insomnia

---

# Arquitetura Utilizada

O projeto utilizará arquitetura monolítica modular.

Essa arquitetura foi escolhida porque o sistema ainda está em fase inicial e possui uma estrutura simples, permitindo maior organização e facilidade de manutenção.

Mesmo sendo monolítica, a aplicação será organizada em módulos separados por responsabilidade, melhorando a escalabilidade e manutenção do projeto.

---

# Estrutura Inicial do Projeto

```bash
InfluMatch/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── prisma/
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── fluxo-regra-negocio.drawio
│   └── fluxo-regra-negocio.png
│
└── README.md
```

---

# Organização das Pastas

## Backend

A pasta backend será responsável pela API do sistema.

### Prisma

Responsável pela configuração do banco de dados e migrations.

### Users

Responsável pelo gerenciamento de usuários.

### DTO

Responsável pela transferência e validação dos dados.

### Test

Responsável pelos testes do sistema.

---

## Docs

A pasta docs será utilizada para armazenar os arquivos de documentação e o fluxo desenvolvido no Draw.io.

---

# Banco de Dados

O banco de dados será desenvolvido em MySQL utilizando Prisma ORM.

Atualmente, o projeto possui a entidade User, responsável pelo gerenciamento dos usuários do sistema.

Estrutura atual da entidade:

- id
- name
- email
- senha
- role
- ativo
- createdAt
- updatedAt

Exemplo da modelagem atual:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  senha     String
  role      String   @default("USER")
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Futuramente, novas entidades serão adicionadas para gerenciamento de influenciadores, métricas e análises de engajamento.

---

# Protótipo Estrutural

Nesta etapa, não será desenvolvido código funcional completo.

O objetivo é criar:

- estrutura inicial do projeto;
- organização das pastas;
- documentação;
- arquitetura;
- modelagem inicial do banco de dados;
- fluxo da regra de negócio.

---

# Microserviços

Neste momento, o projeto não utilizará microserviços.

A escolha pela arquitetura monolítica modular foi feita para reduzir complexidade e facilitar o desenvolvimento inicial do TCC.

Futuramente, o sistema poderá ser separado em serviços independentes caso exista necessidade.

---

# Status do Projeto

Projeto em fase inicial de desenvolvimento.

Nesta etapa foram definidos:

- arquitetura do sistema;
- stack de desenvolvimento;
- estrutura inicial;
- documentação;
- modelagem inicial do banco de dados;
- fluxo da regra de negócio;
- organização do backend.

---

# Repositório

O projeto está disponível em repositório público no GitHub.

```bash
https://github.com/Mariana-Salmaza/InfluMatch
```
