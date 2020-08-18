const urlBase64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const requestNotifSubcription = () => {
  if("Notification" in window) {
    Notification.requestPermission()
      .then(result => {
        if(result === "denied") {
          console.log("Fitur notifikasi tidak diijinkan.");
          return;
        } else if(result === "default") {
          console.error("Pengguna menutup kotak dialog permintaan ijin.");
          return;
        }
        if("PushManager" in window) {
          navigator.serviceWorker.getRegistration()
            .then(registration =>
              registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BKrlDhc0zQnMTPFjLdezIyRaxklJTEegifGWrNHhN3TvHkNVSAI-jYwqRUhigqeqG42C3mFnJL7uJ-JUpGzWbCs")
              })
            )
            .then(subscribe => {
              console.log(`endpoint: "${subscribe.endpoint}", keys: { p256dh: "${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh"))))}", auth: "${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth"))))}"}`);
            })
            .catch(e =>
              console.error("Tidak dapat melakukan subscribe ", e.message)
            );
        } else {
          console.log("PushManager tidak didukung browser ini.");
        }
      });
  } else {
    console.log("PushManager tidak didukung browser ini.");
  }
}

if("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => {
        console.log("Pendaftaran ServiceWorker berhasil");
        setTimeout(requestNotifSubcription, 3000);
      })
      .catch(() => {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker tidak didukung browser ini.");
}