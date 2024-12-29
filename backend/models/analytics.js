const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    sessions: {
        type: Number,
        required: true,
        min: 0,
    },
    users: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;
