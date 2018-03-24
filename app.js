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

var i, j, p

var totalCampaigns

var iD

var benefactor = []
var charity = []
var amountPledged = []
var amountRaised = []
var donationsReceived = []
var multiplier = []
var active = []
var successful = []
var timeStarted = []
var description1 = []
var description2 = []
var description3 = []
var description4 = []

    window.App = {

      start: function () {
        var self = this

          EthPledge.setProvider(web3.currentProvider)
      }

    }

window.openNav = function () {
  document.getElementById('myNav').style.width = '100%'
}

window.closeNav = function () {
  document.getElementById('myNav').style.width = '0%'
}

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

window.submitContribution = function () {

    var valueToPledge = $('#amountToContribute').val()

    var valueToPledgeInWei = valueToPledge * 1000000000000000000

    console.log(valueToPledge, valueToPledgeInWei)

    divContent.innerHTML = '<img src="http://ethpledge.com/' + 'spinner' + '.gif" align="middle" style="vertical-align:bottom" class="centerloader"><br><p><b>Submitting transaction...</b></p>'

    EthPledge.deployed().then(function (contractInstance) {
        contractInstance.contributeToCampaign(iD, { from: web3.eth.accounts[0], value: valueToPledgeInWei}).then(function (result) {
            divContent.innerHTML = '<b>Donation successful! Loading the campaign page...</b>'
            delay(function(){
                window.location.replace("http://ethpledge.com/id/" + iD);
            }, 5000 ); // end delay
        })
    })

}

function cleanString (input) {
    var output = ''
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i)
        }
    }
    return output
}

window.createPledge = function() {

    let message = $('#description').val()

    console.log('message is ' + message)

    var string1 = ''
    var string2 = ''
    var string3 = ''
    var string4 = ''

    if (message.length <= 32) {
        string1 = message
    } else if (message.length >= 33 && message.length <= 64) {
        string1 = message.substring(0, 32)
        string2 = message.substring(32, message.length)
    } else if (message.length >= 65 && message.length <= 96) {
        string1 = message.substring(0, 32)
        string2 = message.substring(32, 64)
        string3 = message.substring(64, message.length)
    } else if (message.length >= 97) {
        string1 = message.substring(0, 32)
        string2 = message.substring(32, 64)
        string3 = message.substring(64, 96)
        string4 = message.substring(96, 128)
    }

    console.log('strings are ' + string1, string2, string3, string4)

    string1 = cleanString(string1)
    string2 = cleanString(string2)
    string3 = cleanString(string3)
    string4 = cleanString(string4)

    let address = $('#address').val()
    let amountToPledge = $('#amountToPledge').val() * 1000000000000000000
    let multiplier = $('#multiplier').val()

    campaignForm.innerHTML = '<img src="http://ethpledge.com/' + 'spinner' + '.gif" align="middle" style="vertical-align:bottom" class="centerloader"><br><div class="center"><p>Submitting transaction... if you have cancelled the transaction, refresh the page to reload the form.</p></div>'

    EthPledge.deployed().then(function (contractInstance) {
        contractInstance.createCampaign(address, multiplier, string1, string2, string3, string4, { from: web3.eth.accounts[0], value: amountToPledge}).then(function (error, result) {

            campaignForm.innerHTML = '<div class="center"><b>Campaign created! Taking you back to the homepage...</b></div>'

            delay(function(){
                window.location.replace("http://ethpledge.com");
            }, 5000 ); // end delay

        })
    })

}

