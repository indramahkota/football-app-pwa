var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BKrlDhc0zQnMTPFjLdezIyRaxklJTEegifGWrNHhN3TvHkNVSAI-jYwqRUhigqeqG42C3mFnJL7uJ-JUpGzWbCs",
  privateKey: "4AOIY9S1JWGbubn6LfP4PdJ4EKlRJ9wMfZ3A-4Y4LQ4",
};

webPush.setVapidDetails(
  "mailto:indramahkota1@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/fpS9mQVvNrc:APA91bHjiAV2TJtlFXITdeP0QzbUPGkJW4S4TQWGjS3Qee3U-pRARD5Uty0iC266IkkbYqB5VSq7OXpzlpYkr_fBI9vxnW-mVcEyeMNkAJs-JkrHLP-Kfdqt0yNZnJgxNke1-2JTkByV", keys: { p256dh: "BFfBy4PWrCwFPoa7AWf/O2BqdpOINMM0P8iZkTD32mRNnGFelMVWBTk2bn5YikUCpdIeRuAtq0jwLu7qHk8jsWw=", auth: "/Pm/XARVININ1yu6jMyX4w=="}
};

var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";
var options = {
  gcmAPIKey: "792532488211",
  TTL: 60,
};

webPush
  .sendNotification(pushSubscription, payload, options)
  .then(console.log("Sukses"))
  .catch((err) => console.log(`ErrCode: ${err.statusCode} Err: ${err}`));
