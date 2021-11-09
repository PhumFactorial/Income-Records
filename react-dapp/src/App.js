import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import ReactDOM from 'react-dom';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = "your-contract-address"
console.log(window.location.pathname)

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
      return temp
    }

    //remove Row
    const removeRow = () => {
      console.log("Remove Latest Row")
      var elem = document.getElementById("div-table")
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
        <div id = "div-table" align = "center">
          <input type = "text" disabled value = "Product ID" style = {input_style}/>
          <input type = "text" disabled value = "Quantities" style = {input_style}/>
          <br/>
        </div>
        <br/>
        <button onClick = {removeRow}> Remove Row </button>
        <button onClick = {addRow}> Add Row </button>
        <br/>
        <br/>
        <div align = "center">
          <button id = "button-summit"> Summit </button>
          <br/>
          <br/>
        </div>
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
