const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getHoldings(row) {

    var response = {};
    const symbol = row.SYMBOL;
    const price = row.PRICE;
    const quantity = row.QUANTITY;
    const purchaseDate = row.DATE;

    const details = await nseIndia.getEquityDetails(symbol);

    // let history = await nseIndia.getEquityHistoricalData(symbol, {start:"2021-05-20", end:"2021-05-21"});
    // console.log(JSON.stringify(history));
    // history = await nseIndia.getEquityHistoricalData(symbol, {start:"2021-02-20", end:"2021-02-21"});
    // console.log(JSON.stringify(history));

    const change = details.priceInfo.change;
    const currentPrice = details.priceInfo.lastPrice;

    const dayPL = change * quantity;
    const currentValue = quantity * currentPrice;
    const investedValue = quantity * price;

    const overallPL = currentValue - investedValue;


    response.holdings_id = row.HOLDINGS_ID;
    response.symbol = symbol;
    response.quantity = quantity,
    response.price = price,
    response.purchase_date = purchaseDate;

    response.current_price = currentPrice.toFixed(2);

    response.current_value = currentValue.toFixed(2);
    response.day_pl = dayPL.toFixed(2);
    response.day_percent = ((dayPL / (currentValue - (dayPL))) * 100).toFixed(2);

    response.overall_pl = overallPL.toFixed(2);
    response.overall_percent = (overallPL / ( investedValue / 100 )).toFixed(2);

    response.company_name = details.info.companyName;
    response.industry = details.info.industry;
    response.listing_date = details.metadata.listingDate;



    return response;
}

exports.getHoldings = getHoldings;