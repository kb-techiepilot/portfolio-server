const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getAllWishlist(row) {
    var response = {};
    const symbol = row.SYMBOL;

    response.wishlist_id = row.WISHLIST_ID;
    response.symbol = symbol;

    const details = await nseIndia.getEquityDetails(symbol);

    console.log("data from nse : " + JSON.stringify(details));

    response.change = details.priceInfo.change.toFixed(2);
    response.percent_change = details.priceInfo.pChange.toFixed(2);
    response.current_price = details.priceInfo.lastPrice;

    return response;
}

async function getWishlist(row) {
    var response = {};
    const symbol = row.SYMBOL;

    const details = await nseIndia.getEquityDetails(symbol)

    response.wishlist_id = row.WISHLIST_ID;
    response.symbol = symbol;
    response.added_on = row.DATE;
    response.price = parseFloat(row.PRICE).toFixed(2);

    response.company_name = details.info.companyName;
    response.industry = details.info.industry;
    response.listing_date = details.metadata.listingDate;

    response.open = details.priceInfo.open.toFixed(2);
    response.dayHigh = details.priceInfo.intraDayHighLow.max.toFixed(2);
    response.dayLow = details.priceInfo.intraDayHighLow.min.toFixed(2);
    response.previousClose = details.priceInfo.previousClose.toFixed(2);
    response.change = details.priceInfo.change.toFixed(2);    
    response.percent_change = details.priceInfo.pChange.toFixed(2);
    response.current_price = details.priceInfo.lastPrice.toFixed(2);

    return response;

}

exports.getAllWishlist = getAllWishlist;
exports.getWishlist = getWishlist;