const braintree = require('braintree');

let localEnvironment, gateway;


if (
    !process.env.BRAINTREE_ENVIRONMENT ||
    !process.env.BRAINTREE_MERCHANT_ID ||
    !process.env.BRAINTREE_PUBLIC_KEY ||
    !process.env.BRAINTREE_PRIVATE_KEY
) {
    throw new Error(
        'Cannot find necessary environment variables. See https://github.com/braintree/braintree_express_example#setup-instructions for instructions'
    );
}

localEnvironment = `${process.env.BRAINTREE_ENVIRONMENT.charAt(
    0
).toUpperCase()}${process.env.BRAINTREE_ENVIRONMENT.slice(1)}`;

gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment[localEnvironment],
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
gateway.config.timeout = 10000;

module.exports = gateway;