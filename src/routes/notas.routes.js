import { Router } from "express"
import { 
    getNotas,
    createNotas,
    updateNotas,
    deleteNotas
} from "../controllers/notas.controller.js"

const router = Router()

router.get("/notas", getNotas)
router.post("/notas", createNotas)
router.put("/notas/:idnota", updateNotas)
router.delete("/notas/:idnota", deleteNotas)

export default router