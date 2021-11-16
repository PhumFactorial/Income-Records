//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RecieptStorage {
    struct Reciept{
      uint[3] date;
      string[] ids;
      uint[] quantities;
      uint price;
    }
    struct Income{
      uint[3] date;
      uint balance;
    }
    Reciept[] reciepts;
    Income[] incomes;

    //temp Array
    Income[] temp;

    constructor(string memory _greeting) {
        console.log("Deploying a RecieptStorage ",_greeting);
    }

    function addReciept(uint[3] memory _date,string[] memory _ids,uint[] memory _quantities,uint _price) public {
      Reciept memory reciept = Reciept(_date,_ids,_quantities,_price);
      reciepts.push(reciept);
    }

    //Day Month and Year
    function closeRecord(uint[3] memory _date) public{






        bool date_found = false;
        uint index = 0;
        for(uint i = 0;i < incomes.length;i++){
          bool con1 = incomes[i].date[0] == _date[0];
          bool con2 = incomes[i].date[1] == _date[1];
          bool con3 = incomes[i].date[2] == _date[2];
          if(con1 && con2 && con3){
            date_found = true;
            index = i;
            break;
          }
        }
        uint total = 0;
        for(uint i = 0;i < reciepts.length;i++){
            bool con1 = reciepts[i].date[0] == _date[0];
            bool con2 = reciepts[i].date[1] == _date[1];
            bool con3 = reciepts[i].date[2] == _date[2];
            if(con1 && con2 && con3){
            total += reciepts[i].price;
            }
        }
        Income memory inc = Income(_date,total);
        if(!date_found){
            incomes.push(inc);
        }
        else{
            incomes[index] = inc;
        }
     }

    //Month and Year
    function getIncome(uint[2] memory _date) public returns(Income[] memory income){
        //Empty The Temp Array
        while(temp.length > 0){
          temp.pop();
        }
        for(uint i= 0;i < incomes.length;i++){
        if(incomes[i].date[1] == _date[0] && incomes[i].date[2] == _date[1]){
          temp.push(incomes[i]);
        }
      }
      return temp;
    }

}
