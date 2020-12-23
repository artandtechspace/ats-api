const signIn = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string",
            format: "email",
            errorMessage: {
                format: "Field 'email' incorrect",
                type: "Field 'email' should be a string"
            }
        },
        password: {
            type: "string",
            errorMessage: {
                type: "Field 'password' should be a string"
            }
        }
    }
};

const signUp = {
    type: "object",
    required: ["email", "firstname","lastname","password"],
    properties: {
        email: {
            type: "string",
            format: "email",
            errorMessage: {
                format: "Field 'email' incorrect",
                type: "Field 'email' should be a string"
            }
        },
        firstname: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            errorMessage: {
                type: "Field 'firstname' should be a string"
            }
        },
        lastname: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            errorMessage: {
                type: "Field 'lastname' should be a string"
            }
        },
        password: {
            type: "string",
            errorMessage: {
                type: "Field 'password' should be a string"
            }
        }
    }
};

const refreshTokens = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        refreshToken: {
            type: "string",
            pattern: "^(.*)::(.*)$",
            errorMessage: {
                type: "Field 'refreshToken' should be a string",
                pattern: "Incorrect format 'refreshToken'"
            }
        }
    }
};

const restorePassword = {
    type: "object",
    required: ["email"],
    properties: {
        email: {
            type: "string",
            format: "email",
            errorMessage: {
                format: "Field 'email' incorrect",
                type: "Field 'email' should be a string"
            }
        }
    }
};

const confirmRestorePassword = {
    type: "object",
    required: ["password"],
    properties: {
        password: {
            type: "string",
            errorMessage: {
                type: "Field 'password' should be a string"
            }
        }
    }
};

export default {
    signIn,
    signUp,
    refreshTokens,
    restorePassword,
    confirmRestorePassword
};