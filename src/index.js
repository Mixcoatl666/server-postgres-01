import app from "./configs/app.js"
import { PORT } from "./configs/config.js"

app.listen(PORT);
console.log(`Servidor corriendo en el puerto ${PORT}`)
