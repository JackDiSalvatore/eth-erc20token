// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

interface ERC20 {
    function decimals() external view returns(uint digits);
    function totalSupply() external view returns (uint supply);
    function balanceOf(address _owner) external view returns (uint balance);
    function allowance(address _owner, address _spender) external view returns (uint remaining);

    function transfer(address _to, uint _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);
    function approve(address _spender, uint _value) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

contract ERC20Token is ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint public totalSupply;

    // 'transfer' Balance
    // address -> balance
    mapping(address => uint) public balances;

    // 'fromTransfer' Allowed Balance
    // address -> (designated address: allowed spending balance)
    mapping(address => mapping(address => uint)) public allowed;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint _totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;

        // Give initial total supply to creator
        balances[msg.sender] = totalSupply;
    }

    // Transfer from your address (msg.sender) to another address
    function transfer(address to, uint value) public returns(bool) {
        require(balances[msg.sender] >= value, 'insufficient balance');
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    // Transfer from a designated allowance address
    function transferFrom(address from, address to, uint value) public returns(bool) {
        require(balances[from] >= value, 'insufficient balance');
        require(allowed[from][msg.sender] >= value, 'insufficient allowance');
        balances[from] -= value;
        balances[to] += value;
        allowed[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    // Approve thrid account to spend on your behalf
    function approve(address spender, uint value) public returns(bool) {
        require(msg.sender != spender, 'cannot set allowance on yourself');
        require(balances[msg.sender] >= value, 'sender does not have sufficient funds');
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    // Return address balance
    function balanceOf(address owner) view public returns(uint) {
        return balances[owner];
    }

    // Return approved allowance balance
    function allowance(address owner, address spender) view public returns(uint) {
        return allowed[owner][spender];
    }

}