window.contribute = function () {

    $('number').click(function() {
        iD = this.id

        console.log(iD)

        divContent.innerHTML = '<div id="userInfo"></div><div id="infoBox"></div><div id="statusLeft"></div>'

        document.getElementById('myNav').style.width = '100%'

        userInfo.innerHTML = '<h4>Contribute to Pledge ID ' + iD + '</h4><br>'

        p = document.createElement('p')
        p.className = 'campaignTables'
        if (multiplier[iD] == 1) {
            p.innerHTML = '<b>Pledge ID ' + iD + '</b>: <i>' + description1[iD] + description2[iD] + description3[iD] + description4[iD] + '</i> <br> Begun by address ' + benefactor[iD] + ', who has <b>pledged to donate ' + amountPledged[iD] + ' Ether</b> to address ' + charity[iD] + '. <u>So far ' + amountRaised[iD] + ' Ether has been contributed</u> to this pledge over ' + donationsReceived[iD] + ' donations. For this pledge to be successful ' + amountPledged[iD] + ' Ether would need to be contributed by others. This pledge has an <u>active status of ' + active[iD] + '</u> and a <u>successful status of ' + successful[iD] + '</u>. It was started at ' + timeStarted[iD] + '.'
        } else {
            p.innerHTML = '<b>Pledge ID ' + iD + '</b>: <i>' + description1[iD] + description2[iD] + description3[iD] + description4[iD] + '</i> <br> Begun by address ' + benefactor[iD] + ', who has pledged to donate <b>' + amountPledged[iD] + ' Ether</b> to address ' + charity[iD] + '. So far ' + amountRaised[iD] + ' Ether has been contributed to this pledge over ' + donationsReceived[iD] + ' donations. This pledge has been setup with a multiplier of ' + multiplier[iD] + ', so others would need to contribute an extra 1/' + multiplier[iD] + ' of the amount pledged of ' + amountPledged[iD] + ' for it to be marked as successful. This pledge has an active status of ' + active[iD] + ' and a successful status of ' + successful[iD] + '. It was started at ' + timeStarted[iD] + '.'
        }
        infoBox.appendChild(p)

        if (active[iD].toString() != 'true') {
            statusLeft.innerHTML = '<hr><b>This pledge is no longer active.</b>'
        } else {
            EthPledge.deployed().then(function (contractInstance) {
                contractInstance.returnHowMuchMoreETHNeeded(iD).then(function (result) {
                    console.log(result + ' is how much more eth needed')

                    if (+result > 0) {
                        statusLeft.innerHTML = '<hr><b>This pledge requires ' + result/1000000000000000000 + ' more Ether to be contributed before it becomes successful.</b><hr><div class="form-group">\n' +
                            '            <textarea class="form-control" rows="1" id="amountToContribute" placeholder="Amount of Ether to contribute - can enter decimals (eg. 0.0123)" style="overflow:auto"></textarea>\n' +
                            '        </div>\n' +
                            '\n' +
                            '        <a href="#!" onclick="submitContribution()" button id="submitContributionButton" class="btn btn-primary btn-block">Contribute!</a>'
                    }

                })
            })
        }

    });

}

window.remove = function () {

}

window.cancelPledge = function () {

    // main.innerHTML = '<div id="campaignTables"></div><div id="listCampaignDonations"><br><h4>Latest Donations</h4></div><hr><div class="center"><a href="http://www.ethpledge.com">[Return To Homepage]</a><hr>Canceling pledge....</div>'

    console.log('cancelling campaign ' + j)

    EthPledge.deployed().then(function (contractInstance) {
        contractInstance.cancelCampaign(j, { from: web3.eth.accounts[0]}).then(function (result) {
            window.location.replace("http://ethpledge.com/id/" + j);
        })
    })

}

