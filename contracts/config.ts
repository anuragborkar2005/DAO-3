import CampaignFactory from "@/contracts/abis/CampaignFactory.json";
import DAOGovernor from "@/contracts/abis/DAOGovernor.json";
import GovernanceToken from "@/contracts/abis/GovernanceToken.json";
import MockUSDC from "@/contracts/abis/MockUSDC.json";
import Campaign from "@/contracts/abis/Campaign.json";

export const CONTRACT_ADDRESSES = {
    CampaignFactory: "0x0000000000000000000000000000000000000000",
    DAOGovernor: "0x0000000000000000000000000000000000000000",
    GovernanceToken: "0x0000000000000000000000000000000000000000",
    MockUSDC: "0x0000000000000000000000000000000000000000",
} as const;

export const ABIS = {
    CampaignFactory: CampaignFactory.abi,
    DAOGovernor: DAOGovernor.abi,
    GovernanceToken: GovernanceToken.abi,
    MockUSDC: MockUSDC.abi,
    Campaign: Campaign.abi,
};

export type ChainId = keyof typeof CONTRACT_ADDRESSES;
