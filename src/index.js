require('dotenv').config();

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const pool = require('./config/db');

const app = express();
const port = Number(process.env.PORT || 4000);

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'usuarios-graphql' });
});

// Endpoint GraphQL con GraphiQL habilitado
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,  // ¡Interfaz visual como en tus proyectos anteriores!
}));

// Iniciar servidor
async function start() {
    try {
        // Probar conexión a MySQL
        await pool.query('SELECT 1');
        console.log('✅ Conectado a MySQL correctamente');
        
        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${port}/graphql`);
            console.log(`📝 Abre esa URL para usar GraphiQL`);
            console.log(`❤️  Health check: http://localhost:${port}/health`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con MySQL:', error.message);
        console.log('💡 Verifica que MySQL esté corriendo y las credenciales en .env');
        process.exit(1);
    }
}

start();