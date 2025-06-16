const axios = require("axios");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";

module.exports.ingest = async () => {
  try {
    const { data } = await axios.get(EONET_URL);
    const events = data.events || [];

    const writeOps = events.map((event) => ({
      PutRequest: {
        Item: {
          id: uuidv4(),
          title: event.title,
          category: event.categories?.[0]?.title || "Uncategorized",
          source: "NASA EONET",
          date: event.geometry?.[0]?.date || new Date().toISOString(),
          coordinates: event.geometry?.[0]?.coordinates || [],
          link: event.sources?.[0]?.url || "",
          raw: event,
        },
      },
    }));

    // Break into batches of 25
    const batches = [];
    for (let i = 0; i < writeOps.length; i += 25) {
      batches.push(writeOps.slice(i, i + 25));
    }

    // Parallel batch writes (much faster)
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

    console.log(`Ingested ${events.length} events`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Ingested ${events.length} events` }),
    };
  } catch (err) {
    console.error("Ingestion failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ingestion failed", details: err.message }),
    };
  }
};

module.exports.getEvents = async (event) => {
  const { category, limit } = event.queryStringParameters || {};

  const params = {
    TableName: process.env.TABLE_NAME,
    Limit: limit ? parseInt(limit) : 20,
  };

  if (category) {
    params.FilterExpression = "category = :c";
    params.ExpressionAttributeValues = {
      ":c": category,
    };
  }

  try {
    const data = await dynamo.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    console.error("Error fetching events", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch events" }),
    };
  }
};
