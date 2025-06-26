<p align="center">
  <img src="https://i.imgur.com/RkWeNgP.png" width="20%" height="20%" alt="SentinelGrid Logo"/>
</p>

# 🛰️ SentinelGrid - Real-time Global Event Monitoring & Visualization Platform

[![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)](https://aws.amazon.com/lambda/)
[![DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)](https://www.serverless.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

SentinelGrid is a global event monitoring platform that brings the power of NASA's EONET API to your fingertips, visualizing real-time natural events with a modern, serverless AWS stack. Built for scale, speed, and fun, this project is a hackathon and interview winner's dream!

<p align="center">
  <!-- Replace the src below with a real dashboard screenshot if available -->
  <img src="https://i.imgur.com/Tfnewuz.png" width="80%" alt="SentinelGrid Dashboard Screenshot"/>
</p>

---

## 📑 Quick Links

- [Features](#-features)
- [Architecture](#-architecture)
- [Get Started](#-get-started)
- [Documentation](#-documentation)
- [Contribute](#-contribute)
- [License](#-license)

---

## 🚀 Features

- **Real-time tracking** of 8 natural event categories:
  - 🔥 Wildfires
  - 🌋 Volcanoes
  - 🌊 Floods
  - 🌪️ Severe Storms
  - 🌍 Earthquakes
  - 🏔️ Landslides
  - ❄️ Sea and Lake Ice
  - 🏜️ Drought
- Interactive React dashboard with beautiful charts
- Automated ingestion every 3 hours (set-and-forget!)
- RESTful API for querying events by category/limit
- Category-based filtering, stats, and latest event highlights

---

## 🏗️ Architecture

SentinelGrid is built on a fully serverless AWS architecture:

- **AWS Lambda**: Stateless compute for ingestion and API
- **Amazon DynamoDB**: NoSQL event storage, pay-per-request
- **API Gateway**: Secure, scalable REST API
- **CloudWatch Events**: Scheduled Lambda triggers
- **IAM**: Fine-grained permissions for least privilege
- **Serverless Framework**: Infrastructure as code, easy deploys

### 🔬 Lambda Functions

#### 1. `ingestEvents` Lambda
- **Trigger**: Every 3 hours (CloudWatch Events)
- **What it does**:
  - Fetches up to 2000 events from NASA EONET
  - Normalizes categories for frontend compatibility
  - Selects up to 100 events per category for balance
  - Batches and writes events to DynamoDB (25 at a time)
  - Logs ingestion stats to CloudWatch

#### 2. `getEvents` Lambda
- **Trigger**: HTTP GET via API Gateway
- **What it does**:
  - Reads from DynamoDB
  - Supports category and limit query params
  - CORS-enabled for frontend

### 🗄️ DynamoDB Table: `SentinelEventsV2`
- **Primary Key**: `id` (UUID)
- **Attributes**: `title`, `category`, `source`, `date`, `coordinates`, `link`, `raw`
- **Billing**: PAY_PER_REQUEST (cost-effective, scales to zero)
- **IAM**: Only Lambdas can read/write, least privilege

### 🔄 Data Flow

1. CloudWatch triggers `ingestEvents` Lambda every 3 hours
2. Lambda fetches, processes, and writes events to DynamoDB
3. API Gateway routes HTTP requests to `getEvents` Lambda
4. Lambda queries DynamoDB and returns JSON
5. React frontend fetches and visualizes data in real time

---

## 🖥️ Project Structure

```
SentinelGrid/
├── handler.js         # Lambda logic (ingest + API)
├── serverless.yml     # Infra as code (Serverless Framework)
├── frontend/          # React app (dashboard, charts)
│   └── src/
│       ├── App.js
│       ├── Dashboard.js
│       └── ...
├── docs/              # Architecture, sequence diagrams, etc.
├── API.md             # API documentation
├── ROADMAP.md         # Future plans
├── CHANGELOG.md       # Project history
├── SECURITY.md        # Security policy
├── CONTRIBUTING.md    # Contribution guidelines
├── CODE_OF_CONDUCT.md # Community standards
└── README.md
```

---

## 🛠️ Get Started

**Requirements:**
- Node.js 18+
- AWS CLI configured
- Serverless Framework
- (Frontend) npm

**Setup:**
```bash
git clone https://github.com/yourusername/SentinelGrid.git
cd SentinelGrid
npm install
cd frontend && npm install
```

**Configure AWS:**
```bash
aws configure
npm install -g serverless
```

**Deploy backend:**
```bash
serverless deploy
```

**Start frontend:**
```bash
cd frontend
npm start
```

---

## 📚 Documentation

- [API Reference](./API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Sequence Diagram](./docs/SEQUENCE.md)
- [Roadmap](./ROADMAP.md)
- [Changelog](./CHANGELOG.md)
- [Security Policy](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## 🏆 Why SentinelGrid Rocks

- **Real-world impact:** Live global event monitoring
- **Serverless everything:** No servers to manage, ever
- **Cost-effective:** Pay only for what you use
- **Scalable:** Handles thousands of events, bursts, and spikes
- **Modern stack:** AWS Lambda, DynamoDB, React, Serverless Framework
- **Fun to build, fun to use!**

---

## 📈 Future Ideas

- Real-time WebSocket notifications
- ML-powered event prediction
- Mobile app integration
- Heatmap and geospatial visualizations
- Historical data analytics

---

## 🤝 Contribute

We welcome contributors! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## 📜 License

MIT License — use, remix, and build your own SentinelGrid!

---

<p align="center">
  Built with ❤️ and ☁️ by Sayantan!
</p>
