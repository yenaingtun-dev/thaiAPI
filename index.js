const axios = require("axios");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;
const path = require('path');

app.set("view engine", "ejs");
app.use('/public', express.static(path.join(__dirname, "public")));

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    const newDataArray = response.data.result;
    updateFile(newDataArray);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchHistoryData(historyUrl) {
  try {
    const response = await axios.get(historyUrl);
    const newDataArray = response.data;
    updateHistorysFile(newDataArray);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateFile(newDataArray) {
  const filePath = "data.json";
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading file:", err);
      return;
    }
    let existingData = [];
    if (data) {
      existingData = JSON.parse(data);
    }
    const newDataToAdd = newDataArray.filter(
      (newItem) =>
        !existingData.some(
          (existingItem) =>
            JSON.stringify(existingItem) === JSON.stringify(newItem)
        )
    );
    if (newDataToAdd.length > 0) {
      existingData.push(...newDataToAdd);
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log("Data updated in data.json");
        }
      });
    } else {
      console.log("No new data to update");
    }
  });
}

function updateHistorysFile(newDataArray) {
  const filePath = "history.json";
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading file:", err);
      return;
    }
    let existingData = [];
    if (data) {
      existingData = JSON.parse(data);
    }
    const newDataToAdd = newDataArray.filter(
      (newItem) =>
        !existingData.some(
          (existingItem) =>
            JSON.stringify(existingItem) === JSON.stringify(newItem)
        )
    );
    if (newDataToAdd.length > 0) {
      existingData.push(...newDataToAdd);
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log("Data updated in data.json");
        }
      });
    } else {
      console.log("No new data to update");
    }
  });
}

const url = "https://api.thaistock2d.com/live";
const historyUrl = "https://api.thaistock2d.com/history";

fetchData(url);
fetchHistoryData(historyUrl);
setInterval(() => fetchData(url), 60000);
setInterval(() => fetchHistoryData(historyUrl), 60000);

app.get("/", async (req, res) => {
    try {
      const response = await axios.get(`https://api.thaistock2d.com/live`);
      const stockDataResults =  response.data.result;
      const stockDataLive =  response.data.live;
      res.render(__dirname + "/views/index.ejs", { stockDataLive, stockDataResults  });
    } catch (parseError) {
      return res.status(500).send("Error parsing JSON data");
    }
  // });
});

app.get("/history_live", async (req, res) => {
    try {
      const response = await axios.get(`https://api.thaistock2d.com/history`);
      const historyDatas =  response.data;
      res.json({ historyDatas });
    } catch (parseError) {
      return res.status(500).send("Error parsing JSON data");
    }
});

app.get("/history", async (req, res) => {
    try {
      const response = await axios.get(`https://api.thaistock2d.com/history`);
      const historyDatas =  response.data;
      res.render(__dirname + "/views/history.ejs", { historyDatas });
    } catch (parseError) {
      return res.status(500).send("Error parsing JSON data");
    }
});

app.get('/date-history', async (req, res) => {
    const selectedDate = req.query.date;
    try {
        const response = await axios.get(`https://api.thaistock2d.com/history?date=${selectedDate}`);
        const historyDatas = response.data;
        res.render('date-history', { historyDatas, selectedDate });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.send('Error fetching data');
    }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
