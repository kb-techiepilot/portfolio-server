var DomParser = require('dom-parser');

async function getQuote(id) {
    const response = await axios.get('https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol='+id+'&illiquid=0&smeFlag=0&itpFlag=0');

    var parser = new DomParser();
	var doc = parser.parseFromString(response.data, 'text/html');

    var data = doc.getElementById('responseDiv').innerHTML.trim();
    
    return JSON.parse(data);
}

exports.getQuote = getQuote