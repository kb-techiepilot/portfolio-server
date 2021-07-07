var DomParser = require('dom-parser');
const axios = require('axios');

async function getQuote(id) {
    const response = await axios.get('https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol='+id+'&illiquid=0&smeFlag=0&itpFlag=0');

    var parser = new DomParser();
	var doc = parser.parseFromString(response.data, 'text/html');

    var data = JSON.parse(doc.getElementById('responseDiv').innerHTML.trim());
    
    return data.data;
}

exports.getQuote = getQuote