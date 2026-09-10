import { pool } from "../database/db.js";

export class Notas {
    // * Obtener notas
    static async getNotas() {
        const queryText = "SELECT * FROM notas"
        const result = await pool.query(queryText)
        return result.rows
    }

    // * Crear nota
    static async createNotas(titulo, descripcion) {
        const queryText = "INSERT INTO notas (titulo, descripcion) VALUES ($1, $2) RETURNING *"
        const values = [titulo, descripcion]
        const result = await pool.query(queryText, values)
        return result.rows[0]
    }

    // * Actualizar nota
    static async updateNotas(idnota, titulo, descripcion) {
        const queryText = "UPDATE notas SET titulo = $1, descripcion = $2 WHERE idnota = $3 RETURNING *"
        const values = [titulo, descripcion, idnota]
        const result = await pool.query(queryText, values)
        return result.rows[0]
    }

    // * Eliminar nota
    static async deleteNotas(idnota) {
        const queryText = "DELETE FROM notas WHERE idnota = $1 RETURNING *"
        const values = [idnota]
        const result = await pool.query(queryText, values)
        return result.rows[0]
    }
}

