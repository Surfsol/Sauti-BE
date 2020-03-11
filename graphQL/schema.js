const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Date

  type TraderUser {
    id: Int
    gender: String
    age: String
    education: String
    crossing_freq: String
    produce: String
    primary_income: String
    language: String
    country_of_residence: String
  }

  type TraderSession {
    id: Int
    gender: String
    age: String
    education: String
    crossing_freq: String
    produce: String
    primary_income: String
    language: String
    country_of_residence: String
    procedurecommodity: String
    procedurecommoditycat: String
    proceduredest: String
    procedurerequireddocument: String
    procedurerelevantagency: String
    procedureorigin: String
    commoditycountry: String
    commoditymarket: String
    commoditycat: String
    commodityproduct: String
    exchangedirection: String
    created_date: Date
  }

  type DatabankUser {
    id: Int
    email: String
    password: String
    tier: UserTier
    interest: String
    organization: String
    job_position: String
    country: String
    token: String
    organization_type: OrganizationType
    subscription_id: String
  }

  enum UserTier {
    FREE
    PAID
    ADMIN
    GOV_ROLE
  }

  enum OrganizationType {
    GOVERNMENT
    NGO
    RESEARCH
    OTHER
  }

  type Error {
    message: String
  }

  union EditedUserOrError = DatabankUser | Error
  union DeletedUserOrError = DatabankUser | Error
  union UpdateUserToFree = DatabankUser | Error

  input newTraderInput {
    id: Int
    gender: String
    age: String
    education: String
    crossing_freq: String
    produce: String
    primary_income: String
    language: String
    country_of_residence: String
  }

  input newTraderSessionInput {
    id: Int
    gender: String
    age: String
    education: String
    crossing_freq: String
    produce: String
    primary_income: String
    language: String
    country_of_residence: String
    procedurecommodity: String
    procedurecommoditycat: String
    proceduredest: String
    procedurerequireddocument: String
    procedurerelevantagency: String
    procedureorigin: String
    commoditycountry: String
    commoditymarket: String
    commoditycat: String
    commodityproduct: String
    exchangedirection: String
    created_date: Date
  }

  input newEditUserInput {
    id: Int!
    email: String
    password: String
    tier: UserTier
    interest: String
    organization: String
    job_position: String
    country: String
    organization_type: OrganizationType
    subscription_id: String
  }

  input newUpdateUserToFreeInput {
    id: Int
    email: String!
    subscription_id: String
  }

  input newDeleteUserInput {
    id: Int!
    email: String
  }

  input newRegisterInput {
    id: Int
    email: String!
    password: String!
    tier: UserTier!
    interest: String
    organization: String
    job_position: String
    country: String
    organization_type: OrganizationType!
  }

  input newLoginInput {
    email: String!
    password: String!
  }

  input Email {
    email: String
  }

  type Query {
    tradersUsers(input: newTraderInput): [TraderUser]!
    sessionsData(input: newTraderSessionInput): [TraderSession]!
    databankUsers: [DatabankUser]!
    databankUser(input: Email!): DatabankUser!
  }

  type Mutation {
    register(input: newRegisterInput!): DatabankUser!
    login(input: newLoginInput!): DatabankUser!
    editUser(input: newEditUserInput!): EditedUserOrError!
    deleteUser(input: newDeleteUserInput!): DeletedUserOrError!
    updateUserToFree(input: newUpdateUserToFreeInput!): UpdateUserToFree!
  }
`;

module.exports = typeDefs;
