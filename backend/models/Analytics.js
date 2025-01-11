const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    date: { type: String, required: true },
    sessions: { type: Number, required: true },
    newUsers: { type: Number, required: true }, // Update to newUsers
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;
