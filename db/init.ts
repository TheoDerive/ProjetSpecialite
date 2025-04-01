import mysql from "mysql2"

export const connection = mysql.createPool({
  host: "localhost",
  password: "",
  user: "root",
  database: 'ProjetSpe',
})
