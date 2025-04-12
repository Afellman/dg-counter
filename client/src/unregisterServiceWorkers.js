// Script to forcefully unregister all service workers

// Immediately execute when this script loads
(function () {
    console.log("Checking for service worker registrations to unregister...");

    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
                if (registrations.length > 0) {
                    console.log(`Found ${registrations.length} service worker(s) to unregister`);

                    for (let registration of registrations) {
                        registration
                            .unregister()
                            .then((success) => {
                                if (success) {
                                    console.log("Successfully unregistered service worker");
                                } else {
                                    console.warn("Service worker unregistration failed");
                                }
                            })
                            .catch((err) => {
                                console.error("Error unregistering service worker:", err);
                            });
                    }
                } else {
                    console.log("No service workers found to unregister");
                }
            })
            .catch((error) => {
                console.error("Error getting service worker registrations:", error);
            });
    } else {
        console.log("Service workers not supported in this browser");
    }
})();

export default {};
