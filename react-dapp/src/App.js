import './App.css'
import { useState } from 'react'
import { ethers } from 'ethers'
import ReactDOM from 'react-dom'
import Chart from 'chart.js/auto'

class Reciept{
  constructor(){
    this.ids = new Array()
    this.quantities = new Array()
    this.totalPrice = 0
  }
}

const api_url = "https://eth-ropsten.alchemyapi.io/v2/LzXw8cAojWbezDXn_5hXOj0MGb4A0t6M"
const private_key = "8d09966b9d4ba84fff910f3c89a6491558784a7f497acc389ce9533a3a0f905f"
const public_key = "0x8C9ac55Ea7B1e42EF1cE01d5c7d5A694b164C0Ba"
const contract_address = "0xF85461a7B8E3027AbF44C4101b08ED73Eb0410B1"
const contract = require("./artifacts/contracts/RecieptStorage.sol/RecieptStorage.json")

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(api_url);
const recieptStorage = new web3.eth.Contract(contract.abi,contract_address)

// Update with the contract address logged out to the CLI when it was deployed
const express_url = "http://localhost:3001"
var chart_created = false
var temp_data = null
var option = null

function App() {

  const rec = new Reciept()
  var id = 0
  const month_arr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
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
    }
  }
  xhttp.open("GET",express_url)
  xhttp.send()

  const employee_clicked = () =>{
    console.log("Employee Clicked")
    const addRecordClicked = () =>{
      console.log("Add Record Clicked")
      //function for update price
      function updatePrice(){
        //Reset Reciept
        rec.totalPrice = 0
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
          if(temp_quantities){
            for(var j = 0;j < records.price.length;j++){
              if(temp_id == records.id[j]){
                rec.ids.push(temp_id)
                rec.quantities.push(temp_quantities)
                rec.totalPrice += records.price[j]*rec.quantities[i]
                break
              }
            }
          }
        }
        console.log(rec)
        totalPriceElem.innerHTML = rec.totalPrice.toString()
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

          //Use This Function to Summit to the blockchain
          async function summitReciept() {
            const nonce = await web3.eth.getTransactionCount(public_key, 'latest'); // get latest nonce
            const date = new Date()
            const date_arr = [date.getDate(),date.getMonth(),date.getFullYear()]
            console.log(date_arr)
            const gasEstimate = await recieptStorage.methods.addReciept(date_arr,rec.ids,rec.quantities,rec.totalPrice).estimateGas();
            const tx = {
              'from': public_key,
              'to': contract_address,
              'nonce': nonce,
              'gas': gasEstimate,
              'data': recieptStorage.methods.addReciept(date_arr,rec.ids,rec.quantities,rec.totalPrice).encodeABI()
            }
            const signPromise = web3.eth.accounts.signTransaction(tx,private_key)
            signPromise.then((signedTx) => {
              web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
                if (!err) {
                  console.log("The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
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
                else {
                  console.log("Something went wrong when submitting your transaction:", err)
                  window.alert("Please Summit Later")
                }
              }
            );
            }).catch((err) => {
              console.log("Promise failed:", err);
            })
          }

          if(rec.ids.length > 0 && rec.quantities.length > 0){
            summitReciept()
          }
          else{
            window.alert("No data to be sent")
          }

        }
        //html for Add new Reciept
        const html = (
          <div>
            <div align = "center" style = {{fontSize:"25px",position:"sticky",top:"10",marginTop:"25px",marginRight:"750px",marginLeft:"750px"}}>
              <div style = {{position:"fixed",width:"10%",left:"0%"}}>
                <button style = {{fontSize:"50px"}} onClick = {backClicked}> Back </button>
              </div>
              <div style = {{border:"2px solid black"}}>
                <label> <b>Total Price is</b> </label>
                <br/>
                <label id = "label-price"> 0 </label>
                <br/>
                <button style = {{fontSize:"20px"}} onClick = {summitClicked}> <b>Summit</b> </button>
                <br/>
              </div>
              <br/>
            </div>
            <div id = "div-table" align = "center" style = {{position:"relative"}}>
              <input type = "text" disabled value = "Product ID" style = {input_style}/>
              <input type = "text" disabled value = "Quantities" style = {input_style}/>
              <br/>
            </div>
            <br/>
            <button style = {{fontSize:"20px"}} onClick = {removeRow}> Remove Row </button>
            <button style = {{fontSize:"20px"}} onClick = {addRow}> Add Row </button>
            <br/>
            <br/>
          </div>
        )
        ReactDOM.render(html,document.getElementById("main"))
    }

    const backClicked = () => {
      employee_clicked()
    }

    const closeRecordClicked = () => {
      console.log("Close Record Button Clicked")
      async function closeRecord() {
        const temp_date = new Date()
        const date = [temp_date.getDate(),temp_date.getMonth(),temp_date.getFullYear()]
        const nonce = await web3.eth.getTransactionCount(public_key, 'latest'); // get latest nonce
        const gasEstimate = await recieptStorage.methods.closeRecord(date).estimateGas();
        const tx = {
          'from': public_key,
          'to': contract_address,
          'nonce': nonce,
          'gas': gasEstimate,
          'data': recieptStorage.methods.closeRecord(date).encodeABI()
        }
        const signPromise = web3.eth.accounts.signTransaction(tx,private_key)
        signPromise.then((signedTx) => {
          web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
            if (!err) {
              console.log("The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!")
              window.alert("Record Closed")
            }
            else {
              console.log("Something went wrong when submitting your transaction:", err)
              window.alert("Please Wait and Click the Button Again")
            }
          }
        );
        }).catch((err) => {
          console.log("Promise failed:", err);
        })
      }
      closeRecord()
    }
    const html = (
      <div id = "main-employee" align = "center">
        <br/>
        <button onClick = {addRecordClicked} style = {{textAlign:"center",fontSize:"25px",height:"100px",width:"1000px"}}> Add New Reciept </button>
        <br/>
        <button onClick = {closeRecordClicked} style = {{textAlign:"center",fontSize:"25px",height:"100px",width:"1000px"}}> Close Record </button>
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
      async function drawGraph(_date){
        await recieptStorage.methods.getIncome([_date[0],_date[1]]).call().then(function(result){
          if(result.length > 0){
            const graph_date = []
            const graph_data = []
            for(var i = 0;i < result.length;i++){
              const date = result[i].date
              const balance = result[i].balance
              graph_date.push(date[0].toString() + " " + month_arr[_date[0]]+ " " + date[2].toString())
              graph_data.push(balance)
            }
            const datasets = [
              {
                label:"Daily Income",
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: graph_data
              }
            ]
            var options = {
              legend: {display: false},
            }
            const chart = new Chart(context,{type:"line",data:{labels:graph_date,datasets:datasets},options:options})
            temp_data = chart
            chart_created = true
          }
          else{
            window.alert("No Data Found")
          }
        })

      }
      var month = document.getElementById("month").value
      const year = parseInt(document.getElementById("year").value)
      switch(month){
        case "January" :
          month = 0
          break
        case "Feburary" :
          month = 1
          break
        case "March" :
          month = 2
          break
        case "April" :
          month = 3
          break
        case "May" :
          month = 4
          break
        case "June" :
          month = 5
          break
        case "July" :
          month = 6
          break
        case "August" :
          month = 7
          break
        case "September" :
          month = 8
          break
        case "October" :
          month = 9
          break
        case "November" :
          month = 10
          break
        case "December" :
          month = 11
          break
      }
      drawGraph([month,year])
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
