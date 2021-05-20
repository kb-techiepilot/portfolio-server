//not using anymore - left for sample fetch call
const fetch = require("node-fetch");

async function getLatestPrice(symbol) {
    try {
        const response = await fetch(
          `https://latest-stock-price.p.rapidapi.com/any?Identifier=` + symbol+"EQN",
          {
            headers: {
                "x-rapidapi-key": "4adef21fb3msh473ed3d95fbc66ap1b8a9djsn87c4e5827645",
                "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
                "useQueryString": true
            },
          }
        );
        
        let responseData = await response.json();
        return responseData[0];
      } catch(error) {
        return (error.message);
      }
};

exports.getLatestPrice = getLatestPrice;