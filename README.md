# API CRUD de clientes

1. Crea el archivo `.env` a partir de `.env.example` y define `DB_PASSWORD`.
2. Ejecuta el SQL de `database/db.sql` dentro de la base `PRUEBABD`.
3. Inicia la API con `pnpm dev`.

## Endpoints

- `GET /clientes`
- `GET /clientes/:clienteId`
- `POST /clientes`
- `PUT /clientes/:clienteId`
- `DELETE /clientes/:clienteId`

El cuerpo para crear o actualizar es:

```json
{
  "nombre": "Juan Pérez",
  "edad": 34,
  "telefono": "1234567890"
}
```
