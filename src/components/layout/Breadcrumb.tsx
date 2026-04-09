import Image from 'next/image'
import Link from 'next/link'

interface BreadcrumbProps {
  title?: string
  backgroundImage?: string
  items?: { label: string; url?: string }[]
}

export default function Breadcrumb({ title, backgroundImage, items = [] }: BreadcrumbProps) {
  return (
    <section className="relative py-24 bg-[#1a1a2e] overflow-hidden">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-400 hover:text-[#e50914]">Home</Link>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-gray-500">/</span>
              {item.url ? (
                <Link href={item.url} className="text-gray-400 hover:text-[#e50914]">{item.label}</Link>
              ) : (
                <span className="text-[#e50914]">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
