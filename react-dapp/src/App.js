import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import ReactDOM from 'react-dom';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
//import firebase from 'firebase'

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = "your-contract-address"

function App() {
  const button_style = {
    textAlign:"center",
    fontSize:"20px",
    height:"200px",
    width:"50%"
  }
  const input_style = {
    textAlign:"center",
    fontSize:"20px",
    height:"50px"
  }

  const employee_clicked = () => {
    console.log("Employee Clicked")
    var id = 0

    //function for update price
    function updatePrice(){
      var price = 0
      var totalPriceElem = document.getElementById("label-price")
      for(var i = 0;i < id;i++){
        var productId = document.getElementById("id"+i.toString())
        var productQuantity = document.getElementById("quantities"+i.toString())
        if(productId.value && productQuantity.value){
          var path = require('path')
          //const sqlite3 = require('sqlite3').verbose()
          //const db = new sqlite3.Database("./database.db")
          price += parseInt(productQuantity.value,10)
        }
      }
      totalPriceElem.innerHTML = price.toString()
    }

    //Function to create input
    function create_input(id,type){
      var temp = document.createElement("input")
      temp.id = type+id
      temp.style.textAlign = "center"
      temp.style.fontSize = "20px"
      temp.style.height = "50px"
      if(type == "quantities"){
        temp.type = "number"
      }
      temp.oninput = function(){updatePrice()}
      return temp
    }

    //remove Row
    const removeRow = () => {
      console.log("Remove Latest Row")
      var elem = document.getElementById("div-table")
      if(elem.children.length > 3){
        //br
        elem.removeChild(elem.lastChild)
        //input
        var temp = elem.removeChild(elem.lastChild)
        temp.remove()
        //input
        temp = elem.removeChild(elem.lastChild)
        temp.remove()
        id--
      }
    }

    //Constant for add row button
    const addRow = () => {
      console.log("Add Row Clicked")
      var elem = document.getElementById("div-table")
      elem.appendChild(create_input(id.toString(),"id"))
      elem.appendChild(create_input(id.toString(),"quantities"))
      elem.appendChild(document.createElement("br"))
      id++
    }

    const html = (
      <div>
        <div style = {{fontSize:"25px",position:"fixed",width:"20%",top:"10",marginTop:"25px",marginRight:"50px"}}>
          <label> <b>Total Price is</b> </label>
          <br/>
          <label id = "label-price"> 0 </label>
          <br/>
          <button id = "button-summit"> <b>Summit</b> </button>
          <br/>
          <br/>
        </div>
        <div id = "div-table" align = "center" style = {{position:"relative"}}>
          <input type = "text" disabled value = "Product ID" style = {input_style}/>
          <input type = "text" disabled value = "Quantities" style = {input_style}/>
          <br/>
        </div>
        <br/>
        <button onClick = {removeRow}> Remove Row </button>
        <button onClick = {addRow}> Add Row </button>
        <br/>
        <br/>
      </div>
    )
    ReactDOM.render(html,document.getElementById("main"))
  }

  const manager_clicked = () => {
    console.log("Manager Clicked")
    const html = (
      <div>
        <h1> Input Month And Year </h1>
        <datalist id = "months">
          <option value = "January"/>
          <option value = "Feburary"/>
          <option value = "March"/>
          <option value = "April"/>
          <option value = "May"/>
          <option value = "June"/>
          <option value = "July"/>
          <option value = "August"/>
          <option value = "September"/>
          <option value = "October"/>
          <option value = "November"/>
          <option value = "December"/>
        </datalist>
        <label style = {input_style}> Month </label>
        <input id = "month" list = "months" type = "text" style = {input_style}/>
        <label style = {input_style}> Year </label>
        <input id = "year" type = "text" style = {input_style}/>
        <br/>
      </div>
    )
    ReactDOM.render(html,document.getElementById("main"))
  }

  return (
    <div id = "main" align = "center">
      <h1>Who Are You?</h1>
      <button onClick = {employee_clicked} style = {button_style}> Employee </button>
      <br/>
      <button onClick = {manager_clicked} style = {button_style}> Manager </button>
    </div>)
}


export default App;
