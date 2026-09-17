# API REST CRUD - Clientes y Notas

API REST construida con Express y PostgreSQL para gestionar clientes y notas.

## Setup

1. **Crea el archivo `.env`** en la raíz del proyecto:

```env
DB_USER=tu_usuario_postgres
DB_HOST=localhost
DB_NAME=PRUEBABD
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=3000
```

2. **Ejecuta el SQL de inicialización** en PostgreSQL:

```bash
psql -U tu_usuario -d PRUEBABD -f database/db.sql
```

3. **Instala dependencias e inicia la API**:

```bash
pnpm install
pnpm dev
```

La API estará disponible en `http://localhost:3000`

## Endpoints

### Clientes

#### Obtener todos los clientes

```http
GET /clientes
```

Respuesta `200`:

```json
[
  {
    "idCliente": 1,
    "nombre": "Juan",
    "edad": 34,
    "telefono": "1234567890",
    "create_at": "2026-09-10T12:56:01.490Z"
  }
]
```

#### Obtener cliente por ID

```http
GET /clientes/:clienteId
```

Respuesta `200`:

```json
{
  "idCliente": 1,
  "nombre": "Juan",
  "edad": 34,
  "telefono": "1234567890",
  "create_at": "2026-09-10T12:56:01.490Z"
}
```

#### Crear cliente

```http
POST /clientes
Content-Type: application/json
```

Body:

```json
{
  "nombre": "Juan Pérez",
  "edad": 34,
  "telefono": "1234567890"
}
```

Respuesta `201`:

```json
{
  "idCliente": 2,
  "nombre": "Juan Pérez",
  "edad": 34,
  "telefono": "1234567890",
  "create_at": "2026-09-10T13:00:00.000Z"
}
```

#### Actualizar cliente

```http
PUT /clientes/:clienteId
Content-Type: application/json
```

Body:

```json
{
  "nombre": "Juan Pérez Actualizado",
  "edad": 35,
  "telefono": "9876543210"
}
```

Respuesta `200`:

```json
{
  "idCliente": 2,
  "nombre": "Juan Pérez Actualizado",
  "edad": 35,
  "telefono": "9876543210",
  "create_at": "2026-09-10T13:00:00.000Z"
}
```

#### Eliminar cliente

```http
DELETE /clientes/:clienteId
```

Respuesta `200`:

```json
{
  "message": "Cliente eliminado correctamente"
}
```

### Notas

#### Obtener todas las notas

```http
GET /notas
```

Respuesta `200`:

```json
[
  {
    "idnota": 1,
    "titulo": "Nota 1",
    "descripcion": "Esta es la descripción de la nota 1",
    "create_at": "2026-09-10T12:56:01.490Z"
  }
]
```

#### Crear nota

```http
POST /notas
Content-Type: application/json
```

Body:

```json
{
  "titulo": "Nueva nota",
  "descripcion": "Contenido de la nueva nota"
}
```

Respuesta `201`:

```json
{
  "idnota": 2,
  "titulo": "Nueva nota",
  "descripcion": "Contenido de la nueva nota",
  "create_at": "2026-09-10T13:00:00.000Z"
}
```

#### Actualizar nota

```http
PUT /notas/:idnota
Content-Type: application/json
```

Body:

```json
{
  "titulo": "Nota actualizada",
  "descripcion": "Contenido actualizado"
}
```

Respuesta `200`:

```json
{
  "idnota": 2,
  "titulo": "Nota actualizada",
  "descripcion": "Contenido actualizado",
  "create_at": "2026-09-10T13:00:00.000Z"
}
```

#### Eliminar nota

```http
DELETE /notas/:idnota
```

Respuesta `200`:

```json
{
  "message": "Nota eliminada correctamente"
}
```

## Estructura del Proyecto

```
src/
├── index.js                    # Punto de entrada
├── db.js                       # Configuración de PostgreSQL
├── configs/
│   └── config.js              # Variables de entorno
├── controllers/
│   ├── clientes.controller.js # Lógica de clientes
│   └── notas.controller.js    # Lógica de notas
├── models/
│   ├── Clientes.js           # Modelo de datos clientes
│   └── Notas.js              # Modelo de datos notas
└── routes/
    ├── clientes.routes.js     # Rutas de clientes
    └── notas.routes.js        # Rutas de notas

database/
└── db.sql                      # Schema y datos iniciales
```

## Errores Comunes

- **Error 500 en `/notas`**: Asegúrate de haber ejecutado `database/db.sql` en la base de datos.
- **Conexión rechazada**: Verifica que PostgreSQL esté ejecutándose y que las variables `.env` sean correctas.
- **Error 404**: La ruta no existe; revisa el ID del recurso.
