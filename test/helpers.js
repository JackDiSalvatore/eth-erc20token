exports.ether = (value) => {
  return web3.utils.toBN(
    // converts Ether value to Wei
    web3.utils.toWei(value.toString(), 'ether')
  )
}

exports.tokens = (value) => ether(value)

