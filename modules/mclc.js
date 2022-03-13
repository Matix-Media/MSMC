const msmc = require("..");
const BE = require("./backEnd");
function getUUID() {
    var result = ""
    for (var i = 0; i <= 4; i++) {
        result += (Math.floor(Math.random() * 16777216) + 1048576).toString(16);
        if (i < 4) result += "-"
    }
    return result;
}
console.log(getUUID())
module.exports = {
    //Converts a result or player profile object to a mclc login object
    getAuth(profile) {
        if (profile.type) {
            if (!profile.profile) {
                throw { error: "Invalid profile" }
            }
            profile = profile.profile;
        }
        return {
            access_token: profile._msmc.mcToken,
            client_token: getUUID(),
            uuid: profile.id,
            name: profile.name,
            meta: {
                xuid: profile.xuid,
                type: "msa",
                demo: profile._msmc.demo
            },
            _msmc: profile._msmc,
            user_properties: "{}"
        };
    },
    //Converts a mclc login object to a msmc profile object
    toProfile(profile) {
        return { "name": profile.name, "xuid": profile.meta ? profile.meta.xuid : null, "id": profile.uuid, "_msmc": profile._msmc };
    },
    //Checks if a mclc login object is still valid
    validate(profile) {
        if (profile._msmc) {
            return msmc.validate(self.toProfile(profile));
        }
        throw "As of the 10th of March 2022. The legacy Mojang authentication endpoints are no longer supported."
    },

    async refresh(profile, updates = console.log, authToken) {
        if (profile._msmc) {
            return self.getAuth(await msmc.refresh(self.toProfile(profile), updates, authToken));
        } else {
            throw "As of the 10th of March 2022. The legacy Mojang authentication endpoints are no longer supported."
        }
    }
}
const self = module.exports;