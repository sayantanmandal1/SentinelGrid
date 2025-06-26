# SentinelGrid API Documentation

## GET /events
- **Description:** Retrieve events from DynamoDB
- **Query Parameters:**
  - `category` (optional): Filter by event category
  - `limit` (optional): Limit number of results
- **Example:**
  ```bash
  curl "https://<api-url>/events?category=Wildfires&limit=10"
  ```
- **Response:**
  ```json
  [
    {
      "id": "...",
      "title": "...",
      "category": "Wildfires",
      "date": "2025-06-26T00:00:00Z",
      "coordinates": [123.45, 67.89],
      "link": "...",
      "source": "NASA EONET",
      "raw": {...}
    },
    ...
  ]
  ```
- **Errors:**
  - `400 Bad Request`: Invalid parameters
  - `500 Internal Server Error`: Server issue
