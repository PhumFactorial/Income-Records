const express = require('express')
const app = express()
const port = 3001

class ProductDetail{
  constructor(){
    this.id = new Array()
    this.price = new Array()
  }
}

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  //Retrieve Data
  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database("database.db")
  const productDetail = new ProductDetail()
  db.all("SELECT * FROM Products", [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.close()
    rows.forEach((item, i) => {
      productDetail.id.push(item.id)
      productDetail.price.push(item.price)
    })
    //Send Response
    const records = JSON.stringify(productDetail)
    res.send(records)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
