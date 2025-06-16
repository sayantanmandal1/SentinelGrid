const axios = require("axios");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";

// Frontend-compatible category names
const CATEGORIES = [
  "Wildfires",
  "Volcanoes",
  "Floods",
  "SevereStorms",
  "Earthquakes",
  "Landslides",
  "SeaLakeIce",
  "Drought"
];

// Mapping from EONET raw categories to frontend-compatible format
const CATEGORY_NORMALIZATION = {
  "Severe Storms": "SevereStorms",
  "Sea and Lake Ice": "SeaLakeIce",
};

module.exports.ingest = async () => {
  try {
    console.log("TABLE_NAME from env:", process.env.TABLE_NAME);
    const { data } = await axios.get(`${EONET_URL}?limit=2000`);
    const allEvents = data.events || [];

    // Group events by normalized category
    const grouped = {};
    for (const event of allEvents) {
      const rawCat = event.categories?.[0]?.title || "Uncategorized";
      const category = CATEGORY_NORMALIZATION[rawCat] || rawCat;

      if (!CATEGORIES.includes(category)) continue; // Skip if not one of the 8

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(event);
    }

    // Select up to 100 per relevant category
    const selected = [];
    for (const cat of CATEGORIES) {
      const events = grouped[cat] || [];
      selected.push(...events.slice(0, 100));
    }

    const writeOps = selected.map((event) => {
      const rawCat = event.categories?.[0]?.title || "Uncategorized";
      const category = CATEGORY_NORMALIZATION[rawCat] || rawCat;

      return {
        PutRequest: {
          Item: {
            id: uuidv4(),
            title: event.title,
            category,
            source: "NASA EONET",
            date: event.geometry?.[0]?.date || new Date().toISOString(),
            coordinates: event.geometry?.[0]?.coordinates || [],
            link: event.sources?.[0]?.url || "",
            raw: event,
          },
        },
      };
    });

    // Batch writes in chunks of 25
    const batches = [];
    for (let i = 0; i < writeOps.length; i += 25) {
      batches.push(writeOps.slice(i, i + 25));
    }

    await Promise.all(
      batches.map((batch) =>
        dynamo
          .batchWrite({
            RequestItems: {
              [process.env.TABLE_NAME]: batch,
            },
          })
          .promise()
      )
    );

    console.log(`Ingested ${selected.length} balanced events`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Ingested ${selected.length} balanced events` }),
    };
  } catch (err) {
    console.error("Ingestion failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ingestion failed", details: err.message }),
    };
  }
};

module.exports.getEvents = async () => {
  const maxPerCategory = 100;
  const allData = [];

  try {
    // Scan each category individually
    for (const category of CATEGORIES) {
      const params = {
        TableName: process.env.TABLE_NAME,
        FilterExpression: "category = :c",
        ExpressionAttributeValues: { ":c": category },
        Limit: maxPerCategory,
      };

      const res = await dynamo.scan(params).promise();
      allData.push(...res.Items);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(allData),
    };
  } catch (err) {
    console.error("Error fetching balanced events", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch balanced events" }),
    };
  }
};
