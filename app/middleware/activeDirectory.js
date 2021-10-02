//TODO: change Password GraphApi
//TODO: createUser GraphApi
//TODO: createGroup Graph
//TODO: checkIfUserIdInGroup
//TODO:

const jwt = require('jsonwebtoken');
const msal = require('@azure/msal-node');
const graph = require('@microsoft/microsoft-graph-client');
const {TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
require('isomorphic-fetch');
const {ClientSecretCredential} = require("@azure/identity");

const config = {
    auth: {
        clientId: process.env.AD_GRAPHAPI_ID,
        authority: "https://login.microsoftonline.com/" + process.env.AD_GRAPHAPI_TENANT,
        clientSecret: process.env.AD_GRAPHAPI_SECRET,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

const getAccessToken = async () => {
    if (global.authProvider !== undefined) {
        let current_time = Date.now() / 1000 - 10;
        if (!jwt.decode(global.authProvider.accessToken).exp < current_time) {
            return global
        }
    }
    const credential = new ClientSecretCredential(process.env.AD_GRAPHAPI_TENANT, process.env.AD_GRAPHAPI_ID, process.env.AD_GRAPHAPI_SECRET);
    return new TokenCredentialAuthenticationProvider(credential, {
        scopes: ["https://graph.microsoft.com/.default"],
        skipCache: true,
    });
}

module.exports = {
    /*
    {
      accountEnabled: true,
  displayName: 'Adele Vance',
  givenName:'Adele'
  mailNickname: 'AdeleV',
  userPrincipalName: 'AdeleV@ats-rheine.de',
  otherMails
  passwordProfile: {
    forceChangePasswordNextSignIn: true,
    password: 'Index123!'
  }
     */
    async createUser(user) {
        return new Promise(async (resolve, reject) => {
            const authProvider = await getAccessToken()
            const client = await graph.Client.initWithMiddleware({
                debugLogging: false,
                authProvider
                // Use the authProvider object to create the class.
            })
            await client.api('/user')
                .post(user)
                .then((res) => {
                    return resolve(res)
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    },


    async createGroup(group) {
        return new Promise(async (resolve, reject) => {
            const authProvider = await getAccessToken()
            const client = await graph.Client.initWithMiddleware({
                debugLogging: false,
                authProvider
                // Use the authProvider object to create the class.
            })
            await client.api('/groups')
                .post(group)
                .then((res) => {
                    return resolve(res)
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    },

    async checkMemberGroup(memberId, groupId) {
        return new Promise(async (resolve, reject) => {
            const authProvider = await getAccessToken()
            const client = await graph.Client.initWithMiddleware({
                debugLogging: false,
                authProvider
            })
            await client.api('/groups/' + groupId + '/members')
                .get()
                .then((res) => {
                    res.value.forEach(item => {
                        console.log(item.id, memberId)
                        if (item.id === memberId) return resolve(true)
                    })
                    return resolve(false)
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    }
}
