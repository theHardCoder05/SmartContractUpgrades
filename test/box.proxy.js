const { expect } = require('chai')

let Box, box

// Start test block
describe('Box (proxy)', () => {
  beforeEach(async () => {
    Box = await ethers.getContractFactory("Box")
    box = await upgrades.deployProxy(Box, [42], { initializer: 'store' })
  })
  it('retrieve returns a value previously initialized', async () => {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await box.retrieve()).toString()).to.equal('42')
    expect(() => { box.increment() }).to.throw(TypeError)
  })
  it('upgrades', async () => {
    const BoxV2 = await ethers.getContractFactory("BoxV2")
    box = await upgrades.upgradeProxy(box.address, BoxV2)
    await box.increment()
    let result = await box.retrieve()
    expect(result).to.equal(43)
  })
})