const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "YouTube Playlist Downloader API",
            version: "1.0.0",
            description:
                "REST API to fetch YouTube playlist metadata and downloadable video information.",
            contact: {
                name: "API Support",
            },
        },


        servers: [
            {
                url: "http://localhost:4000",
                description: "Development",
            },
            {
                url: "https://livehosteddoman.com",
                description: "Production",
            },
        ],

        tags: [
            {
                name: "Health",
            },
            {
                name: "Playlist",
            },
        ],
    },

    apis: ["./**/*.js"],
};

module.exports = swaggerJsdoc(options);