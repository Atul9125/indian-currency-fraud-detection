# 💵 Satya — Indian Fake Currency Detection System

An end-to-end deep learning system that verifies whether an Indian currency note is **genuine or counterfeit** from a photo, using transfer learning and a real-time web interface.

> **Satya** (सत्य) means *truth* — the app looks past the printing and tells you what's real.

---

## 🚀 Demo

Upload a photo of a currency note → the model scans it → returns **Genuine / Counterfeit** with a confidence score.

<!-- Add a screenshot or GIF here once deployed, e.g.: -->
<!-- ![App demo](assets/demo.png) -->

---

## 📌 Overview

Counterfeit currency is a real and persistent problem in India, and manual verification isn't always reliable. This project uses a **Convolutional Neural Network (CNN)** with transfer learning to automatically classify a currency note image as real or fake based on its visual and security features, then serves the model through a web app for real-time use.

---

## ✨ Features

- 🔍 Real vs Fake classification across **7 denominations** (₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000)
- 🧠 Transfer learning with **MobileNetV2** (pretrained on ImageNet) for high accuracy on a modest custom dataset
- ⚖️ Class-weighted training to handle real/fake class imbalance
- ⚡ **FastAPI** backend serving predictions through a REST endpoint
- 🎨 Custom HTML/CSS/JS frontend with a live "scanning" interaction and confidence visualization
- 📊 ~98–99% validation accuracy

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Model training | Python, TensorFlow / Keras, NumPy, Pandas, scikit-learn |
| Architecture | CNN — MobileNetV2 (Transfer Learning) |
| Backend | FastAPI, Uvicorn |
| Frontend | HTML, CSS, JavaScript |
| Training environment | Google Colab (GPU) |
| Dataset source | Kaggle |

---

## 🗂️ Dataset

- Custom-compiled dataset of real and counterfeit Indian currency note images across 7 denominations
- ~7,400 images total (real: 4,937 · fake: 2,508)
- Images merged across denominations into two classes (`real`, `fake`) for a denomination-agnostic detector
- Split: 80% training / 20% validation

---

## 🧠 Model Architecture

```
Input (224 x 224 x 3)
   ↓
Rescaling (1./255)
   ↓
MobileNetV2 (frozen, ImageNet weights)
   ↓
GlobalAveragePooling2D
   ↓
Dense (128, ReLU)
   ↓
Dense (1, Sigmoid)  → Real / Fake
```

- **Optimizer:** Adam
- **Loss:** Binary Crossentropy
- **Class weights** applied to counter the real/fake data imbalance
- **Early stopping** on validation loss to prevent overfitting

### Results

| Metric | Score |
|---|---|
| Training Accuracy | ~99% |
| Validation Accuracy | ~98–99% |

---

## 📁 Project Structure

```
currency-app/
├── app.py                 # FastAPI server + /predict endpoint
├── fake_currency_model.h5 # Trained MobileNetV2 model
├── requirements.txt
├── templates/
│   └── index.html         # Frontend markup
└── static/
    ├── style.css           # Styling
    ├── script.js           # Upload, scan animation, API calls
    └── uploads/             # Uploaded images (runtime)
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Atul9125/indian-currency-fraud-detection.git
   cd indian-currency-fraud-detection
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   source venv/bin/activate   # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the app**
   ```bash
   uvicorn app:app --reload
   ```

5. **Open in browser**
   ```
   http://127.0.0.1:8000
   ```

   Interactive API docs (Swagger UI):
   ```
   http://127.0.0.1:8000/docs
   ```

---

## 🔮 Future Scope

- Fine-tune deeper MobileNetV2 layers for further accuracy gains
- Add Grad-CAM visualization to highlight which regions of the note drove the prediction
- Real-time detection via webcam feed
- Deploy publicly on Hugging Face Spaces / Render for a live demo link
- Extend to other currencies

---

## 📄 License

This project is for educational purposes. Feel free to fork and build on it.

---

## 🙋 Author :Atul Kumar

Built by [Atul9125](https://github.com/Atul9125) as a deep learning portfolio project.
