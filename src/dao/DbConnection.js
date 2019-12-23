async function CreateDbConnection() {
    return new Promise((resolve, reject) => {
        const req = window.indexedDB.open("tradeit", 5);

        req.onerror = function (event) {
            return reject(Error(event.error.message));
        };

        req.onsuccess = (event) => {
            const db = req.result;
            return resolve(db);
        };

        // Database migration
        req.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Create an objectStore to hold information about trades.
            const tradesStore = db.createObjectStore("trades", {keyPath: "id", autoIncrement: true});
            tradesStore.createIndex("stock_name", "stock_name", {unique: false});
            tradesStore.createIndex("quantity", "quantity", {unique: false});
            tradesStore.createIndex("created_at", "created_at", {unique: false});

            // Create an objectStore to hold information about stock&net position.
            const stocksStore = db.createObjectStore("stocks", {keyPath: "stock_name"});
            stocksStore.createIndex("net_position", "net_position", {unique: false});
        };
    });
}

export default CreateDbConnection;