module.exports = {
    apps: [
        {
            name: "dg-counter-server",
            script: "server/server.js",
            instances: "max",
            exec_mode: "cluster",
            env: {
                JWT_SECRET: process.env.JWT_SECRET,
                RESEND_API_KEY: process.env.RESEND_API_KEY,
                MONGO_USER: process.env.MONGO_USER,
                MONGO_PASSWORD: process.env.MONGO_PASSWORD,
                PORT: process.env.PORT,
                MONGO_URI: process.env.MONGO_URI,
                NODE_ENV: process.env.NODE_ENV,
                FROM_EMAIL: process.env.FROM_EMAIL,
            },
        },
    ],
};
