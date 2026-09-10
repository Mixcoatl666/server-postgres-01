import { Notas } from "../models/Notas.js";

export const getNotas = async (req, res) => {
    try {
        const notas = await Notas.getNotas()
        res.json(notas)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener las notas" })
    }
}

export const createNotas = async (req, res) => {
    const {titulo, descripcion} = req.body

    try {
        const nota = await Notas.createNotas(titulo, descripcion)
        res.status(201).json(nota)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al crear la nota" })
    }
}

export const updateNotas = async (req, res) => {
    const {idnota} = req.params
    const {titulo, descripcion} = req.body

    try {
        const nota = await Notas.updateNotas(idnota, titulo, descripcion)
        if (!nota) return res.status(404).json({ error: "Nota no encontrada" })
        res.json(nota)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al actualizar la nota" })
    }
}

export const deleteNotas = async (req, res) => {
    const {idnota} = req.params

    try {
        const nota = await Notas.deleteNotas(idnota)
        if (!nota) return res.status(404).json({ error: "Nota no encontrada" })
        res.json({ message: "Nota eliminada correctamente" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al eliminar la nota" })
    }
}