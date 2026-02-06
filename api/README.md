# Senti-Vox API

The high-performance backend for the Senti-Vox sentiment analysis platform, built with **Bun** and **ElysiaJS** supporting `English`, `Hindi`, `Marathi` and `Tamil`.

<div align="center">

[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![ElysiaJS](https://img.shields.io/badge/ElysiaJS-EB4F27?style=for-the-badge&logo=elysia&logoColor=white)](https://elysiajs.com)
[![Wink NLP](https://img.shields.io/badge/Wink_NLP-FF6B6B?style=for-the-badge&logo=npm&logoColor=white)](https://winkjs.org/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io)

</div>

## 🛠️ Technologies Used

- **[Bun](https://bun.sh)**: Ultra-fast JavaScript runtime.
- **[ElysiaJS](https://elysiajs.com)**: The primary web framework used for handling requests.
- **[Wink NLP](https://winkjs.org)**: Used for tokenization and text processing.
- **[Redis](https://redis.io)**: (Implied) Used for token management and rate limiting.

## 📂 Folder Structure

This directory contains the backend logic, API endpoints, and natural language processing modules.

| Directory/File          | Description                                                 |
| :---------------------- | :---------------------------------------------------------- |
| **`src/index.ts`**      | Entry point of the server.                                  |
| **`src/analyzer.ts`**   | Handles the core context-free analysis routes (`/cf`).      |
| **`src/general.ts`**    | Handles utility routes like health checks and tokenization. |
| **`src/base.ts`**       | Base configuration and constants.                           |
| **`src/context-free/`** | Contains the core sentiment analysis algorithms and logic.  |


## ⚡ Getting Started

### Prerequisites

- **Bun**: You must have Bun installed. [Install Bun](https://bun.sh/docs/installation).

### Setup

```bash
# Install dependencies
bun install

# To start the server
bun run dev

# To build the production version
bun run build

# To run the production version
bun start
```

### Environment Setup

Create a `.env` file and populate it with the following keys:
```env
REDIS_URL=
FREE_TOKEN_PASSWORD=
```

The server will start at `http://localhost:3000`.

### Documentation

When the server is running, you can access the interactive Swagger documentation at:

- **`http://localhost:3000/docs`**

## 📖 API Reference

### Authentication

The API requires an API Key for most endpoints. This must be provided in the JSON body of your request as `"api-key"`.

### Endpoints

#### 1. Single Comment Analysis

Analyze the sentiment of a single text string.

- **URL**: `/cf/single`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "api-key": "YOUR_API_KEY",
    "comment": "This product is amazing!"
  }
  ```

#### 2. Batch Analysis

Analyze multiple comments in one go.

- **URL**: `/cf/batch`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "api-key": "YOUR_API_KEY",
    "comment-list": ["I love this.", "This is hilarious."]
  }
  ```

#### 3. Tokenize

Break down a sentence into tokens.

- **URL**: `/tokenize`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "api-key": "YOUR_API_KEY",
    "comment": "Hello world"
  }
  ```

### 💻 Code Examples

#### JavaScript (Fetch)

```javascript
const analyzeSentiment = async () => {
  const response = await fetch("http://localhost:3000/cf/single", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "api-key": "YOUR_API_KEY",
      comment: "Senti-Vox is incredibly fast!",
    }),
  });

  const data = await response.json();
  console.log(data);
};
```

#### Python (Requests)

```python
import requests

url = "http://localhost:3000/cf/single"
payload = {
    "api-key": "YOUR_API_KEY",
    "comment": "Senti-Vox is incredibly fast!"
}

response = requests.post(url, json=payload)
print(response.json())
```

### 🧠 Knowledge Extraction (Response Structure)

The API returns a detailed JSON object. Here is how to interpret it:

```json
{
  "senti": "positive",
  "pol-score": 0.8,
  "pos-score": 2,
  "neg-score": 0,
  "pos-words": ["fast", "incredible"],
  "neg-words": [],
  "uniden-words": [],
  "word-cloud": "<svg></svg>",
  "keywords": ["fast", "Senti-Vox"]
}
```

- **`senti`**: The overall verdict (`positive`, `negative`, or `neutral`).
- **`pol-score`**: A Float between `-1` and `1`.
  - `< 0`: Negative sentiment.
  - `0`: Neutral.
  - `> 0`: Positive sentiment.
- **`pos-score`**: A Float between `0` and `1`.
- **`neg-score`**: A Float between `0` and `1`.
- **`pos-words`**: Array of words that are considered positive.
- **`neg-words`**: Array of words that are considered negative.
- **`uniden-words`**: Array of words that are not identified by the API.
- **`word-cloud`**: SVG string representing the word cloud.
- **`keywords`**: Important terms extracted from the text, useful for tagging or word clouds.
