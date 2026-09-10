# GraphQL Taller 04 - CRUD de Usuarios con MySQL y Postman

## Descripción

Microservicio GraphQL para la gestión de usuarios con operaciones CRUD (Crear, Leer, Actualizar, Eliminar) utilizando Node.js con Express, GraphQL, MySQL como base de datos y Postman para pruebas de API.

## Tecnologías Utilizadas

- Node.js (LTS)
- Express.js
- GraphQL (express-graphql)
- MySQL 8
- Postman Desktop
- Nodemon

## Estructura del Proyecto

graphQL_taller04/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── graphql/
│   │   ├── schema.js
│   │   └── resolvers.js
│   └── index.js
├── evidencias/
├── .env
├── .env.example
├── .gitignore
├── database.sql
├── package.json
└── README.md

## Instalación y Configuración

### 1. Clonar o descargar el repositorio

git clone <url-del-repositorio>
cd graphQL_taller04

### 2. Instalar dependencias

npm install

### 3. Configurar variables de entorno

Crea un archivo .env basado en .env.example:

PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=graphql_db

### 4. Configurar la base de datos

Abre MySQL Workbench, conéctate con tus credenciales y ejecuta el script database.sql.

### 5. Ejecutar el servidor

Modo desarrollo (con nodemon):

npm run dev

Modo producción:

npm start

### 6. Verificar que el servidor está corriendo

Health Check:

http://localhost:4000/health

Respuesta esperada:

{
  "status": "ok",
  "service": "usuarios-graphql"
}

## Esquema GraphQL

### Tipos

type User {
    id: ID!
    name: String!
    email: String!
}

input UserInput {
    name: String!
    email: String!
}

type DeleteResult {
    success: Boolean!
    message: String!
}

### Queries

users - Lista todos los usuarios
user(id) - Busca usuario por ID

### Mutations

createUser(input) - Crea un nuevo usuario
updateUser(id, input) - Actualiza un usuario existente
deleteUser(id) - Elimina un usuario

## Pruebas en Postman

### Configuración de Postman

1. Crear una nueva colección: graphQL_taller04
2. Configurar variable de colección: baseUrl = http://localhost:4000
3. Crear petición POST a: {{baseUrl}}/graphql
4. Headers: Content-Type: application/json
5. Body: raw → JSON

### 1. Listar todos los usuarios (Query)

Request:

{
  "query": "query { users { id name email } }"
}

Response esperada:

{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Ana Torres",
        "email": "ana@example.com"
      },
      {
        "id": "2",
        "name": "Carlos Parra",
        "email": "carlos@example.com"
      }
    ]
  }
}

### 2. Buscar usuario por ID (Query)

Request:

{
  "query": "query ($id: ID!) { user(id: $id) { id name email } }",
  "variables": {
    "id": "1"
  }
}

Response esperada:

{
  "data": {
    "user": {
      "id": "1",
      "name": "Ana Torres",
      "email": "ana@example.com"
    }
  }
}

### 3. Crear un nuevo usuario (Mutation)

Request:

{
  "query": "mutation ($input: UserInput!) { createUser(input: $input) { id name email } }",
  "variables": {
    "input": {
      "name": "Pedro Ramírez",
      "email": "pedro@example.com"
    }
  }
}

Response esperada:

{
  "data": {
    "createUser": {
      "id": "3",
      "name": "Pedro Ramírez",
      "email": "pedro@example.com"
    }
  }
}

### 4. Actualizar un usuario (Mutation)

Request:

{
  "query": "mutation ($id: ID!, $input: UserInput!) { updateUser(id: $id, input: $input) { id name email } }",
  "variables": {
    "id": "1",
    "input": {
      "name": "Ana María Torres Actualizada",
      "email": "ana.actualizada@example.com"
    }
  }
}

Response esperada:

{
  "data": {
    "updateUser": {
      "id": "1",
      "name": "Ana María Torres Actualizada",
      "email": "ana.actualizada@example.com"
    }
  }
}

### 5. Eliminar un usuario (Mutation)

Request:

{
  "query": "mutation ($id: ID!) { deleteUser(id: $id) { success message } }",
  "variables": {
    "id": "3"
  }
}

Response esperada:

{
  "data": {
    "deleteUser": {
      "success": true,
      "message": "Usuario 3 eliminado correctamente"
    }
  }
}

### Pruebas de Error (Casos Negativos)

#### 1. Email duplicado

Request:

{
  "query": "mutation ($input: UserInput!) { createUser(input: $input) { id name email } }",
  "variables": {
    "input": {
      "name": "Juan Pérez",
      "email": "ana@example.com"
    }
  }
}

