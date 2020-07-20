const getCompetitionId = urlParameter => {
    let urlSearchParams = new URLSearchParams(urlParameter);
    return Number(urlSearchParams.get("competitionId"));
}

const getTeamId = urlParameter => {
    let urlSearchParams = new URLSearchParams(urlParameter);
    return Number(urlSearchParams.get("teamId"));
}

/* Mengurutkan data berdasarkan abjad pada json value */
/* referensi: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/ */
const compareValues = (key, order = "asc") => {
    return (a, b) => {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
      const comparison = a[key].localeCompare(b[key]);
      return ((order === "desc") ? (comparison * -1) : comparison);
    };
}

const getFormattedDate = utcDate => {
    let weekday = new Array(7);
    weekday[0] = "Minggu";
    weekday[1] = "Senin";
    weekday[2] = "Selasa";
    weekday[3] = "Rabu";
    weekday[4] = "Kamis";
    weekday[5] = "Jum'at";
    weekday[6] = "Sabtu";

    let monthId = new Array(12);
    monthId[0] = "Januari";
    monthId[1] = "Februari";
    monthId[2] = "Maret";
    monthId[3] = "April";
    monthId[4] = "Mei";
    monthId[5] = "Juni";
    monthId[6] = "Juli";
    monthId[7] = "Agustus";
    monthId[8] = "September";
    monthId[9] = "Oktober";
    monthId[10] = "November";
    monthId[11] = "Desember";

    let fulldate = new Date(utcDate);
    const day = weekday[fulldate.getDay()];
    const date = fulldate.getUTCDate();
    const month = monthId[fulldate.getUTCMonth()];
    const year = fulldate.getUTCFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

const showToast = message => {
    M.toast({html: message, displayLength: 1500});
}

const showOfflineToast = () => {
    dismissOfflineToast();
    M.toast({html: `<span>Anda saat ini sedang offline!</span><button id="toast-dismiss-button" class="btn-flat toast-action">Abaikan</button>`, displayLength: Infinity, inDuration: 0, outDuration: 0});
    document.querySelector("#toast-dismiss-button").addEventListener("click", () => dismissOfflineToast());
}

const dismissOfflineToast = () => {
    M.Toast.dismissAll();
}

export { getCompetitionId, getTeamId, compareValues, getFormattedDate, showToast, showOfflineToast, dismissOfflineToast };