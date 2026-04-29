# Convertify 🎯

**Free Unlimited File Converter** - Convert any file format with unlimited conversions, completely free and private!

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **30+ File Formats** - Images, Audio, and Video
- 🔒 **100% Private** - All conversions happen in your browser
- ⚡ **Real-time Progress** - Track conversion progress with live updates
- 📦 **Batch Processing** - Convert multiple files at once
- 🎯 **No File Limits** - Convert files up to 500MB each
- 🌓 **Dark Mode** - Easy on the eyes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **Worker Pooling** - Efficient resource management
- ✅ **File Validation** - Automatic size and format checking

## 🎬 Supported Formats

### Images
JPEG, PNG, JPG, GIF, SVG, PDF, ICO, HEIF, TIFF, PSD, RAW, EPS, WEBP, BMP

### Audio
MP3, WAV, OGG, FLAC, AIFF, M4A, WMA, AAC

### Video
MP4, AVI, MOV, WMV, MKV, FLV, WEBM, MPEG

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or Bun
- Modern browser with SharedArrayBuffer support (Chrome 92+, Firefox 89+, Safari 15.2+)

### Installation

```bash
# Clone the repository
git clone https://github.com/DharuNamikaze/Convertify.git
cd Convertify

# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Tech Stack

- **Framework**: Next.js 15.1.6 (App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Components**: Radix UI
- **Media Processing**: FFmpeg.wasm
- **File Upload**: react-dropzone
- **Icons**: Lucide React, React Icons
- **Animation**: Framer Motion

## 🔧 How It Works

Convertify uses **FFmpeg.wasm** - a WebAssembly port of FFmpeg - to perform all file conversions directly in your browser. This means:

1. **No Server Uploads** - Files never leave your device
2. **Complete Privacy** - No data is sent to any server
3. **Fast Processing** - Conversions happen locally using Web Workers
4. **Unlimited Use** - No API limits or usage restrictions

### Architecture

```
┌─────────────┐
│   Browser   │
│             │
│  ┌───────┐  │
│  │ React │  │
│  │  UI   │  │
│  └───┬───┘  │
│      │      │
│  ┌───▼────┐ │
│  │ Worker │ │
│  │ Pool   │ │
│  └───┬────┘ │
│      │      │
│  ┌───▼────┐ │
│  │FFmpeg  │ │
│  │.wasm   │ │
│  └────────┘ │
└─────────────┘
```

## 📝 Recent Improvements

### ✅ Fixed Issues
- ✅ FFmpeg version mismatch resolved (now using 0.9.0 consistently)
- ✅ Added progress indicators for all conversions
- ✅ Implemented file size validation (500MB limit)
- ✅ Worker pooling for better resource management
- ✅ Complete format support (WEBP, GIF, BMP, TIFF, ICO)

### 🎉 New Features
- ✅ About page with comprehensive documentation
- ✅ Real-time conversion progress bars
- ✅ Dark mode toggle
- ✅ File size warnings
- ✅ Status indicators (pending, converting, completed, error)
- ✅ Disabled controls during conversion
- ✅ Better error handling and user feedback

## 🎯 Usage

1. **Upload Files** - Drag & drop or click to select files
2. **Choose Format** - Select target format from dropdown
3. **Convert** - Click "Convert Now" and watch the progress
4. **Download** - Converted files download automatically

## 🌐 Browser Compatibility

Convertify requires SharedArrayBuffer support:

- ✅ Chrome 92+
- ✅ Edge 92+
- ✅ Firefox 89+
- ✅ Safari 15.2+

## 📦 Build & Deploy

```bash
# Build for production
npm run build
# or
bun run build

# Start production server
npm start
# or
bun start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DharuNamikaze/Convertify)

**Important**: Ensure your hosting platform supports the required CORS headers:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These are already configured in `next.config.ts`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**DharuNamikaze**
- GitHub: [@DharuNamikaze](https://github.com/DharuNamikaze)

## 🙏 Acknowledgments

- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - WebAssembly port of FFmpeg
- [Next.js](https://nextjs.org/) - React framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📊 Project Status

🟢 **Active Development** - New features and improvements are being added regularly!

---

Made with ❤️ by [DharuNamikaze](https://github.com/DharuNamikaze)
