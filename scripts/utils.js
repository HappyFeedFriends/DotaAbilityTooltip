const { findSteamAppByName, SteamNotFoundError } = require("@moddota/find-steam-app");
const packageJson = require("../package.json");

module.exports.getAddonName = () => {
    return packageJson.name.toLowerCase();
};

module.exports.getDotaPath = async () => {
    try {
        return await findSteamAppByName("dota 2 beta");
    } catch (error) {
        if (!(error instanceof SteamNotFoundError)) {
            throw error;
        }
    }
};