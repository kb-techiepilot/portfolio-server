const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getTransactions(row) {
    var response = {};

    response.transaction_id = row.TRANSACTION_ID;
    response.broker_id = row.BROKER_ID;
    response.broker_name = row.BROKER_NAME;
    response.type = row.TYPE;
    response.date = row.DATE;
    response.symbol = row.SYMBOL

    // const details = await nseIndia.getEquityDetails(row.SYMBOL);

    // response.company_name = details.info.companyName;
    response.exchange = row.EXCHANGE;
    response.quantity = row.QUANTITY;
    response.price = row.PRICE;
    response.amount = row.AMOUNT;

    return response;
}

exports.getTransactions = getTransactions;