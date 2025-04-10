module.exports = {
    apps: [
        {
            name: "dg-counter-server",
            script: "server/server.js",
            instances: "max",
            exec_mode: "cluster",
            cwd: "/var/www/dg-tracker/current",
        },
    ],
};
