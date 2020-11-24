const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const ERC20Token = artifacts.require('ERC20Token')

contract('ERC20Token', async (accounts) => {
  // Notes:
  // "web3.utils.toWei": Converts any ether value value into wei.
  // "web3.utils.toBN": Will safely convert any given value 
  //                    (including BigNumber.js instances) into a BN.js instance,
  //                    for handling big numbers in JavaScript.

  let token;
  let initialBalance = web3.utils.toBN(web3.utils.toWei('1'));

  let deployer = accounts[0]
  let sender = accounts[1]
  let recipient = accounts[2]
  console.log('deployer: ' + deployer)
  console.log('sender: ' + sender)
  console.log('recipient: ' + recipient)

  beforeEach(async () => {
    token = await ERC20Token.new('My Token', 'TKN', 18, initialBalance); 
  });

  it('Should have the proper name, symbol, decimals, and total supply', async () => {
    const name = await token.name()
    const symbol = await token.symbol()
    const decimals = await token.decimals()
    const totalSupply = await token.totalSupply()

    console.log('STATS')
    console.log('name: ' + name + '\nsymbol: ' + symbol +
                '\ndecimals: ' + decimals + '\ntotalSupply: ' + totalSupply)
    console.log('Wei vs BN')
    console.log('toWei: ' + web3.utils.toWei('1'))
    console.log('toBN(toWei): ' + web3.utils.toBN(web3.utils.toWei('1')))

    assert(name === 'My Token', 'incorrect token name ' + name)
    assert(symbol === 'TKN', 'incorrect token symbol ' + symbol)
    assert(parseInt(decimals) === 18, 'incorrect decimals ' + decimals)
    assert(totalSupply.eq(initialBalance), 'incorrect totalSuppy ' + totalSupply)
  })

  it('Should give the total supply to the deployer account', async () => {
    const balance = await token.balanceOf(deployer)
    assert(balance.eq(initialBalance), 'incorrect initial balance')
  })

  it('Should transfer balances from one account to another', async () => {
    const value = web3.utils.toBN(100)	// 100 Wei
    const senderBalanceBefore = await token.balanceOf(deployer)
    const recipientBalanceBefore = await token.balanceOf(recipient)

    console.log('deployer balance before: ' + senderBalanceBefore)
    console.log('recipient balance before: ' + recipientBalanceBefore)
    console.log('value: ' + value)

    const receipt = await token.transfer(recipient, value, {from: deployer})

    const senderBalanceAfter = await token.balanceOf(deployer)
    const recipientBalanceAfter = await token.balanceOf(recipient)

    // sender: 10000 - 1 = 9999
    assert(senderBalanceBefore.sub(senderBalanceAfter).eq(value),
           'incorrect sender balance: ' + senderBalanceBefore.sub(senderBalanceAfter))
    // recipient: 0 + 1 = 1
    assert(recipientBalanceAfter.sub(recipientBalanceBefore).eq(value),
           'incorrect recipient balance: ' + recipientBalanceAfter.sub(recipientBalanceBefore))
    expectEvent(receipt, 'Transfer', {
      from: deployer,
      to: recipient,
      tokens: value
    });
  })

})
