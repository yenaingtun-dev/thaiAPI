const axios = require('axios');
const fs = require('fs');

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        const newDataArray = response.data.result;
        updateFile(newDataArray);
        // values.map(value => {
        //     saveToFile({ specificKey: value });
        // });
        // console.log(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateFile(newDataArray) {
    const filePath = 'data.json';

    // Read the existing data from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return;
        }

        let existingData = [];
        if (data) {
            existingData = JSON.parse(data);
        }

        // Check for new data
        const newDataToAdd = newDataArray.filter(newItem =>
            !existingData.some(existingItem => JSON.stringify(existingItem) === JSON.stringify(newItem))
        );

        if (newDataToAdd.length > 0) {
            existingData.push(...newDataToAdd);
            fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('Data updated in data.json');
                }
            });
        } else {
            console.log('No new data to update');
        }
    });
}


const url = 'https://api.thaistock2d.com/live';
fetchData(url);
setInterval(() => fetchData(url), 60000);