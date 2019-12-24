import React from 'react';
import '../assets/App.css';
import Pane from './Pane';
import Container from '@material-ui/core/Container';
import NetPositionGrid from './NetPositionGrid';
import AddTradeForm from './AddTradeForm';
import Notification from "./Notification";
import CreateDbConnection from "../dao/DbConnection";
import StockRepository from "../dao/StockRepository";
import TradeRepository from "../dao/TradeRepository";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stocks: [],
            showNotification: false,
            notificationText: "",
            notificationVariant: "success",
            hasGridDataLoaded: false
        };
    }

    submitTradeForm = async (companyName, quantity) => {
        // IMPORTANT! Using IndexedDb transaction to ensure adding a new trade and updating net position are transaction atomic
        const transaction = this.db.transaction(["trades", "stocks"], "readwrite");
        const stockRepository = new StockRepository(transaction);
        const tradeRepository = new TradeRepository(transaction);

        try {
            // Add a new trade and update net position
            await tradeRepository.add(companyName, quantity);
            await stockRepository.updateStock(companyName, quantity);
        } catch (e) {
            this.showNotification("Failed to access database: " + e.message, "error");
            return;
        }

        // Clear the inputs
        this.addTradeForm.clearInputs();

        this.showNotification("Traded successfully!", "success");
        // Emit event afterUpdateStock
        const e = new CustomEvent('afterUpdateStock');
        dispatchEvent(e);
    };

    showNotification(text, variant) {
        this.setState({
            showNotification: true,
            notificationText: text,
            notificationVariant: variant
        });
    }

    async componentDidMount() {
        try {
            this.db = await CreateDbConnection();
        } catch (e) {
            this.showNotification("Failed to open database: " + e.message, "error");
            return;
        }

        let loadNetPositionGrid = async () => {
            // "Loading..." displays only when the page is just loaded
            this.setState({hasGridDataLoaded: false});

            const stockRepository = new StockRepository(this.db.transaction(["stocks"]));
            try {
                const stocks = await stockRepository.getAll() || [];
                this.setState({stocks, hasGridDataLoaded: true});
            } catch (e) {
                this.showNotification("Failed to access database: " + e.message, "error");
            }
        };
        // Load the net stock positions grid when app starts
        await loadNetPositionGrid();

        // Listen to event afterUpdateStock, if it is emitted, reloads the net stock positions grid
        window.addEventListener("afterUpdateStock", async (event) => {
            await loadNetPositionGrid();
        });
    }

    setAddTradeFormRef = (ref) => {
        this.addTradeForm = ref;
    };

    render() {
        const {stocks, showNotification, notificationText, notificationVariant, hasGridDataLoaded} = this.state;

        return (
            <Container maxWidth="md">
                <Notification open={showNotification} message={notificationText} variant={notificationVariant}
                              onClose={() => this.setState({showNotification: false})}/>
                <Pane title="Today's trades">
                    <NetPositionGrid stocks={stocks} hasGridDataLoaded={hasGridDataLoaded}/>
                </Pane>
                <Pane title="Add new trade">
                    <AddTradeForm onSubmit={this.submitTradeForm} ref={this.setAddTradeFormRef}/>
                </Pane>
            </Container>
        );
    }
}

export default App;
