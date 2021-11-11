function retrieveProducts(){
  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database("database.db")

  db.all("SELECT * FROM Products", [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.close()
    console.log(rows)
    return rows
    })
}
var items = "123"

export default items
