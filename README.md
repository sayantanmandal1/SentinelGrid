# SentinelGrid Ingestor

This project ingests and serves global natural event data from the [NASA EONET API](https://eonet.gsfc.nasa.gov/). It uses AWS Lambda functions to:
- Ingest events hourly into a DynamoDB table (`SentinelEventsV2`).
- Serve stored events via an HTTP endpoint using API Gateway.

---

## 🌍 Features

- Scheduled ingestion of up to 100 events per category (8 categories total).
- Normalization of category names to frontend-compatible format.
- Data stored in DynamoDB using batch writes.
- REST API to retrieve stored events.

---

## 📁 Directory Structure

```
.
├── handler.js              # Lambda function logic (ingest + fetch)
├── serverless.yml          # Serverless framework config
└── README.md               # You're here!
```

---

## 🛠 Setup & Deployment

### ✅ Prerequisites

- Node.js 18+
- AWS CLI configured (`aws configure`)
- Serverless Framework installed (`npm install -g serverless`)

### 🔧 Deploy

```bash
sls deploy
```

### 🔁 Ingest Data (manually)

```bash
sls invoke -f ingestEvents
```

### 🌐 Access Events API

```bash
GET https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/events
```

---

## 🔒 IAM Permissions

The Lambda functions require the following DynamoDB permissions:

- `dynamodb:BatchWriteItem`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Scan`
- `dynamodb:UpdateItem`

Configured in `serverless.yml` with `iamRoleStatements`.

---

## 🧪 Test Locally

Use mock AWS credentials and the Serverless offline plugin (optional).

```bash
sls invoke -f ingestEvents
sls invoke -f getEvents
```

---

## 📊 DynamoDB Schema

Table: `SentinelEventsV2`

| Field       | Type    | Description                      |
|-------------|---------|----------------------------------|
| `id`        | String  | UUID v4                          |
| `title`     | String  | Event title                      |
| `category`  | String  | Normalized category              |
| `source`    | String  | Data source (e.g., NASA EONET)   |
| `date`      | String  | ISO timestamp                    |
| `coordinates` | List  | [Longitude, Latitude]            |
| `link`      | String  | Source URL                       |
| `raw`       | Map     | Full raw EONET event payload     |

---

## 📅 Categories Ingested

- Wildfires
- Volcanoes
- Floods
- SevereStorms
- Earthquakes
- Landslides
- SeaLakeIce
- Drought

---

## 📄 License

MIT License

---

*Generated on 2025-06-16T12:55:42.538386 UTC*
