// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

import EthPledge_artifacts from '../../build/contracts/EthPledge.json'

var EthPledge = contract(EthPledge_artifacts)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account

var i, j

var totalCampaigns

    window.buyRock = function () {

    },

    window.buyMainRock = function () {

    },

    window.App = {

      start: function () {
        var self = this

          EthPledge.setProvider(web3.currentProvider)
      }

    }

function openNav () {
  document.getElementById('myNav').style.width = '100%'
}

window.openNav = function () {
  document.getElementById('myNav').style.width = '100%'
}

window.closeNav = function () {
  document.getElementById('myNav').style.width = '0%'
}

window.sell = function () {

}

window.transfer = function () {

}

window.remove = function () {

}

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)

    let main = document.getElementById('maintable')


    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case '1':
                    // main

            break
        case '2':
                    // dunno

          break
        case '3':
                    // ropsten?

          break
        case '4':
                    // rinkeby

/*
          EthPledge.deployed().then(function (contractInstance) {
              contractInstance.createCampaign("0xF66b365bEeDF4a96A011Bd47205091e783437565", "1", "0x657468657265756d000000000000000000000000000000000000000000000000", { from: web3.eth.accounts[0], value: 30000000000000000}).then(function (result) {

              })
          })
*/

          EthPledge.deployed().then(function (contractInstance) {
            contractInstance.generalInfo.call().then(function (result) {
              // console.log(result[0].c[0])
              totalCampaigns = result[0].c[0]
              console.log(totalCampaigns)

                EthPledge.deployed().then(function (contractInstance) {
                    const displayCampaigns = async function () {
                        for (i = totalCampaigns - 1; i >= 0; i--) {
                            console.log('i of value ' + i + ' starting')

                            const data = await contractInstance.lookupCampaignPart1.call(i).then(function (results) {

                                console.log(results)

                            })
                        }
                    }

                    displayCampaigns().then(() => {
                        console.log('done')

                    const displayCampaigns2 = async function () {
                        for (j = totalCampaigns - 1; j >= 0; j--) {
                            console.log('j is ' + j)


                            const data2 = await
                            contractInstance.lookupCampaignPart2.call(j).then(function (results) {

                              console.log('printing for j of ' + j)

                                console.log(results)

                            })
                            
                        }
                    }

                    displayCampaigns2().then(() => {
                        console.log('j of value ' + j + ' completed')
                }).catch((e) => {
                        console.error(e)
                })


                }).catch((e) => {
                        console.error(e)
                })
                })


            })
          })


            break
        default:
                // nothing

      }
    })
  } else {
        // nothing
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")

  }

  App.start()

    // openNav()
})
