module.exports = {
    apps: [
        {
            name: "dg-counter-server",
            script: "server/server.js",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