Resultado: El correo "ana@example.com" ya está registrado

#### 2. ID inexistente

Request:

{
  "query": "mutation ($id: ID!) { updateUser(id: $id, input: { name: \"Test\", email: \"test@example.com\" }) { id name email } }",
  "variables": {
    "id": "999"
  }
}

Resultado: No existe el usuario con ID 999

#### 3. Nombre vacío

Request:

{
  "query": "mutation ($input: UserInput!) { createUser(input: $input) { id name email } }",
  "variables": {
    "input": {
      "name": "",
      "email": "test@example.com"
    }
  }
}

Resultado: Nombre y correo son obligatorios

## Dependencias

{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "express-graphql": "^0.12.0",
    "graphql": "^16.8.1",
    "mysql2": "^3.9.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}

## Preguntas de Reflexión

### 1. ¿Por qué GraphQL maneja Usuarios y Productos desde un único endpoint?

GraphQL utiliza un único endpoint (/graphql) porque el cliente especifica exactamente qué datos necesita mediante queries y mutations. Esto simplifica la API, reduce el número de peticiones y permite obtener datos relacionados en una sola consulta. En REST se necesitarían múltiples URLs como /api/users y /api/products, pero en GraphQL todo se maneja desde un solo punto.

### 2. ¿Qué diferencia existe entre esquema y resolutor?

El esquema define la estructura de datos disponibles y es el contrato entre cliente y servidor. El resolutor implementa la lógica para obtener los datos definidos en el esquema. El esquema dice "qué" datos existen y el resolutor dice "cómo" se obtienen esos datos. Por ejemplo, el esquema declara type User con campos id y name, mientras que el resolutor contiene la lógica para consultar esos datos desde la base de datos.

### 3. ¿Qué riesgo evita el SQL parametrizado?

El SQL parametrizado previene ataques de Inyección SQL. Esto ocurre cuando un atacante inserta código SQL malicioso en los parámetros de entrada de una consulta. Con SQL parametrizado, los valores se tratan como datos y no como código ejecutable, lo que elimina el riesgo de que un usuario malintencionado pueda manipular las consultas SQL para robar, modificar o eliminar información de la base de datos.

### 4. ¿Qué ventaja ofrecen las variables en GraphQL?

Las variables en GraphQL ofrecen varias ventajas: permiten reutilizar la misma operación con diferentes datos, separan la estructura de la operación de los valores reales, previenen ataques de inyección, mejoran la legibilidad del código, facilitan el cacheo de consultas, y GraphQL valida automáticamente que las variables tengan el tipo correcto. Sin variables, tendríamos que escribir una consulta diferente para cada valor que queramos usar.

### 5. ¿Qué cambiaría para separar Usuarios y Productos en microservicios?

Para separar Usuarios y Productos en microservicios se necesitarían: servidores independientes para cada servicio con sus propios endpoints, bases de datos separadas, un API Gateway para enrutar las solicitudes al servicio correspondiente, esquemas y resolvers separados, y posiblemente usar Apollo Federation para unificar los esquemas si se quiere mantener un solo endpoint. También se necesitaría implementar autenticación compartida mediante JWT y desplegar cada servicio en contenedores separados.

## Solución de Problemas

ECONNREFUSED 3306 - MySQL no está corriendo - Iniciar MySQL y verificar DB_PORT
Access denied - Credenciales incorrectas - Revisar y corregir .env
Unknown database - Base de datos no existe - Ejecutar database.sql
Cannot find module - Dependencias faltantes - Ejecutar npm install
Puerto ocupado - Otro proceso usa el puerto - Cambiar PORT en .env
Duplicate entry - Correo ya registrado - Usar otro correo

## Autoevaluación

[x] Explico el recorrido de una solicitud GraphQL
[x] Creo operaciones con variables en Postman
[x] Interpreto correctamente data y errors
[x] Compruebo persistencia en MySQL
[x] Diagnostico errores con consola y Postman

## Referencias

GraphQL Foundation. (2026). Queries. https://graphql.org/learn/queries/
GraphQL Foundation. (2026). Mutations. https://graphql.org/learn/mutations/
Postman. (2026). Make a GraphQL call with an HTTP request. https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-http/
Express.js. (s. f.). Basic routing. https://expressjs.com/en/starter/basic-routing/
MySQL2. (s. f.). Quickstart. https://sidorares.github.io/node-mysql2/docs
Material suministrado: GraphQL-V02-páginas-3.pdf

## Profesor

Fabian Parra - Tecnologías y Sistemas Web - Móvil

## Licencia

Este proyecto es para fines educativos en la Universidad Mariana.

---

Microservicio de usuarios GraphQL completamente funcional.
