'use client'

export default function About() {
  return (
    <section className="pt-10 px-10 lg:px-56 max-w-7xl mx-auto">
      <h1 className="pb-4 text-center font-bold text-4xl">
        About Convertify
      </h1>
      
      <div className="mt-8 space-y-6 text-gray-700">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">What is Convertify?</h2>
          <p className="text-base leading-relaxed">
            Convertify is a free, unlimited file conversion tool that runs entirely in your browser. 
            Convert images, audio, and video files between dozens of formats without uploading anything 
            to a server. Your files never leave your device, ensuring complete privacy and security.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">How It Works</h2>
          <p className="text-base leading-relaxed mb-3">
            Convertify uses FFmpeg.wasm, a powerful media processing library compiled to WebAssembly, 
            to perform all conversions directly in your browser. This means:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No file uploads - everything happens locally</li>
            <li>Complete privacy - your files never leave your device</li>
            <li>No file size limits (up to 500MB per file)</li>
            <li>Unlimited conversions - convert as many files as you want</li>
            <li>Fast processing with real-time progress tracking</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Supported Formats</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div>
              <h3 className="font-semibold text-lg text-violet-800 mb-2">Images</h3>
              <p className="text-sm">
                JPEG, PNG, JPG, GIF, SVG, PDF, ICO, HEIF, TIFF, PSD, RAW, EPS, WEBP, BMP
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg text-violet-800 mb-2">Audio</h3>
              <p className="text-sm">
                MP3, WAV, OGG, FLAC, AIFF, M4A, WMA, AAC
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg text-violet-800 mb-2">Video</h3>
              <p className="text-sm">
                MP4, AVI, MOV, WMV, MKV, FLV, WEBM, MPEG
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Features</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Drag & drop file upload</li>
            <li>Batch conversion - convert multiple files at once</li>
            <li>Real-time progress tracking</li>
            <li>File size validation (500MB limit per file)</li>
            <li>Automatic download of converted files</li>
            <li>Responsive design - works on desktop, tablet, and mobile</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Browser Compatibility</h2>
          <p className="text-base leading-relaxed">
            Convertify requires a modern browser with SharedArrayBuffer support. We recommend:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Chrome 92+ or Edge 92+</li>
            <li>Firefox 89+</li>
            <li>Safari 15.2+</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Open Source</h2>
          <p className="text-base leading-relaxed">
            Convertify is built with modern web technologies including Next.js, React, TypeScript, 
            and FFmpeg.wasm. Check out the source code on{' '}
            <a 
              href="https://github.com/DharuNamikaze" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-800 hover:text-violet-600 underline"
            >
              GitHub
            </a>.
          </p>
        </div>

        <div className="pt-6 border-t">
          <p className="text-center text-sm text-gray-600">
            Made with ❤️ by{' '}
            <a 
              href="https://github.com/DharuNamikaze" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-800 hover:text-violet-600"
            >
              DharuNamikaze
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
