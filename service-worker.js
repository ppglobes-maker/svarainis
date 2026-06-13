self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || "ATrust Wallet";
  const options = {
    body: data.body || "New wallet activity",
    icon: "./assets/icon-192.png",
    badge: "./assets/icon-192.png",
    tag: data.tag || "atrust-wallet",
    data: {
      url: data.url || "./",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || "./", self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        const existingClient = clientList.find((client) => client.url.startsWith(self.location.origin));
        if (existingClient) {
          existingClient.focus();
          return existingClient.navigate(targetUrl);
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
