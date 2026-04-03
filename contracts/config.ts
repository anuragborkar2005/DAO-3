import CampaignFactory from "@/contracts/abis/CampaignFactory.json";
import DAOGovernor from "@/contracts/abis/DAOGovernor.json";
import GovernanceToken from "@/contracts/abis/GovernanceToken.json";
import MockUSDC from "@/contracts/abis/MockUSDC.json";
import Campaign from "@/contracts/abis/Campaign.json";
import MilestoneEscrow from "@/contracts/abis/MilestoneEscrow.json";

export const CONTRACT_ADDRESSES = {
    CampaignFactory: "0xc02E3c4ECeb06Ac4c4605b2a76624FCb994DA985",
    DAOGovernor: "0xBABa3290a6c1542FAcDAd43267a4d8D0Ee95d2da",
    GovernanceToken: "0x8b1DB0ABaB5e6a67825D69550B1fB51a378e24F5",
    MockUSDC: "0x21826486b8F61f46AF4AdC1b064C1b84E4945114",
    Timelock: "0x64554c9C848E317E8fa0cfa29D1775cd5c86fd99",
} as const;

export const ABIS = {
    CampaignFactory: CampaignFactory.abi,
    DAOGovernor: DAOGovernor.abi,
    GovernanceToken: GovernanceToken.abi,
    MockUSDC: MockUSDC.abi,
    Campaign: Campaign.abi,
    MilestoneEscrow: MilestoneEscrow.abi,
};

export type ChainId = keyof typeof CONTRACT_ADDRESSES;
