pragma solidity ^0.4.2;

contract EthPledge {
    
    address public owner;
    
    function EthPledge() {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    struct Campaign {
        address benefactor; // Person starting the campaign, who puts in some ETH to donate to an Ethereum address. 
        address charity;
        uint amountPledged;
        uint amountRaised;
        uint donationsReceived;
        uint multiplier; // If this was 5, for example, other donators would only need to put up 1/5th of the amount the benefactor does for the pledge to be successful and all funds to be donated. Eg. Benefactor pledges 10 ETH, then after only 2 ETH is contributed to the campaign, all funds are send to the charity and the campaign ends
        bool active;
        bool successful;
        uint timeStarted;
        bytes32 description; // Can only be 32 characters long, probably will just say the charity being donated to. The user would enter this on the website and then it'd be converted to bytes32 (and converted back to a string when displayed on the website)
    }
    
    mapping (uint => Campaign) public campaign;
    
    mapping (address => uint[]) public campaignsStartedByUser;
    
    mapping (address => mapping(uint => uint)) public addressToCampaignIDToFundsDonated;
    
    mapping (address => uint[]) public campaignIDsDonatedToByUser; // Will contain duplicates if a user donates to a campaign twice
    
    struct Donation {
        address donator;
        uint amount;
        uint timeSent;
    }
    
    mapping (uint => mapping(uint => Donation)) public campaignIDtoDonationNumberToDonation;
    
    uint public totalCampaigns;
    
    uint public totalDonations;
    
    uint public totalETHraised;
    
    uint public minimumPledgeAmount = 10**17; // 0.1 Ether
    
    function createCampaign (address charity, uint multiplier, bytes32 description) payable {
        require (msg.value > minimumPledgeAmount);
        require (multiplier > 0);
        campaign[totalCampaigns].benefactor = msg.sender;
        campaign[totalCampaigns].charity = charity;
        campaign[totalCampaigns].description = description;
        campaign[totalCampaigns].multiplier = multiplier;
        campaign[totalCampaigns].timeStarted = now;
        campaign[totalCampaigns].amountPledged = msg.value;
        campaign[totalCampaigns].active = true;
        campaignsStartedByUser[msg.sender].push(totalCampaigns);
        totalETHraised += msg.value;
        totalCampaigns++;
    }
    
    function cancelDonation (uint campaignID) {
        require (msg.sender == campaign[campaignID].benefactor);
        campaign[campaignID].active = false;
        campaign[campaignID].successful = false;
        uint amountToSendTocharity = (campaign[campaignID].amountRaised * campaign[campaignID].multiplier) + campaign[campaignID].amountRaised;
        uint amountToSendToStarter = campaign[campaignID].amountPledged - amountToSendTocharity;
        campaign[campaignID].charity.transfer(amountToSendTocharity);
        campaign[campaignID].benefactor.transfer(amountToSendToStarter);
        
    }
    
    function contributeToDonation (uint campaignID) payable {
        require (msg.value > 0);
        require (campaign[campaignID].active = true);
        campaignIDsDonatedToByUser[msg.sender].push(campaignID);
        addressToCampaignIDToFundsDonated[msg.sender][campaignID] += msg.value;
        
        campaignIDtoDonationNumberToDonation[campaignID][campaign[campaignID].donationsReceived].donator = msg.sender;
        campaignIDtoDonationNumberToDonation[campaignID][campaign[campaignID].donationsReceived].amount = msg.value;
        campaignIDtoDonationNumberToDonation[campaignID][campaign[campaignID].donationsReceived].timeSent = now;
        
        campaign[campaignID].donationsReceived++;
        totalDonations++;
        totalETHraised += msg.value;
        campaign[campaignID].amountRaised += msg.value;
        if (campaign[campaignID].amountRaised >= (campaign[campaignID].amountPledged / campaign[campaignID].multiplier)) {
            // Target reached
            campaign[campaignID].charity.transfer(campaign[campaignID].amountRaised + campaign[campaignID].amountPledged);
            campaign[campaignID].active = false;
            campaign[campaignID].successful = true;
        }
    }
    
    function adjustMinimumPledgeAmount (uint newMinimum) onlyOwner {
        require (newMinimum > 0);
        minimumPledgeAmount = newMinimum;
    }
    
    // Below are view functions that an external contract can call to get information on a campaign ID or user
    
    function returnHowMuchMoreETHNeeded (uint campaignID) view returns (uint) {
        return (campaign[campaignID].amountPledged / campaign[campaignID].multiplier - campaign[campaignID].amountRaised);
    }
    
    function generalInfo() view returns (uint, uint, uint) {
        return (totalCampaigns, totalDonations, totalETHraised);
    }
    
    function lookupDonation (uint campaignID, uint donationNumber) view returns (address, uint, uint) {
        return (campaignIDtoDonationNumberToDonation[campaignID][donationNumber].donator, campaignIDtoDonationNumberToDonation[campaignID][donationNumber].amount, campaignIDtoDonationNumberToDonation[campaignID][donationNumber].timeSent);
    }
    
    // Below two functions have to be split into two parts, otherwise there are call-stack too deep errors
    
    function lookupCampaignPart1 (uint campaignID) view returns (address, address, uint, uint, uint) {
        return (campaign[campaignID].benefactor, campaign[campaignID].charity, campaign[campaignID].amountPledged, campaign[campaignID].amountRaised,campaign[campaignID].donationsReceived);
    }
    
    function lookupCampaignPart2 (uint campaignID) view returns (uint, bool, bool, uint, bytes32) {
        return (campaign[campaignID].multiplier, campaign[campaignID].active, campaign[campaignID].successful, campaign[campaignID].timeStarted, campaign[campaignID].description);
    }
    
    // Below functions are probably not necessary, but included just in case another contract needs this information in future
    
    function lookupUserDonationHistoryByCampaignID (address user) view returns (uint[]) {
        return (campaignIDsDonatedToByUser[user]);
    }
    
    function lookupAmountUserDonatedToCampaign (address user, uint campaignID) view returns (uint) {
        return (addressToCampaignIDToFundsDonated[user][campaignID]);
    }
    
}
