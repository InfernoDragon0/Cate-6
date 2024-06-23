const { searchItemDatabase } = require("./functions/searchInventoryItem")
const { searchPerkDatabase } = require("./functions/searchPerk")

const functions = {
    gSearchItemDatabase: ({ itemname }) => {
        return searchItemDatabase(itemname)
    },
    gSearchPerkDatabase: ({ itemname }) => {
        return searchPerkDatabase(itemname)
    }

}

module.exports = {
    functions
}