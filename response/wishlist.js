const { NseIndia } = require("stock-nse-india");
const fetch = require("node-fetch");

const nseIndia = new NseIndia()

async function getAllWishlist(row) {
    var response = {};
    const symbol = row.SYMBOL;

    response.wishlist_id = row.WISHLIST_ID;
    response.symbol = symbol;

    try {
        const details = await nseIndia.getEquityDetails(symbol);
        
        response.company_name = details.info.companyName;
        response.industry = details.metadata.industry;
        response.index = details.metadata.pdSectorInd;
        response.change = details.priceInfo.change.toFixed(2);
        response.percent_change = details.priceInfo.pChange.toFixed(2);
        response.current_price = details.priceInfo.lastPrice;
        response.year_high = details.priceInfo.weekHighLow.max;
        response.year_low = details.priceInfo.weekHighLow.min;
    } catch(err){
        console.log(err);
        throw err;
    }
 


    return response;
}

async function getWishlist(row) {
    var response = {};
    const symbol = row.SYMBOL;

    const details = await nseIndia.getEquityDetails(symbol);   
    console.log(details);
    const price = parseFloat(row.PRICE).toFixed(2);
    const currentPrice = details.priceInfo.lastPrice.toFixed(2);
    const overallChange = currentPrice - price;

    response.wishlist_id = row.WISHLIST_ID;
    response.symbol = symbol;
    response.added_on = row.DATE;
    response.price = price;

    response.company_name = details.info.companyName;
    response.industry = details.info.industry;
    response.index = details.metadata.pdSectorInd;
    response.listing_date = details.metadata.listingDate;

    response.open = details.priceInfo.open.toFixed(2);
    response.dayHigh = details.priceInfo.intraDayHighLow.max.toFixed(2);
    response.dayLow = details.priceInfo.intraDayHighLow.min.toFixed(2);
    response.previousClose = details.priceInfo.previousClose.toFixed(2);
    response.change = details.priceInfo.change.toFixed(2);    
    response.percent_change = details.priceInfo.pChange.toFixed(2);
    response.current_price = currentPrice;

    response.overall_change = overallChange.toFixed(2);
    response.overall_percent = ((overallChange / price) * 100).toFixed(2);

    response.year_high = details.priceInfo.weekHighLow.max;
    response.year_low = details.priceInfo.weekHighLow.min;

    return response;

}

exports.getAllWishlist = getAllWishlist;
exports.getWishlist = getWishlist;