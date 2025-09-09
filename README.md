# 📊 Social Media Content Analyzer

A lightweight web app that extracts text from PDFs and images (**PDF.js + Tesseract.js**), runs quick content analytics (word/sentence/char counts, sentiment hints, keyword suggestions), and provides actionable engagement tips and platform-ready summaries.  

---

## 🔎 Overview
Social-Media-Content-Analyzer is built for **content creators, marketers, students, and researchers** who want to quickly convert scanned documents, lecture notes, or long reports into **ready-to-use social media content**.  

Unlike many tools, it runs **entirely in your browser** — no backend, no data sharing, and no installation required. That means:  
- 🔐 **Privacy-first**: your files never leave your computer  
- ⚡ **Fast setup**: just open `index.html` and start analyzing  
- 🌍 **Portable**: works offline once loaded  

This makes it ideal for:
- Drafting **Twitter/X threads** from reports  
- Creating **LinkedIn posts** from PDFs  
- Summarizing **research papers** into digestible snippets  
- Extracting text from **screenshots or scanned notes**  
- Generating **hashtags and keyword insights**  

---
## ✨ Project Structure
-Social-Media-Content-Analyzer/
- index.html        # main app (can be single-file version)
-  styles.css        # optional (if separated)
- app.js            # optional (if separated)
- README.md
-  assets/           # sample PDFs/images (optional)
---
## ✨ Features
- 📝 **OCR in browser** using Tesseract.js  
- 📑 **PDF parsing** via PDF.js  
- 📊 **Analytics:** word count, sentence count, char count, avg words/sentence  
- 😀 **Sentiment cues** (positive/negative/neutral hints)  
- 🔑 **Keyword suggestions & hashtags**  
- 💡 **Engagement tips** for better social media posts  
- 📤 **Export options** (copy to clipboard, download `.txt`)  
- 🎨 **Responsive UI** with customizable theme  

---

## 🚀 Quickstart

### Option A — Open directly
1. Clone or download the repo  
2. Open `index.html` in your browser  

### Option B — Run locally (recommended)
```bash
# serve locally to avoid CORS issues
npx http-server . -c-1 -p 5173
# or
npx live-server
