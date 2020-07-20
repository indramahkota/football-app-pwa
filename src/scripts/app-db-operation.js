import { openDB } from "idb";

const getFavoriteTeamDatabase = async () => {
    return await openDB("FootballAppIndraMahkota", 1, {
        upgrade: db => {
            if(!db.objectStoreNames.contains("teamfavorites")) {
                const store = db.createObjectStore("teamfavorites", {keyPath: "teamId"});
                store.createIndex("nama", "nama", { unique: false });
                store.createIndex("area", "area", { unique: false });
                store.createIndex("image", "image", { unique: false });
            }
        }
    });
}

/* prefix await before return a Promise */
const createFavoriteTeamData = async data => {
    const db = await getFavoriteTeamDatabase();
    return await db.add("teamfavorites", data);
}

const getFavoriteTeamDataById = async teamId => {
    const db = await getFavoriteTeamDatabase();
    return await db.get("teamfavorites", teamId);
}

const getAllFavoriteTeamData = async () => {
    const db = await getFavoriteTeamDatabase();
    return await db.getAll("teamfavorites");
}

const updateFavoriteTeamDataById = async data => {
    const db = await getFavoriteTeamDatabase();
    return await db.put("teamfavorites", data);
}

const deleteFavoriteTeamDataById = async teamId => {
    const db = await getFavoriteTeamDatabase();
    return await db.delete("teamfavorites", teamId);
}

export { createFavoriteTeamData, getFavoriteTeamDataById, getAllFavoriteTeamData, updateFavoriteTeamDataById, deleteFavoriteTeamDataById };