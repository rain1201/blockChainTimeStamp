// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;

contract blockChain {  
    address public creator;  
    uint public price=100;  
    Record[] public records;  
  
    struct Record {  
        uint256 fileHash;  
        uint128 recordID;  
        string sign;  
    }  
  
    modifier onlyCreator() {  
        require(msg.sender == creator, "Only the creator can perform this action");  
        _;  
    }  
  
    // 构造函数  
    constructor() {  
        creator = msg.sender;  
    }  
  
    // 取出合约中的余额  
    function withdraw(uint value) external onlyCreator returns (bool) {  
        require(address(this).balance >= value, "Insufficient balance");  
        payable(msg.sender).transfer(value);  
        return true;  
    }  
  
    // 修改记录价格  
    function setPrice(uint recordPrice) external onlyCreator returns (bool) {  
        price = recordPrice;  
        return true;  
    }  
  
    // 向合约添加一条记录  
    function addRecord(
        uint256 fileHash,  
        uint128 recordID,  
        string memory selfSign  
    ) external payable returns (uint) {   
        if(msg.value < price) {
            return 0; // 转账金额不足
        }  
        records.push(Record({  
            fileHash: fileHash,  
            recordID: recordID,  
            sign: selfSign
        })); 

        return records.length; // 操作成功  
    }   
}