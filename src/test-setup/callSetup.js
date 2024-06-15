require("ts-node");

const { setUp } = require("./setup");

module.exports = async function () {
  await setUp();
};
