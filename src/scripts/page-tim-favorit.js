import { getAllFavoriteTeamData } from "./app-db-operation.js";
import generateFavoriteTimContent from "./gen-tim-favorit-konten.js";

const setTimFavoritPage = () => {
    let parent = document.querySelector("#pageContent");

    getAllFavoriteTeamData()
        .then(data => generateFavoriteTimContent(parent, data))
        .catch(() => {
            parent.innerHTML = `
                <div class="row">
                    <div class="col s12">
                        <div class="card card-content padding-10">
                            <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                        </div>
                    </div>
                </div>
            `;
        });
}

export default setTimFavoritPage;