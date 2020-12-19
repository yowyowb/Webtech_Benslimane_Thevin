const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const Users = require('../models/users')
const { requestWrapper, HttpNotAuthenticatedError } = require('../errors')

const fetchKeyFromOpenIDServer = async (jwks_uri, token) => {
    const header = JSON.parse(Buffer.from(
        token.split('.')[0], 'base64'
        ).toString('utf-8')
    )
    const {publicKey, rsaPublicKey} = await jwksClient({
        jwksUri: jwks_uri
    }).getSigningKeyAsync(header.kid)
    return publicKey || rsaPublicKey
}

module.exports = {
    authenticator: ({jwks_uri} = {}) => {
        if (!jwks_uri) {
            throw Error('Invalid Settings: jwks_uri is required')
        }
        return requestWrapper(async (req, res, next) => {
            if (!req.headers['authorization']) {
                throw new HttpNotAuthenticatedError('Missing Access Token')
            }
            const header = req.headers['authorization']
            const [type, access_token] = header.split(' ')
            if (type !== 'Bearer') {
                throw new HttpNotAuthenticatedError('Authorization Not Bearer')
            }
            const key = await fetchKeyFromOpenIDServer(jwks_uri, access_token)
            // Validate the payload
            try {
                const payload = jwt.verify(access_token, key)
                if (!payload.email) {
                    next(new HttpNotAuthenticatedError('Invalid Access Token'));
                }
                req.user = {
                    email: payload.email
                }
                next()
            } catch (err) {
                throw new HttpNotAuthenticatedError('Invalid Access Token');
            }
        })
    },

    userUpdater: async (req, res, next) => {
        if (req.user) {
            try {
                const users = await Users.list();
                let user = users.find(user => user.email === req.user.email);
                if (user) {
                    user = await Users.update(user.id, req.user)
                } else {
                    user = await Users.create(req.user);
                }
                req.user = user;
                next();
            } catch (error) {
                next(error)
            }
        }
    }
}
