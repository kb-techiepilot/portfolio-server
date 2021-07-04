const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getSolds(row) {
    var response = {};

    response.sold_id = row.SOLD_ID;
    response.date = row.DATE;
    response.symbol = row.SYMBOL

    // const details = await nseIndia.getEquityDetails(row.SYMBOL);

    // response.company_name = details.info.companyName;
    response.exchange = row.EXCHANGE;
    response.quantity = row.QUANTITY;
    response.buy_price = row.BUY_PRICE;
    response.sell_price = row.SELL_PRICE;
    const profit = ((response.sell_price - response.buy_price ) * response.quantity).toFixed(2);
    response.profit = (profit);
    response.profit_percent = ((profit / (response.buy_price * response.quantity)) * 100).toFixed(2);

    return response;
}

exports.getSolds = getSolds;