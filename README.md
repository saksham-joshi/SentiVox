<div align="center">

# 🎭 Senti-Vox

### *Multilingual Sentiment Analysis at Lightning Speed*

A complete package for performing multilingual sentiment analysis with exceptional speed and accuracy. Built on the Bun runtime for rapid, context-free text analysis.

<img src="./Images/Senti-Vox-bgremoved-rectangle.png" width="450" style="border-radius:20px; margin: 20px 0;" alt="Senti-Vox Banner">



[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![ElysiaJS](https://img.shields.io/badge/ElysiaJS-EB4F27?style=for-the-badge&logo=elysia&logoColor=white)](https://elysiajs.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[🌐 **Live Demo**](https://senti-vox.vercel.app/) • [📡 **API Endpoint**](https://senti-vox-api.onrender.com/) • [📚 **Documentation**](./docs)

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

</div>



## ✨ Key Features

- 🚀 **Lightning Fast** - Powered by Bun runtime for exceptional performance
- 🌍 **Multilingual Support** - Analyze text in English, Hindi, Marathi, and Tamil
- 🎯 **Context-Free Analysis** - Accurate sentiment detection without context dependency
- 📊 **Comprehensive Results** - Get detailed sentiment scores, word lists, and visualizations
- 🔒 **Secure Authentication** - Powered by Supabase for robust user management
- 📈 **Word Cloud Generation** - Visual representation of frequently occurring words

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Frontend (`/site`)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

- **Next.js 16** - React framework for production
- **React** - UI library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Supabase** - Authentication & database

</td>
<td width="50%" valign="top">

### ⚡ Backend (`/api`)

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-EB4F27?style=for-the-badge&logo=elysia&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

- **Bun** - Fast all-in-one JavaScript runtime
- **ElysiaJS** - Ergonomic web framework
- **Wink NLP** - Natural language processing
- **Swagger** - API documentation

</td>
</tr>
</table>

---

## 📊 API Response

The API provides comprehensive sentiment analysis results:

| Field | Description |
|-------|-------------|
| 🎭 **Sentiment** | Classification: Positive, Negative, or Neutral |
| 📈 **Polarity Score** | Range: -1 to 1 (< 0: negative, 0: neutral, > 0: positive) |
| ✅ **Positive Score** | Total count of positive words |
| ❌ **Negative Score** | Total count of negative words |
| 💚 **Positive Words** | List of all detected positive words |
| 💔 **Negative Words** | List of all detected negative words |
| ❓ **Unidentified Words** | List of words not recognized by the model |
| 🔑 **Keywords** | Most frequently occurring words |
| ☁️ **Word Cloud** | Visual image of frequent words |

---

## 🌍 Supported Languages

<div align="center">

| Language | Status |
|----------|--------|
| 🇬🇧 **English** | ✅ Supported |
| 🇮🇳 **Hindi** | ✅ Supported |
| 🇮🇳 **Marathi** | ✅ Supported |
| 🇮🇳 **Tamil** | ✅ Supported |

</div>

---

## 📁 Project Structure

```
Senti-Vox/
├── api/
│   ├── src/
│   └── README.md
│
├── site/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── network/
│   ├── public/
│   └── README.md
│
├── dataset/
│
└── Images/
```

| Directory | Description |
|-----------|-------------|
| **[`/api`](./api)** | Backend API built with **ElysiaJS** and **Bun** - handles sentiment analysis and token management |
| **[`/site`](./site)** | Full stack web app built with **Next.js 16** - provides UI for API interaction |
| **[`/dataset`](./dataset)** | Datasets for model validation and improvement |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh) installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/saksham-joshi/SentiVox.git
   cd Senti-Vox
   ```

2. **Setup Backend**
   ```bash
   cd api
   bun install
   bun run dev
   ```
   
   📚 Detailed instructions: [API Setup Guide](./api/README.md)

3. **Setup Frontend**
   ```bash
   cd site
   bun install
   bun run dev
   ```
   
   📚 Detailed instructions: [Site Setup Guide](./site/README.md)

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:8000](http://localhost:8000)

---

## 📖 Documentation

- 🔗 **[API Documentation](https://senti-vox-api.onrender.com/swagger)** - Interactive Swagger docs
- 📘 **[Setup Guides](#-getting-started)** - Quick start instructions
- 🎯 **[Usage Examples](./docs/examples.md)** - Code samples and tutorials

---

## 🤝 Contributors

<div align="center">

<table>
<tr>
<td align="center" width="50%">

### 👨‍💻 Saksham Joshi

[![GitHub](https://img.shields.io/badge/GitHub-saksham--joshi-4489c8?style=for-the-badge&logo=github)](https://github.com/saksham-joshi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sakshamjoshi27)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-07beb8?style=for-the-badge&logo=About.me)](https://sakshamjoshi.vercel.app)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail)](mailto:social.sakshamjoshi@gmail.com)

</td>
<td align="center" width="50%">

### 👨‍💻 Subham Tiwari

[![GitHub](https://img.shields.io/badge/GitHub-W0nder0fy0u-4489c8?style=for-the-badge&logo=github)](https://github.com/W0nder0fy0u)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/subham-tiwari-ab38971b4/)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail)](mailto:subhamt958@gmail.com)

</td>
</tr>
</table>

</div>

---

## 📄 License

This project has no license. All rights reserved. Contact <a href="mailto:social.sakshamjoshi@gmail.com"> **SAKSHAM JOSHI** </a> for permission to use.

![](https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif)

<div align="center">

**Made with 💙 by [Saksham Joshi](https://github.com/saksham-joshi) & [Subham Tiwari](https://github.com/W0nder0fy0u)**

*Empowering multilingual sentiment analysis with speed and precision* 🚀

[![Live Demo](https://img.shields.io/badge/🌐-Try_Senti--Vox-3ECF8E?style=for-the-badge)](https://senti-vox.vercel.app/)

</div>