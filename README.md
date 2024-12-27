# API de Reserva de Voos

## Visão Geral
Este projeto implementa uma API de Reserva de Voos utilizando Node.js, TypeScript e MySQL. A escolha do TypeScript garante segurança de tipos e uma melhor estrutura para as requisições e respostas da API. A aplicação segue os princípios da Clean Architecture, proporcionando uma clara separação de responsabilidades.

### Principais Funcionalidades:
- **Validação:** Uso do Zod para validação de dados, garantindo consistência e confiabilidade.
- **Interação com Banco de Dados:** Utilização do Knex.js para migrations e transações, com consultas SQL brutas conforme especificado pelo CTO.
- **Clean Architecture:** Organizada em camadas distintas: Rotas, Controladores, Serviços e Repositórios.
- **Segurança:** Regras de negócio aplicadas para validação na criação de voos e reservas.

---

## Estrutura do Projeto

- **Rotas:** Define as rotas da API e passa os dados para os controladores.
- **Controladores:** Lida com as requisições HTTP, valida os dados e os encaminha para os serviços.
- **Serviços:** Implementa a lógica de negócios e comunica-se com os repositórios.
- **Repositórios:** Interage com o banco de dados utilizando consultas SQL brutas.

---

## Instruções de Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Ambiente
Crie um arquivo `.env` com as variáveis de ambiente necessárias.

### 3. Criar Banco de Dados
Execute o seguinte comando para criar o banco de dados:
```bash
mysql -u root -p -e "CREATE DATABASE flights;"
```

### 4. Executar Migrations e Seeds
```bash
npx knex migrate:latest --knexfile src/knexfile.js
npx knex seed:run --knexfile src/knexfile.js
```

### 5. Iniciar o Servidor
```bash
npm start
```

---

## Endpoints da API

### **Criar um Voo**
Crie um voo enviando um payload JSON com a seguinte estrutura:
```json
{
  "flightNumber": "AAA456",
  "origin": "Crato",
  "destination": "Barbalha",
  "departureTime": "2024-12-20T10:00:00",
  "arrivalTime": "2024-12-20T11:30:00",
  "capacity": 100
}
```

**Regras de Validação:**
- A capacidade deve ser positiva.
- O horário de partida deve ser anterior ao de chegada.

---

### **Buscar Voos**
Busque voos fornecendo a origem, destino e data como parâmetros de consulta.

**Endpoint:**
```http
GET http://localhost:3000/flight/flights?origin=Crato&destination=Barbalha&date=2024-12-20
```

A resposta retornará todos os voos que correspondem aos critérios com assentos disponíveis.

---

### **Criar uma Reserva**
Crie uma reserva enviando o seguinte payload JSON:
```json
{
  "clientName": "Jonas Silva",
  "flightNumber": "AAA456",
  "reservationDate": "2024-12-15"
}
```

**Regras de Negócio:**
- O voo deve existir para o número de voo fornecido (`flightNumber`).
- A reserva só será criada se houver assentos disponíveis.
- Transações garantem que nenhuma reserva seja criada caso ocorra um erro durante o processo.
- Um PDF com as informações da Reserva é salvo na pasta downloads do projeto

---

### **Encontrar Reservas**
Encontre reservas pelo nome do cliente.

**Endpoint:**
```http
GET http://localhost:3000/reservation?name=Jonas%20Silva
```

**Observação:** Usar o nome do cliente para buscas pode levar a ambiguidades se vários usuários compartilharem o mesmo nome. Recomenda-se implementar identificadores únicos para os clientes no futuro.

---

## Destaques Técnicos

- **Validação com Zod:** Garante que os dados estejam nos tipos e formatos exigidos antes de interagir com o banco de dados.
- **Transações com Knex:** Assegura atomicidade na criação de reservas, mantendo a consistência do banco de dados.
- **Consultas SQL Brutas:** Atende às diretrizes da empresa ao evitar ORMs, proporcionando maior controle sobre as interações com o banco de dados.

---

## Melhorias Futuras

- Introduzir uma tabela `Users` para identificar clientes de forma única e evitar ambiguidades nas buscas de reservas.
- Implementar testes adicionais para cobrir casos extremos e melhorar a cobertura da lógica de negócios.
- Melhorar o tratamento de erros e a geração de logs para facilitar a depuração e o monitoramento.

