API de Universidades
Uma API RESTful desenvolvida com NestJS para consulta e gerenciamento de informações sobre universidades ao redor do mundo, incluindo funcionalidade para armazenar cotações com um sistema de cache.

Funcionalidades
Consultas de universidades com filtros por nome e país
Paginação de resultados
Armazenamento de cotações para universidades
Cache Redis para performance otimizada
Documentação automática com Swagger
Verificações de saúde para monitoramento
Integração contínua com Docker

📋 Requisitos
Node.js (v14 ou superior)
MongoDB (v4.4 ou superior)
Redis (v6 ou superior)
Docker e Docker Compose (opcional, para execução em contêineres)
⚙️ Configuração do Ambiente
Usando Docker (Recomendado)
Clone o repositório:

   git clone https://github.com/seu-usuario/university-api.git
   cd university-api
Crie um arquivo .env baseado no .env.example:

   cp .env.example .env
Inicie os contêineres:

   docker-compose up -d
A API estará disponível em: http://localhost:3000
A documentação Swagger estará em: http://localhost:3000/api/docs

Instalação Local
Clone o repositório:

   git clone https://github.com/seu-usuario/university-api.git
   cd university-api

Instale as dependências:

   npm install
Crie um arquivo .env baseado no .env.example:

   cp .env.example .env
Certifique-se de que MongoDB e Redis estão rodando localmente ou configure as variáveis de ambiente para apontar para as instâncias corretas.
Execute a aplicação:

   # Desenvolvimento
   npm run start:dev
   
   # Produção
   npm run build
   npm run start:prod
🧪 Testes

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
📊 Endpoints da API
Universidades
GET /universities - Listar universidades (com suporte para paginação e filtros)
GET /universities/:id - Obter detalhes de uma universidade
GET /universities/quotes/latest - Obter as cotações mais recentes
GET /universities/:id/quote - Obter a cotação de uma universidade específica
PUT /universities/:id/quote - Atualizar a cotação de uma universidade
Parâmetros de Consulta
name - Filtrar por nome da universidade
country - Filtrar por país
page - Número da página (padrão: 1)
limit - Itens por página (padrão: 20, máximo: 100)
Verificação de Saúde
GET /health - Verificar a saúde da aplicação e suas dependências
📈 Sistema de Cache
Esta API utiliza Redis para armazenar em cache:

A cotação mais recente de cada universidade
Uma lista das 10 cotações mais recentes de todas as universidades
O tempo padrão de expiração do cache é de 1 hora para cotações individuais e 24 horas para a lista de cotações recentes, configurável através da variável de ambiente CACHE_TTL.

🔄 Carregamento de Dados
Na primeira inicialização, a API automaticamente baixa e carrega dados sobre universidades de todo o mundo a partir da fonte oficial, criando um banco de dados pronto para uso.

🤝 Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

📜 Licença
MIT