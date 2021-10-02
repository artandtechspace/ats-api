module.exports = {
    apps: [{
        script: 'server.js',
        watch: '.'
    }],

    deploy: {
        production: {
            user: 'api',
            host: ["SSH_HOSTMACHINE", "192.168.0.14", "192.168.0.15"],
            ref: 'origin/master',
            repo: 'https://github.com/Projektlabor-Rheine/ats-api/',
            path: '/var/www/ats-api/',
            'pre-deploy-local': '',
            'post-deploy': 'cross-env NODE_ENV=production',
            'pre-setup': ''
        }
    }
};