function go() {

    let main = document.getElementById('maintable')

    let campaignsTables = document.getElementById('campaignTables')

    let url = window.location.pathname

    if (url == '/') {
        campaignsTables.innerHTML = '<img src="http://ethpledge.com/' + 'spinner' + '.gif" align="middle" style="vertical-align:bottom" class="centerloader">'

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

                                // console.log(results)

                                benefactor[i] = results[0]
                                charity[i] = results[1]
                                amountPledged[i] = results[2]/1000000000000000000
                                amountRaised[i] = results[3]/1000000000000000000
                                donationsReceived[i] = results[4]
                                description1[i] = web3.toAscii(results[5])
                                description2[i] = web3.toAscii(results[6])

                                console.log('benefactor: ' + benefactor[i])
                                console.log('charity: ' + charity[i])
                                console.log('amountPledged: ' + amountPledged[i])
                                console.log('amountRaised: ' + amountRaised[i])
                                console.log('donationsReceived: ' + donationsReceived[i])

                            })
                        }
                    }

                    displayCampaigns().then(() => {
                        console.log('done')

                    campaignTables.innerHTML = ''

                    const displayCampaigns2 = async function () {
                        for (j = totalCampaigns - 1; j >= 0; j--) {
                            console.log('j is ' + j)


                            const data2 = await
                            contractInstance.lookupCampaignPart2.call(j).then(function (results) {

                                console.log('printing for j of ' + j)

                                console.log(results)

                                var date = new Date(+results[3] * 1000)

                                multiplier[j] = results[0]
                                active[j] = results[1]
                                successful[j] = results[2]
                                timeStarted[j] = date.toLocaleString()
                                description3[j] = web3.toAscii(results[4])
                                description4[j] = web3.toAscii(results[5])

                                console.log('multiplier: ' + multiplier[j])
                                console.log('active: ' + active[j])
                                console.log('successful: ' + successful[j])
                                console.log('timeStarted: ' + timeStarted[j])
                                // console.log('description: ' + description[j])

                                loadCampaignTable()

                            })

                        }
                    }

                    displayCampaigns2().then(() => {
                        console.log('all done')
                }).catch((e) => {
                        console.error(e)
                })


                }).catch((e) => {
                        console.error(e)
                })
                })


            })
        })



    } else if (url.startsWith("/id/")) {



        j = url.substring(4, url.length)

        console.log('j is ' + j)

        main.innerHTML = '<div id="campaignTables"></div><div id="listCampaignDonations"><br><h4>Latest Donations</h4></div><div class="center"><a href="http://www.ethpledge.com"><hr>[Return To Homepage]</a></div>'

        let campaignsTables = document.getElementById('campaignTables')

        campaignsTables.innerHTML = '<img src="http://ethpledge.com/' + 'spinner' + '.gif" align="middle" style="vertical-align:bottom" class="centerloader">'


        EthPledge.deployed().then(function (contractInstance) {

            const displayCampaigns = async function () {

                const data = await contractInstance.lookupCampaignPart1.call(j).then(function (results) {

                    // console.log(results)

                    benefactor[j] = results[0]
                    charity[j] = results[1]
                    amountPledged[j] = results[2]/1000000000000000000
                    amountRaised[j] = results[3]/1000000000000000000
                    donationsReceived[j] = results[4]
                    description1[j] = web3.toAscii(results[5])
                    description2[j] = web3.toAscii(results[6])

                    console.log('benefactor: ' + benefactor[j])
                    console.log('charity: ' + charity[j])
                    console.log('amountPledged: ' + amountPledged[j])
                    console.log('amountRaised: ' + amountRaised[j])
                    console.log('donationsReceived: ' + donationsReceived[j])

                })

            }

            displayCampaigns().then(() => {
                console.log('done')

            campaignTables.innerHTML = ''

            const displayCampaigns2 = async function () {

                console.log('j is ' + j)


                const data2 = await
                contractInstance.lookupCampaignPart2.call(j).then(function (results) {

                    console.log('printing for j of ' + j)

                    console.log(results)

                    var date = new Date(+results[3] * 1000)

                    multiplier[j] = results[0]
                    active[j] = results[1]
                    successful[j] = results[2]
                    timeStarted[j] = date.toLocaleString()
                    description3[j] = web3.toAscii(results[4])
                    description4[j] = web3.toAscii(results[5])

                    console.log('multiplier: ' + multiplier[j])
                    console.log('active: ' + active[j])
                    console.log('successful: ' + successful[j])
                    console.log('timeStarted: ' + timeStarted[j])
                    // console.log('description: ' + description[j])



                })


            }

            displayCampaigns2().then(() => {
                console.log('all done')

            if (benefactor[j] == web3.eth.accounts[0]) {
                main.innerHTML = '<div id="campaignTables"></div><div id="listCampaignDonations"><br><h4>Latest Donations</h4></div><hr><div class="center"><a href="http://www.ethpledge.com">[Return To Homepage]</a><hr><a href="#!" onclick="cancelPledge()">OWNER FUNCTION: Click here to cancel this pledge</a></div>'
            }

            loadCampaignTable()

            // EthPledge.deployed().then(function (contractInstance) {
            const displayDonations = async function () {

                for (var donationNumber = donationsReceived[j] - 1; donationNumber >= 0; donationNumber--) {
                    const data3 = await contractInstance.lookupDonation.call(j, donationNumber).then(function (results) {

                        var date = new Date(+results[2] * 1000)
                        var time = date.toLocaleString()

                        var amountDonated = results[1] / 1000000000000000000

                        p = document.createElement('p')
                        p.className = 'center'
                        p.innerHTML = results[0] + ' donated ' + amountDonated + ' Ether at ' + time
                        listCampaignDonations.appendChild(p)

                    })
                }

            }

            displayDonations().then(() => {
                console.log('donations number found')
        }).catch((e) => {
                console.error(e)
        })

            // })

        }).catch((e) => {
                console.error(e)
        })


        }).catch((e) => {
                console.error(e)
        })
        })



    } else if (url == '/create-pledge') {

        /*
          main.innerHTML = 'Use the form below to create a pledge to donate an amount of Ether to a certain charity. <i>Address</i> is the address of the Ethereum account you\'re pledging to donate to, such as 0xb30cb3b3E03A508Db2A0a3e07BA1297b47bb0fb1. <i>Amount</i> is the amount of Ether you\'ll be putting up. <i>Multiplier</i> is how many times more Ether you\'re putting up than what needs to be contributed by others for the pledge to be successful. For example, if you pledge to donate 10 Ether and have a multiplier of 5, others would only need to contribute 2 Ether (10/5) for the pledge to be successful and the Ether to be donated (a multiplier of 1 would probably be most common, where you\'re simply matching everyone else\'s donations by the same amount). <i>Description</i> is a very short description of your pledge (maximum of 128 characters) - probably for this you can just write the organization being donated to.<hr><div id="campaignForm"></div><hr><div class="center"><a href="http://www.ethpledge.com">[Return To Homepage]</a></div>'
          */

        main.innerHTML = '<p>Use the form below to create a pledge to donate an amount of Ether to a certain charity. You\'ll be sending the amount of Ether you\'re pledging to donate to the EthPledge smart contract, where it will remain until the donation target from others gets reached, upon which it will be sent to the recipient. If you choose later to cancel the pledge, you\'ll get a refund of your pledge amount in line with how much others have donated - if you cancel the pledge when 10% of the donation target has been reached, for example, 10% of your pledge amount (along with the donations) will be sent the the charity address, and 90% of the pledge amount you put up will be returned to you.</p><p>Note that the last field in the form below (<i>Multiplier</i>) is how many times more Ether you\'re putting up than what needs to be contributed by others for the pledge to be successful. For example, if you pledge to donate 10 Ether and have a multiplier of 5, others would only need to contribute 2 Ether (10/5) for the pledge to be successful and the Ether to be donated (a multiplier of 1 would probably be most common, where you\'re simply matching everyone else\'s donations by the same amount).</p><hr><div id="campaignForm"></div><hr><div class="center"><a href="http://www.ethpledge.com">[Return To Homepage]</a></div>'

        campaignForm.innerHTML = '<div class="form-group">\n' +
            '            <textarea class="form-control" rows="1" id="address" placeholder="Enter the Ethereum address to donate to" style="overflow:auto"></textarea>\n' +
            '        </div><div class="form-group">\n' +
            '            <textarea class="form-control" rows="1" id="amountToPledge" placeholder="Amount of Ether to pledge - can enter decimals (eg. 0.0123)" style="overflow:auto"></textarea>\n' +
            '        </div><div class="form-group">\n' +
            '            <textarea class="form-control" rows="1" id="description" placeholder="Short description (max 128 characters)" style="overflow:auto"></textarea>\n' +
            '        </div><div class="form-group">\n' +
            '            <textarea class="form-control" rows="1" id="multiplier" placeholder="Multiplier (enter 1 if you\'re just matching other donations up to the pledge amount)" style="overflow:auto"></textarea>\n' +
            '        </div><a href="#!" onclick="createPledge()" button id="createPledgeButton" class="btn btn-primary btn-block">Create Pledge!</a>'



    }

}

