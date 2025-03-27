import mysql from "mysql2"

export const connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: 'ProjetSpe'
})
