import BaseRepository from "./BaseRepository";

class TradeRepository extends BaseRepository {
    constructor(transaction) {
        super(transaction);

        this.store = this.transaction.objectStore("trades");
    }

    /**
     * Create a row for a new trade
     */
    add(companyName, quantity) {
        return new Promise((resolve, reject) => {
            const req = this.store.add({
                stock_name: companyName,
                quantity: quantity,
                created_at: new Date()
            });
            req.onsuccess = (event) => {
                resolve(true);
            };
            req.onerror = (event) => {
                reject(event.error.message);
            };
        });
    }
}

export default TradeRepository;
