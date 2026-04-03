import CampaignFactory from "@/contracts/abis/CampaignFactory.json";
import DAOGovernor from "@/contracts/abis/DAOGovernor.json";
import GovernanceToken from "@/contracts/abis/GovernanceToken.json";
import MockUSDC from "@/contracts/abis/MockUSDC.json";
import Campaign from "@/contracts/abis/Campaign.json";

export const CONTRACT_ADDRESSES = {
    CampaignFactory: "0xcFC9B239C31ed97Bfccb8CCe6937D9892914A841",
    DAOGovernor: "0x5a0588A774e5Dd6C3e3caD2bdEc3Cf2C3655C904",
    GovernanceToken: "0x8a4dcd878E44d8f7a4A823920ef53Cfd00825a5c",
    MockUSDC: "0xDf408c4fDEF30c54bC2838B681FD4323503afF60",
} as const;

export const ABIS = {
    CampaignFactory: CampaignFactory.abi,
    DAOGovernor: DAOGovernor.abi,
    GovernanceToken: GovernanceToken.abi,
    MockUSDC: MockUSDC.abi,
    Campaign: Campaign.abi,
};

export type ChainId = keyof typeof CONTRACT_ADDRESSES;
