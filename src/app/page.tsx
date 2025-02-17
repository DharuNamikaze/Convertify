'use client'
import dynamic from 'next/dynamic';

const DropzoneComponent = dynamic(() => import('../../components/Dropzone'), {
  ssr: false // Disable server-side rendering for Dropzone
});

export default function Home() {
  return (
    <section className="pt-10 text-center ">
      <h1 className="pb-4 text-center font-bold text-3xl">
        Free Unlimited File Converter
      </h1>
      <h3 className="max-lg:px-8 px-56 text-base text-gray-600">
        The Ultimate online tool -- helps you to convert any file
        format with unlimited conversions, start using convertify
        now you can convert files effortlessly without restrictions,
        it&apos;s Free!
      </h3>

      {/* Upload section */}
      <DropzoneComponent /> {/* Use the dynamically imported component */}
    </section>
  )
}