pragma solidity ^0.4.2;

contract DonationMatcher {
    
    struct DonationsToMatch {
        address sender;
        address recipient;
        uint amountToTransfer;
        uint amountRaised;
        uint donationsReceived;
        uint multiplier; // If this was 5, for example, other donators would only need to put up 1/5th of tne amount the person creating the donation does
        bool active;
        bool successful;
        uint timeStarted;
        bytes32 description;
    }
    
    mapping (uint => DonationsToMatch) public donation;
    
    mapping (address => uint[]) public campaignsStartedByUser;
    
    // Keep record of donations for each user to each campaign, so two extra mappings for campaign ID's contributed to, and amounts
    
    mapping (address => mapping(uint => uint)) public addressToCampaignIDToFundsDonated;
    
    mapping (address => uint[]) public campaignIDsDonatedToByUser; // Will contain duplicates if a user donates to a campaign twice
    
    uint public totalCampaigns;
    
    uint public totalDonations;
    
    function createDonation (address recipient, uint multiplier, bytes32 description) payable {
        require (msg.value > 0);
        require (multiplier > 0);
        donation[totalCampaigns].sender = msg.sender;
        donation[totalCampaigns].recipient = recipient;
        donation[totalCampaigns].description = description;
        donation[totalCampaigns].multiplier = multiplier;
        donation[totalCampaigns].timeStarted = now;
        donation[totalCampaigns].amountToTransfer = msg.value;
        donation[totalCampaigns].active = true;
        campaignsStartedByUser[msg.sender].push(totalCampaigns);
        totalCampaigns++;
    }
    
    function cancelDonation (uint donationID) {
        // Say the person starting it gets half their funds back? hmm
        // OR: the amount raised from (others * multiplier + raised from others) goes to the recipient, rest gets refunded to starter of the donation
        require (msg.sender == donation[donationID].sender);
        donation[donationID].active = false;
        donation[donationID].successful = false;
        uint amountToSendToRecipient = (donation[donationID].amountRaised * donation[donationID].multiplier) + donation[donationID].amountRaised;
        uint amountToSendToStarter = donation[donationID].amountToTransfer - amountToSendToRecipient;
        donation[donationID].recipient.transfer(amountToSendToRecipient);
        donation[donationID].sender.transfer(amountToSendToStarter);
        
    }
    
    function contributeToDonation (uint donationID) payable {
        require (msg.value > 0);
        require (donation[donationID].active = true);
        campaignIDsDonatedToByUser[msg.sender].push(donationID);
        addressToCampaignIDToFundsDonated[msg.sender][donationID] += msg.value;
        totalDonations++;
        donation[donationID].amountRaised += msg.value;
        if (donation[donationID].amountRaised >= (donation[donationID].amountToTransfer / donation[donationID].multiplier)) {
            // Target reached
            donation[donationID].recipient.transfer(donation[donationID].amountRaised + donation[donationID].amountToTransfer);
            donation[donationID].active = false;
            donation[donationID].successful = true;
        }
    }
    
    function returnHowMuchMoreETHNeeded (uint donationID) view returns (uint) {
        return (donation[donationID].amountToTransfer / donation[donationID].multiplier - donation[donationID].amountRaised);
    }
    
}
