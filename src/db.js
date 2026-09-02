import pg from "pg";
import { databaseConfig } from "./config.js";

export const pool = new pg.Pool(databaseConfig);
