import './App.css'
import { useState } from 'react'
import { ethers } from 'ethers'
import ReactDOM from 'react-dom'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Chart from 'chart.js/auto'

class Reciept{
  constructor(){
    this.ids = new Array()
    this.quantities = new Array()
    this.totalPrice = 0
  }
}


// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = "your-contract-address"
const express_url = "http://localhost:3001"
var chart_created = false
var temp_data = null
var option = null

function App() {
  const rec = new Reciept()
  var id = 0
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
  //Get Data from Database
  var xhttp = new XMLHttpRequest()
  var records = null
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      records = JSON.parse(this.response)
      console.log(records)
    }
  }
  xhttp.open("GET",express_url)
  xhttp.send()

  const employee_clicked = () => {
    console.log("Employee Clicked")
    option = "employee"

    //function for update price
    function updatePrice(){
      //Reset Reciept
      rec.price = 0
      while(rec.ids.length > 0){
        rec.ids.pop()
        rec.quantities.pop()
      }
      var totalPriceElem = document.getElementById("label-price")
      for(var i = 0;i < id;i++){
        var elem = document.getElementById("id"+i.toString())
        if(!elem){
          continue
        }
        const temp_id = elem.value
        elem = document.getElementById("quantities"+i.toString())
        if(!elem){
          continue
        }
        const temp_quantities = parseInt(elem.value)
        for(var j = 0;j < records.price.length;j++){
          if(temp_id == records.id[j]){
            rec.ids.push(temp_id)
            rec.quantities.push(temp_quantities)
            rec.price += records.price[j]*rec.quantities[i]
            break
          }
        }
      }
      console.log(rec)
      totalPriceElem.innerHTML = rec.price.toString()
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


    const summitClicked = () => {
      console.log("Summit Button Clicked")
      window.alert("Summitted Reciept")

      //Reset related values
      while(rec.ids.length > 0){
        rec.ids.pop()
        rec.quantities.pop()
      }
      rec.totalPrice = 0
      document.getElementById("label-price").innerHTML = 0
      for(var i = 0;i < id;i++){
        document.getElementById("id"+i.toString()).value = ""
        document.getElementById("quantities"+i.toString()).value = ""
      }

    }
    //html for Employee
    const html = (
      <div>
        <div align = "center" style = {{fontSize:"25px",position:"sticky",top:"10",marginTop:"25px",marginRight:"750px",marginLeft:"750px"}}>
          <label> <b>Total Price is</b> </label>
          <br/>
          <label id = "label-price"> 0 </label>
          <br/>
          <button id = "button-summit" onClick = {summitClicked}> <b>Summit</b> </button>
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
    option = "manager"

    //view graph button
    const viewGraph =() => {
      const label = document.getElementById("label-date")
      label.innerHTML = document.getElementById("month").value + " " + document.getElementById("year").value
      const context = document.getElementById("chart").getContext("2d")
      if(chart_created){
        temp_data.destroy()
        chart_created = false
      }
      var xValues = []
      var yValues = []
      //Test graph
      for(var i = 1;i <= 31;i++){
        xValues.push(i.toString())
        yValues.push(i * i%2)
      }
      yValues[3] = 10.8
      yValues[9] = 100000
      var datasets = [
        {
          label:"Daily Income",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }
      ]
      var options = {
        legend: {display: false},
      }
      const chart = new Chart(context,{type:"line",data:{labels:xValues,datasets:datasets},options:options})
      temp_data = chart
      chart_created = true
    }

    const clearGraph = () =>{
      if(chart_created){
        const label = document.getElementById("label-date")
        label.innerHTML = ""
        temp_data.destroy()
        chart_created = false
      }
    }
    //html for manager
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
        <br/>
        <button style = {{height:"50px",fontSize:"20px",textAlign:"center"}} onClick = {viewGraph}> View Graph </button>
        <br/>
        <br/>
        <label id = "label-date" style = {{fontSize:"50px",fontWeight:"bold"}}/>
        <br/>
        <canvas id="chart" style = {{width:"300px",height:"100px",margin:"50px 250px 50px 250px"}}/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"/>
        <br/>
        <button style = {{position:"fixed",bottom:50,height:"50px",fontSize:"20px",textAlign:"center"}} onClick = {clearGraph}> Clear Graph </button>
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
