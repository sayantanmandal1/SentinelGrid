# SentinelGrid Architecture

![Architecture Diagram](https://user-images.githubusercontent.com/yourusername/architecture-diagram.png)

## Components
- **Frontend:** React dashboard
- **API Gateway:** REST API
- **AWS Lambda:** Ingestion & API
- **DynamoDB:** Event storage
- **CloudWatch Events:** Scheduled triggers

## Data Flow
1. CloudWatch triggers Lambda
2. Lambda fetches/processes events
3. Writes to DynamoDB
4. API Gateway exposes endpoints
5. Frontend fetches and visualizes data
