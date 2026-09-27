<div align="center">
  <h1>👗 PersonaWear</h1>
  <p><strong>Your Ultimate AI-Powered Fashion Universe</strong></p>
  <p>
    Digitize your wardrobe, discover your aesthetic with AI Stylist recommendations, <br/>
    and virtually try on outfits before you even open your closet.
  </p>
</div>

---

## ✨ Features

- **📱 Digital Wardrobe:** Effortlessly upload, categorize, and manage your real-world clothing items in a sleek digital closet.
- **✨ AI Virtual Try-On (VTON):** Curious how an outfit looks? Use our advanced AI pipeline to instantly "try on" clothes on a photo of yourself.
- **🤖 Personal AI Stylist:** Get personalized outfit recommendations based on your unique aesthetic, the weather, and your existing wardrobe. 
- **🌍 Fashion Community:** Share your curated outfits, discover inspiration from other users, and engage with a community of fashion enthusiasts.
- **🔒 Secure Profiles:** Robust user authentication and profile management so your digital closet stays private and secure.

---

## 🛠️ Tech Stack

PersonaWear is built with a modern, high-performance web stack:

### Frontend (`ai-fashion-universe`)
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS & Styled-Components
- **State Management:** Zustand
- **Animations:** Framer Motion

### Backend (`personawear-backend`)
- **Server:** Node.js & Express
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **Authentication:** JWT & bcrypt
- **Media Storage:** Cloudinary
- **AI Integrations:** Gradio Client & Google Generative AI

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine. You will also need a PostgreSQL database (like Neon) and a Cloudinary account.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/personawear.git
cd personawear
```

### 2. Backend Setup
```bash
cd personawear-backend
npm install

# Setup your .env file with DATABASE_URL, JWT_SECRET, etc.
npx prisma db push

# Start the server (runs on port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
# In a new terminal window
cd ai-fashion-universe
npm install

# Start the Next.js app (runs on port 3000)
npm run dev
```

### 4. Explore!
Open your browser and navigate to `http://localhost:3000` to start using PersonaWear.

---

## 📸 Screenshots

*(Add screenshots of your application here, e.g., the landing page, the digital wardrobe, and the virtual try-on results!)*

---

<div align="center">
  Built with ❤️ for the future of fashion.
</div>