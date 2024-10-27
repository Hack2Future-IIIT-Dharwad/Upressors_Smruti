# ReviveAI: AI-Powered Historical Image Restoration

Bringing the Past into the Present - An advanced AI solution for restoring and colorizing historical photographs with exceptional accuracy and detail.

## 🌟 Features

- High-resolution image enhancement using ESRGAN/SRGAN
- Intelligent colorization of black and white photographs
- Texture and detail preservation
- Batch processing capabilities
- User-friendly web interface
- Secure image storage and management

## 🏗️ Project Structure

```
ReviveAI/
├── client/               # React frontend
├── server/              # Node.js backend
└── ai/                  # Flask AI service
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- CUDA-compatible GPU (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Hack2Future-IIIT-Dharwad/Upressors_Smruti.git
cd Upressors_Smruti
```

2. **Set up the Frontend (Client)**
```bash
cd client
npm install
# Create .env file with necessary environment variables
npm run dev
```

3. **Set up the Backend (Server)**
```bash
cd server
npm install
# Create .env file with necessary environment variables
npm start
```

4. **Set up the AI Service**
```bash
cd ai
python -m venv upressors
source upressors/bin/activate  # On Windows: upressors\Scripts\activate
pip install -r requirements.txt
python app.py
```



## 🔧 Architecture

- **Frontend**: React application handling user interface and image upload
- **Backend**: Node.js server managing authentication, data storage, and communication with AI service
- **AI Service**: Flask API running the image restoration models
- **Database**: MongoDB storing user data and image metadata



## 📈 Performance Considerations

- Use GPU acceleration for AI processing
- Implement image caching
- Configure proper scaling for the AI service
- Optimize image storage and delivery

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name](https://github.com/yourusername) - Project Lead
- [Team Member 1](https://github.com/teammember1) - AI Engineer
- [Team Member 2](https://github.com/teammember2) - Frontend Developer
- [Team Member 3](https://github.com/teammember3) - Backend Developer

## 📞 Support

For support, email support@revive.ai or open an issue in the repository.
