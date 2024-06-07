const axios = require('axios');
const fs = require('fs');

let ProxyScrapeAPIKey = ""

async function fetchServerData(cfxCode) {
    try {
        let data = JSON.stringify({
            "url": "https://servers-frontend.fivem.net/api/servers/single/" + cfxCode,
            "httpResponseBody": true
        });
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.proxyscrape.com/v3/accounts/freebies/scraperapi/request',
            headers: { 
              'Content-Type': 'application/json', 
              'X-Api-Key': ProxyScrapeAPIKey
            },
            data : data
        };

        await axios.request(config).then((response) => {
            let ABC = JSON.parse(Buffer.from(response.data.data.httpResponseBody, 'base64').toString())

            console.log("\nEndPoint: " + ABC.EndPoint);
            console.log("projectName: " + ABC.Data.vars.sv_projectName);
            console.log("Players: " + ABC.Data.clients + "/" + ABC.Data.sv_maxclients);
            console.log("GameBuild: " + ABC.Data.vars.sv_enforceGameBuild);
            console.log("connectEndPoints: " + ABC.Data.connectEndPoints);
    
            const file = fs.createWriteStream('cfxCodesOutput.txt', { flags: 'a' }); // 'a' for append mode
            file.write("EndPoint: " + ABC.EndPoint + "\n");
            file.write("projectName: " + ABC.Data.vars.sv_projectName + "\n");
            file.write("Players: " + ABC.Data.clients + "/" + ABC.Data.sv_maxclients + "\n");
            file.write("GameBuild: " + ABC.Data.vars.sv_enforceGameBuild + "\n");
            file.write("connectEndPoints: " + ABC.Data.connectEndPoints + "\n\n");
            file.end();
        }).catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.error(`Error fetching server data for CFX code ${cfxCode}:`, error.message);
    }
}

async function processCfxCodesFromFile(filePath) {
    try {
        const fileData = await fs.promises.readFile(filePath, 'utf8');
        const cfxCodes = fileData.trim().split('\n');

        for (const cfxCode of cfxCodes) {
            await fetchServerData(cfxCode);
            console.log("\nFetching Data For CFX Code: ", cfxCode)
        }
    } catch (error) {
        console.error('Error processing cfxCodes from file:', error.message);
    }
}

processCfxCodesFromFile("cfxCodes.txt");
