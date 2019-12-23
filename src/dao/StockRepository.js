import BaseRepository from "./BaseRepository";

class StockRepository extends BaseRepository {
    constructor(transaction) {
        super(transaction);

        this.store = this.transaction.objectStore("stocks");
    }

    /**
     * Retrieve all stocks
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            const req = this.store.getAll();
            req.onsuccess = (event) => {
                const stocks = event.target.result;
                resolve(stocks);
            };
            req.onerror = (event) => {
                reject(event.error.message);
            };
        });
    }

    /**
     * If the stock name exists, just update the quantity, or else create a new row of stock
     */
    async updateStock(stockName, quantity) {
        return new Promise((resolve, reject) => {
            this.store = this.transaction.objectStore("stocks");
            const req = this.store.get(stockName);

            req.onsuccess = (event) => {
                const stock = event.target.result;
                if (!stock) {
                    const req = this.store.add({
                        stock_name: stockName,
                        net_position: quantity
                    });
                    req.onsuccess = (event) => {
                        resolve(true);
                    };
                    req.onerror = (event) => {
                        reject(event.error.message);
                    };
                } else {
                    stock.net_position = StockRepository.calculateNetPosition(stock, quantity);
                    const req = this.store.put(stock);
                    req.onsuccess = (event) => {
                        resolve(true);
                    };
                    req.onerror = (event) => {
                        reject(event.error.message);
                    };
                }
            };
            req.onerror = (event) => {
                reject(event.error.message);
            };
        });
    }

    static calculateNetPosition(stock, quantity) {
        return stock.net_position + quantity;
    }
}

export default StockRepository;