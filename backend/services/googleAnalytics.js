require("dotenv").config({path: '../.env'});
const { google } = require("googleapis");
const { JWT, auth} = require("google-auth-library");
const path = require("path");
const Analytics = require("../models/Analytics");
const mongoose = require("mongoose");

const keyPath = path.join(__dirname, "../keys/orbital-caldron-446205-k7-3976f0bb876a.json");
console.log(process.env.PROPERTY_ID);
const authClient = new JWT({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const analytics = google.analyticsdata({
    version: "v1beta",
    auth: authClient,
});



async function fetchAnalyticsData(){

    try {
        const response = await analytics.properties.runReport({
            property: `properties/${process.env.PROPERTY_ID}`,
            requestBody: {
                dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
                metrics: [{ name: "sessions" }, { name: "newUsers" }],
                dimensions: [{ name: "date" }],
            },
        });

        // Format the data
        const rows = response.data.rows || [];
        const formattedData = rows.map(row => ({
            date: row.dimensionValues[0].value,
            sessions: parseInt(row.metricValues[0].value),
            newUsers: parseInt(row.metricValues[1].value),
        }));
        await mongoose.connect(process.env.DBURL);
        await Analytics.insertMany(formattedData);
        console.log("Data saved to MongoDB");

    } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
    }
}

module.exports = {fetchAnalyticsData};

