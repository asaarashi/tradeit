import BaseRepository from "./BaseRepository";

class StockRepository extends BaseRepository {
    constructor(transaction) {
        super(transaction);

        this.store = this.transaction.objectStore("stocks");
    }

    /**
     * Retrieve all stocks
     */
    getAll() {
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
    updateStock(stockName, quantity) {
        return new Promise((resolve, reject) => {
            this.store = this.transaction.objectStore("stocks");
            const req = this.store.get(stockName);

            req.onsuccess = (event) => {
                const stock = event.target.result;
                if (!stock) {
                    const req = this.store.add({
                        stock_name: stockName,
                        total: quantity
                    });
                    req.onsuccess = (event) => {
                        resolve(true);
                    };
                    req.onerror = (event) => {
                        reject(event.error.message);
                    };
                } else {
                    stock.total = StockRepository.calculateNetPosition(stock, quantity);
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
        return stock.total + quantity;
    }
}

export default StockRepository;