# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# TechFood

## Integrantes: <a href="/www.linkedin.com/in/fabrizzio-puttini">Fabrizzio Puttini </a>, <a href="https://www.linkedin.com/in/julia-valério/">Julia Valério</a>, <a href="https://www.linkedin.com/in/lr-s/">Luiz Silvestre</a>, <a href="https://www.linkedin.com/in/guilherme-belcastro-medeiros-785598281/">Guilherme Belcastro </a>,<a href="https://www.linkedin.com/in/kaike-cavalcante-7283a0266/"> Kaike Cavalcante</a> 

## Professores Orientadores: <a href="https://www.linkedin.com/in/francisco-escobar/">Francisco Escobar</a>, <a href="https://www.linkedin.com/in/cristina-machado-corr%C3%AAa-leite-630309160/">Cristina Machado Corrêa Leite</a>, <a href="https://www.linkedin.com/in/katia-bossi/">Katia Milani Lara Bossi</a>, <a href="https://www.linkedin.com/in/jesuslisboagomes/">Jésus Gomes</a>, <a href="https://www.linkedin.com/in/dolemes/">David de Oliveira Lemes</a>

## Descrição

Projeto de Marketplace para empresa **Mr. Nuts** feito pelos membros da **TechFood**, desenvolvida com **Node.js + Express + MySQL**. O projeto foca na negociação de produtos entre usuários (compradores e fornecedores), anúncios de produtos, categorias e avaliações. Além de contar com uma área para Usuários Administradores realizarem a filtragem de quais produtos poderão ser anunciados.

## Dados do .ENV
<br><br>
DB_HOST=localhost<br>
DB_USER=root<br>
DB_PASSWORD=<br>
DB_DATABASE=techfood<br>
DB_PORT=3306<br>

## 🛠 Estrutura de pastas

<pre>
|-- Raiz (Projeto1/)
|-- 📂 Documentos
│   ├── � Entrega 1
│   │   ├── Cálculo II
│   │   ├── Desenvolvimento Web Full Stack
│   │     |-- 📂 Backend
│   │         ├── 📂 src
│   │         ├── 📄 db.js (conexão com o banco de dados)
│   │         └── 📄 server.js (servidor Express + rotas CRUD)
│   ├── � .env.example (variáveis de ambiente - modelo)
│   ├── 📄 package.json
│   └── 📄 package-lock.json
│   │   ├── Gestão Empresarial
│   │   ├── Projeto Web Interdisciplinar
│   │   └── Projeto em Banco de Dados
│   │       |-- 📂 banco de dados
│   │           ├── 📄 BD projeto.sql (script de criação do banco e tabelas)
│   │           ├── 📄 DER TechFood.mwb (modelo do banco - MySQL Workbench)
│   │           └── 📄 DER TechFood.mwb.bak (backup do modelo)
│   └── 📂 Entrega 2
│       ├── Cálculo II
│       ├── Desenvolvimento Web Full Stack
│       ├── Gestão Empresarial
│       ├── Projeto Web Interdisciplinar
│       └── Projeto em Banco de Dados
│
|-- 📄 .gitignore
|-- 📄 README.md (Este arquivo)
</pre>

### 📝 Descrição das Pastas:

- **`Backend/`**: Código-fonte da API REST (Node.js + Express).
- **`Backend/src/`**: Arquivos principais do servidor — conexão com o banco (`db.js`) e rotas CRUD (`server.js`).
- **`banco de dados/`**: Script SQL de criação do banco e tabelas, além do modelo DER (MySQL Workbench).
- **`Documentos/`**: Documentação do projeto, organizada por entregas e disciplinas.

## Informações sobre o MySQL

Nosso banco de dados conta com uma tabela principal que é a tabela de **usuários**, as tabelas de **administradores, fornecedores e clientes** tem conexão direta com a tabela usuário, servindo para definir qual será o tipo de usuário na tabela. Além disso tem as tabelas **anuncio e categoriaProduto**, fazem ligação direta com a tabela **fornecedor**, elas servem para guardar os anúncios feitos pelos fornecedores com todos os dados de cada um. Nosso banco também conta om uma tabela avaliação que será responsável por armazenar as notas que os clientes dão aos produtos dos anúncios. 

## Detalhamento do Projeto

O projeto foi realizado de forma com que enaltecesse todos e ajudasse a se desenvolver<br><br>
**`Fabrizzio Puttini`**: Criação do protótipo do site no Figma, finalização do Banco de Dados e do DER no MySQL;<br>
**`Guilherme Belcastro`**: Criação da base do DER do Banco de Dados junto à Julia e exerceu uma função de corretor nas documentações do projeto;<br>
**`Luiz Silvestre`**: Criação do Backend do Projeto - CRUD;<br>
**`Julia Valério`**: Criação da base do DER do Banco de Dados junto ao Guilherme e criação da documentação de Gestão Empresarial;<br>
**`Kaike Santos`**: Criação do Backlog e documentação à respeito do projeto, além da documentação de Cálculo II;<br>

## 💻 Configuração para Desenvolvimento

### Pré-requisitos

- <a href="https://nodejs.org/">Node.js</a> (v18 ou superior)
- <a href="https://dev.mysql.com/downloads/installer/">MySQL Server</a> (v8.0 ou superior)
- <a href="https://www.postman.com/downloads/">Postman</a> (para testar as rotas)

### Instalação

1. Clone o repositório:

```sh
git clone https://github.com/2025-2-MCC1/Projeto1/
```

2. Crie o banco de dados no MySQL executando o script:

```sh
banco de dados/BD projeto.sql
```

3. Acesse a pasta do Backend e instale as dependências:

```sh
cd Backend
npm install
```

4. Crie o arquivo `.env` baseado no `.env.example`:

```sh
cp .env.example .env
```

5. Edite o `.env` com suas credenciais do MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=techfood
DB_PORT=3306
```

6. Inicie o servidor:

```sh
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

## � Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/usuarios` | Criar um novo usuário |
| `GET` | `/usuarios` | Listar todos os usuários |
| `GET` | `/usuarios/:id` | Buscar usuário por ID |
| `PUT` | `/usuarios/:id` | Atualizar usuário por ID |
| `DELETE` | `/usuarios/:id` | Deletar usuário por ID |

### Exemplo de Body (POST/PUT):

```json
{
  "tipoUsuario": 1,
  "nomeUsuario": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "contato": "11999999999"
}
```

## 🗄 Banco de Dados

O banco **techfood** possui as seguintes tabelas:

- **`usuario`** — Dados base de todos os usuários
- **`administrador`** — Extensão para admins
- **`comprador`** — Extensão para compradores (CPF, CEP)
- **`fornecedor`** — Extensão para fornecedores (CNPJ, nome fantasia)
- **`categoriaProduto`** — Categorias dos produtos
- **`anuncio`** — Anúncios de produtos dos fornecedores
- **`avaliacao`** — Avaliações dos compradores sobre anúncios

---
## 📋 Licença/License

<p xmlns:cc="http://creativecommons.org/ns#" >Este trabalho está licenciado sob <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer">CC BY 4.0</a></p>

## 🎓 Referências

1. <https://github.com/iuricode/readme-template>
2. <https://github.com/gabrieldejesus/readme-model>
3. <https://chooser-beta.creativecommons.org/>
4. <https://www.toptal.com/developers/gitignore>
5. <https://expressjs.com/>
6. <https://www.npmjs.com/package/mysql2>