function tellUserToSwitch() {

    let main = document.getElementById('maintable')

    let campaignsTables = document.getElementById('campaignTables')

    let url = window.location.pathname

    if (url == '/') {
        campaignTables.innerHTML = 'Please switch MetaMask to the mainnet or rinkeby.'
    } else if (url == '/create-pledge') {
        main.innerHTML = 'Please switch MetaMask to the mainnet or rinkeby.'
    } else if (url.startsWith("/id/")) {
        main.innerHTML = 'Please switch MetaMask to the mainnet or rinkeby.'
    }

}

function loadCampaignTable() {

    let campaignsTables = document.getElementById('campaignTables')

    p = document.createElement('p')
    if (active[j].toString() != 'true') {
        p.className = 'campaignTablesInactive'
    } else {
        p.className = 'campaignTables'
    }

    if (multiplier[j] == 1) {
        if (active[j].toString() != 'true') {
            p.innerHTML = '<b>Pledge ID ' + j + '</b>: <i>' + description1[j] + description2[j] + description3[j] + description4[j] + '</i> <br> Begun by address ' + benefactor[j] + ', who has <b>pledged to donate ' + amountPledged[j] + ' Ether</b> to address ' + charity[j] + '. <u>' + amountRaised[j] + ' Ether has been contributed</u> to this pledge over ' + donationsReceived[j] + ' donations. This pledge is inactive with a <u>successful status of ' + successful[j] + '</u>. It was started at ' + timeStarted[j] + '. <br><hr>Can\'t contribute - all over! | <a href="http://www.ethpledge.com/id/' + j + '">Permalink</a>'
        } else {
            p.innerHTML = '<b>Pledge ID ' + j + '</b>: <i>' + description1[j] + description2[j] + description3[j] + description4[j] + '</i> <br> Begun by address ' + benefactor[j] + ', who has <b>pledged to donate ' + amountPledged[j] + ' Ether</b> to address ' + charity[j] + '. <u>So far ' + amountRaised[j] + ' Ether has been contributed</u> to this pledge over ' + donationsReceived[j] + ' donations. For this pledge to be successful ' + amountPledged[j] + ' Ether would need to be contributed by others. This pledge has an <u>active status of ' + active[j] + '</u> and a <u>successful status of ' + successful[j] + '</u>. It was started at ' + timeStarted[j] + '. <br><hr><number id="' + j + '"><a href="#!" onclick="contribute()">Contribute to this pledge</a></number> | <a href="http://www.ethpledge.com/id/' + j + '">Permalink</a>'
        }
    } else {
        if (active[j].toString() != 'true') {
            p.innerHTML = '<b>Pledge ID ' + j + '</b>: <i>' + description1[j] + description2[j] + description3[j] + description4[j] + '</i> <br> Begun by address ' + benefactor[j] + ', who has pledged to donate <b>' + amountPledged[j] + ' Ether</b> to address ' + charity[j] + '. ' + amountRaised[j] + ' Ether has been contributed to this pledge over ' + donationsReceived[j] + ' donations. This pledge has been setup with a multiplier of ' + multiplier[j] + ', so others needed to contribute an extra 1/' + multiplier[j] + ' of the amount pledged of ' + amountPledged[j] + ' for it to be marked as successful. This pledge is no longer active and has a successful status of ' + successful[j] + '. It was started at ' + timeStarted[j] + '. <br><hr>Can\'t contribute - all over! | <a href="http://www.ethpledge.com/id/' + j + '">Permalink</a>'
        } else {
            p.innerHTML = '<b>Pledge ID ' + j + '</b>: <i>' + description1[j] + description2[j] + description3[j] + description4[j] + '</i> <br> Begun by address ' + benefactor[j] + ', who has pledged to donate <b>' + amountPledged[j] + ' Ether</b> to address ' + charity[j] + '. So far ' + amountRaised[j] + ' Ether has been contributed to this pledge over ' + donationsReceived[j] + ' donations. This pledge has been setup with a multiplier of ' + multiplier[j] + ', so others would need to contribute an extra 1/' + multiplier[j] + ' of the amount pledged of ' + amountPledged[j] + ' for it to be marked as successful. This pledge has an active status of ' + active[j] + ' and a successful status of ' + successful[j] + '. It was started at ' + timeStarted[j] + '. <br><hr><number id="' + j + '"><a href="#!" onclick="contribute()">Contribute to this pledge</a></number> | <a href="http://www.ethpledge.com/id/' + j + '">Permalink</a>'
        }

    }
    console.log('j is ' + j)
    campaignsTables.appendChild(p)
}

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)

      App.start()

    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case '1':
                    // main

          go()

            break
        case '2':
                    // morden?

          tellUserToSwitch()

          break
        case '3':
                    // ropsten?

          tellUserToSwitch()

          break
        case '4':
                    // rinkeby

          go()

            break
        default:
                // unknown

          tellUserToSwitch()

      }
    })
  } else {
        // nothing
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")

      let main = document.getElementById('maintable')

      let campaignsTables = document.getElementById('campaignTables')

      let url = window.location.pathname

      if (url == '/') {
          campaignTables.innerHTML = '<b>Unable to load campaigns -- You are not connected to the Ethereum mainet.</b> To use this service, you\'ll need to download <a href="https://metamask.io/">MetaMask</a>, a browser extension available for Chrome and Firefox which allows you to connect to the Ethereum mainnet. Installing the extension only takes a minute.'
      } else if (url == '/create-pledge') {
          main.innerHTML = '<b>You are not connected to the Ethereum mainnet.</b> To create a pledge, you\'ll need to download <a href="https://metamask.io/">MetaMask</a>, a browser extension available for Chrome and Firefox which allows you to connect to the Ethereum mainnet. Installing the extension only takes a minute.'
      } else if (url.startsWith("/id/")) {
          main.innerHTML = '<b>You are not connected to the Ethereum mainnet.</b> To view information on a pledge, you\'ll need to download <a href="https://metamask.io/">MetaMask</a>, a browser extension available for Chrome and Firefox which allows you to connect to the Ethereum mainnet. Installing the extension only takes a minute.'
      }

  }

})
