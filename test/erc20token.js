const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const ERC20Token = artifacts.require('ERC20Token')

contract('ERC20Token', async (accounts) => {
  let token;
  let initialBalance = web3.utils.toBN(web3.utils.toWei('1'));

  let sender = accounts[1]
  let recipient = accounts[2]

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

    assert(name === 'My Token', 'incorrect token name ' + name)
    assert(symbol === 'TKN', 'incorrect token symbol ' + symbol)
    assert(parseInt(decimals) === 18, 'incorrect decimals ' + decimals)
    assert(totalSupply.eq(initialBalance), 'incorrect totalSuppy ' + totalSupply)
  })

  it('Should transfer balances from one account to another', async () => {
    const sender = token.address
    const balanceSenderBefore = await token.balanceOf(sender)
    const balanceRecipientBefore = await token.balanceOf(recipient)

    const receipt = await token.transfer(recipient, 1, {from: sender})

    const balanceSenderAfter = await token.balanceOf(sender)
    const balanceRecipientAfter = await token.balanceOf(recipient)

    // sender: 1 - 0 = 0
    assert(balanceSenderBefore.sub(balanceSenderAfter) === 0,
           'incorrect sender balance')
    // recipient: 1 - 0 = 1
    assert(balanceRecipientAfter.sub(balanceRecipientAfter) === 1,
           'incorrect recipient balance')
    expectEvent(receipt, 'Transfer', {
      from: sender,
      to: recipient,
      tokens: 1
    });
  })

})
