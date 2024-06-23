const https = require('node:https');
let perks = {}

async function searchPerkDatabase(itemname) {
    //just search for the first item in the database that nearly matches
    try {

        //if perk empty
        if (Object.keys(perks).length == 0) {
            //download perk json file from url into perks object
            const url = 'https://raw.githubusercontent.com/Database-Clarity/Live-Clarity-Database/live/descriptions/vaultZero.json';
            //await fetch version
            const res = await fetch(url);
            const data = await res.json();
            perks = data;
            console.log("perk data loaded")
        }
        
        // example data {
//  "644105": {
//     "hash": 644105,
//     "name": "Heavy Ammo Finder",
//     "type": "Armor Mod General",
//     "descriptions": {
//      "en": "Spawns a [heavy]Heavy Ammo Brick upon scoring a Weapon Kill after reaching 100% Counter Progress. Counter is only progressed by Weapon Kills.\nAmmo Finder Bricks grant 27.5%|60%|100% of a Regular Ammo Brick's Pickup Amount with 1|2|3 Mods equipped. Pickup Amount is determined on Brick Spawn.\nCounter Progress on Weapon Kills:\n1.1% to 1.33%. Average of 83.5 Kills.\nProgress Multipliers on Kills:\n• [primary]Primary Weapons: 4.25x\n• [special]Special Weapons: 1.05x\n• Exotic [primary]Primary Weapons: further 1.3?x on top of the Primary Multiplier (total of 5.525?⁠x)\n• Playing Solo: 1.2?⁠x\nRocket-Assisted Sidearms count as Primary Weapons. Eriana's Vow inherits the Exotic Primary Multiplier but is still treated as a Special Weapon.\nAmmo Finder Bricks have less variablity compared to Regular Bricks. (i.e. they can't go as far above or under the average ammo amount granted)"
//     }
//    },}
        
        //filter the json OBJECT to use itemname to match name, then return the description.en
        const perk = Object.entries(perks).filter(([key, value]) => value.name == itemname)
        if (perk.length == 0) {
            console.log("no results found")
            return {   
                success: false,
                reason: "No results found for " + itemname
            }
        }
        else {
            console.log("found")
            console.log(perk[0])
            return {   
                success: true,
                description: perk[0][1].descriptions.en
            }
        }

    }
    catch (err) {
        console.log(err)
        return {
            success: false,
            reason: "An error occurred while searching."
        }
    }
}

const searchPerkDatabaseDeclaration = {
    name: "gSearchPerkDatabase",
    parameters: {
      type: "OBJECT",
      description: "Use this to search the destiny 2 database for weapon and armor perks.",
      properties: {
        itemname: {
          type: "STRING",
          description: "The name of the perk to search for. It must be the full name.",
        },

      },
      required: ["itemname"],
    },
};

module.exports = {
    searchPerkDatabase,
    searchPerkDatabaseDeclaration
}