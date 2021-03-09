const ldapStrategy = require('passport-ldapauth')
const fs = require('fs');

let options = {
    server: {
        url: process.env.LDAP_URL,
        bindDn: process.env.LDAP_BIND_DN,
        bindCredentials: process.env.LDAP_BIND_CREDENTIALS,
        searchBase: process.env.LDAP_SEARCH_BASE,
        searchFilter: process.env.LDAP_SEARCH_FILTER,
        searchAttributes: process.env.LDAP_SEARCH_ATTRIBUTES
    }
}

if (process.env.USE_SECURE) {
    options.server.tlsOptions.ca = [fs.readFileSync(process.env.SECURE_CERT)]
}

const ldapLogin = new ldapStrategy(options)