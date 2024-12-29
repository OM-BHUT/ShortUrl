// const { google } = require("googleapis");
// const mongoose = require("mongoose");
// const Analytics = require("../models/analytics");
// require("dotenv").config({ path: "../.env" });
// const fs = require('fs');
// const path = require('path');
// const relativePath = "../keys/orbital-caldron-446205-k7-2dc2c3ecbfcd.json";
// const absolutePath = path.join(__dirname, relativePath);
//
// console.log(absolutePath)
//
// const auth = new google.auth.GoogleAuth({
//     keyFile: absolutePath,
//     scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
// });
//
// (async () => {
//     const authClient = await auth.getClient();
//     const credentials = authClient.credentials;
//     console.log(credentials)
// })();



// async function fetchAnalyticsData() {
//     const analyticsData = google.analyticsdata("v1beta");
//     const authClient = await auth.getClient();
//
//     try {
//         const response = await analyticsData.properties.runReport({
//             auth: authClient,
//             property: `properties/${process.env.PROPERTY_ID}`, // Replace with your property ID
//             requestBody: {
//                 dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
//                 metrics: [{ name: "sessions" }, { name: "users" }],
//                 dimensions: [{ name: "date" }],
//             },
//         });
//
//         console.log("Analytics Data:", response.data.rows);
//
//         // Save data to MongoDB
//         const formattedData = response.data.rows.map((row) => ({
//             date: row.dimensionValues[0].value,
//             sessions: parseInt(row.metricValues[0].value),
//             users: parseInt(row.metricValues[1].value),
//         }));
//
//         await Analytics.insertMany(formattedData);
//         console.log("Data saved to MongoDB");
//     } catch (err) {
//         console.error("Error fetching data:", err.response?.data || err.message);
//         console.error("Ensure the PROPERTY_ID and permissions are correct.");
//     }
// }
//
// fetchAnalyticsData();

// async function listMetadata() {
//     const analyticsAdmin = google.analyticsadmin("v1beta");
//     const authClient = await auth.getClient();
//
//     try {
//         // Fetch available metrics and dimensions
//         const response = await analyticsAdmin.properties.get({
//             auth: authClient,
//             name: `properties/${process.env.PROPERTY_ID}`, // Replace with your property ID
//         });
//
//         console.log("Property Metadata:", response.data);
//     } catch (err) {
//         console.error("Error fetching metadata:", err.response?.data || err.message);
//     }
// }
//
// listMetadata();


const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const path = require("path");

const keyPath = path.join(__dirname, "../keys/orbital-caldron-446205-k7-3976f0bb876a.json");
const authClient = new JWT({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const analytics = google.analyticsdata({
    version: "v1beta",
    auth: authClient,
});

(async () => {
    try {
        const response = await analytics.properties.runReport({
            property: process.env.PROPERTY_ID,
            requestBody: {
                dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
                metrics: [{ name: "sessions" }, { name: "users" }],
                dimensions: [{ name: "date" }],
            },
        });
        console.log(response.data);
    } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
    }
})();

