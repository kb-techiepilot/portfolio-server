const { NseIndia } = require("stock-nse-india");
const fetch = require("node-fetch");
const nseUtil = require('../routes/api/v2/nseUtil')

const nseIndia = new NseIndia()

async function getAllWishlist(row) {
    var response = {};
    const symbol = row.SYMBOL;

    response.wishlist_id = row.WISHLIST_ID;
    response.symbol = symbol;

    try {
        const details = await nseIndia.getEquityDetails(symbol);

        
        //using nseindia package
        response.company_name = details.info.companyName;
        response.industry = details.metadata.industry;
        response.index = details.metadata.pdSectorInd;
        response.change = details.priceInfo.change.toFixed(2);
        response.percent_change = details.priceInfo.pChange.toFixed(2);
        response.current_price = details.priceInfo.lastPrice;
        response.year_high = details.priceInfo.weekHighLow.max;
        response.year_low = details.priceInfo.weekHighLow.min;
        
        // const nsedetail = await nseUtil.getQuote(symbol);
        
        //geting data from nseindia site
        // response.company_name = nsedetail.companyName;
        // response.change = nsedetail.change;
        // response.percent_change = nsedetail.pChange;
        // response.current_price = nsedetail.lastPrice;
        // response.year_high = nsedetail.high52;
        // response.year_low = nsedetail.low52;
        
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
    const trade = await nseIndia.getEquityTradeInfo(symbol);

    const price = parseFloat(row.PRICE).toFixed(2);
    const currentPrice = details.priceInfo.lastPrice.toFixed(2);
    const overallChange = currentPrice - price;

    response.wishlist_id = Number(row.WISHLIST_ID);
    response.symbol = symbol;
    response.added_on = row.DATE;
    response.price = price;

    response.company_name = details.info.companyName;
    response.industry = details.info.industry;
    response.index = details.metadata.pdSectorInd;
    response.listing_date = details.metadata.listingDate;

    response.open = details.priceInfo.open.toFixed(2);
    response.day_high = details.priceInfo.intraDayHighLow.max.toFixed(2);
    response.day_low = details.priceInfo.intraDayHighLow.min.toFixed(2);
    response.previous_close = details.priceInfo.previousClose.toFixed(2);
    response.change = details.priceInfo.change.toFixed(2);    
    response.percent_change = details.priceInfo.pChange.toFixed(2);
    response.current_price = currentPrice;

    response.overall_change = overallChange.toFixed(2);
    response.overall_percent = ((overallChange / price) * 100).toFixed(2);

    response.year_high = details.priceInfo.weekHighLow.max;
    response.year_low = details.priceInfo.weekHighLow.min;

    response.lower_cp = details.priceInfo.lowerCP;
    response.higher_cp = details.priceInfo.upperCP;

    response.avg_price = details.priceInfo.vwap;

    response.trade = {};
    response.trade.total_buy_qty = trade.marketDeptOrderBook.totalBuyQuantity;
    response.trade.total_sell_qty = trade.marketDeptOrderBook.totalSellQuantity;
    response.trade.bids = trade.marketDeptOrderBook.bid;
    response.trade.asks = trade.marketDeptOrderBook.ask;
    response.trade.volume = trade.marketDeptOrderBook.tradeInfo.totalTradedValue;

    return response;

}

exports.getAllWishlist = getAllWishlist;
exports.getWishlist = getWishlist;