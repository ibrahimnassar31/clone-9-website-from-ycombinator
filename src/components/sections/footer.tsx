import Link from 'next/link';

const SouthSideLogoMark = () => (
  <svg
    width="100"
    height="88"
    viewBox="0 0 100 88"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="South Side Studios Logo"
    className="mx-auto text-[#E8E8E8]"
  >
    <path d="M43.6667 14.6667H60.3333V25.6667H49.1667V40.1667H60.3333V51.1667H43.6667V64.6667H60.3333V74.6667H43.6667V14.6667Z" />
    <path d="M22.5 14.6667H14.1667V74.6667H22.5V14.6667Z" />
    <path d="M32.5 14.6667H24.1667V74.6667H32.5V14.6667Z" />
    <path d="M78.3333 14.6667H70V74.6667H78.3333V14.6667Z" />
    <path d="M88.3333 14.6667H80V74.6667H88.3333V14.6667Z" />
  </svg>
);

const BarcodeIcon = () => (
  <div className="flex items-end h-6 text-black space-x-px" aria-label="Barcode graphic">
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
    <div className="w-px h-full bg-current" />
    <div className="w-0.5 h-full bg-current" />
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-primary-black text-light-gray">
      <div className="container mx-auto px-4 md:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-x-8 gap-y-16 items-center text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start space-y-6">
            <h3 className="font-navigation tracking-[0.08em] text-sm uppercase">
              WANT TO KNOW MORE?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/request-a-studio"
                className="bg-light-gray text-primary-black rounded-full px-6 py-3 font-navigation text-xs tracking-wider uppercase whitespace-nowrap hover:bg-opacity-80 transition-colors"
              >
                REQUEST A STUDIO
              </Link>
              <Link
                href="#"
                className="border border-light-gray text-light-gray rounded-full px-6 py-3 font-navigation text-xs tracking-wider uppercase whitespace-nowrap hover:bg-light-gray hover:text-primary-black transition-colors"
              >
                DOWNLOAD INFO SHEET
              </Link>
            </div>
          </div>

          <div className="flex justify-center order-first lg:order-none">
            <SouthSideLogoMark />
          </div>

          <div className="font-navigation tracking-[0.08em] text-sm uppercase text-center lg:text-right space-y-2">
            <p>2901 S LAMAR ST DALLAS, TEXAS 75215</p>
            <p>+1 214 242 0085</p>
            <a href="mailto:INFO@SOUTHSIDESTUDIOS.COM" className="hover:opacity-75 transition-opacity">
              INFO@SOUTHSIDESTUDIOS.COM
            </a>
          </div>
        </div>
      </div>

      <div className="bg-light-gray text-primary-black">
        <div className="container mx-auto px-4 md:px-8 py-3">
          <div className="flex justify-between items-center font-navigation text-[10px] md:text-xs tracking-wider uppercase">
            <div>
              <span>©2025 SOUTH SIDE STUDIOS</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="w-5 h-5 bg-black" />
              <BarcodeIcon />
              <span className="font-sans text-base">&lt;</span>
              <span className="font-sans text-base">+</span>
              <span className="font-sans text-base">-</span>
            </div>
            <div>
              <Link href="/privacy-policy" className="hover:opacity-75 transition-opacity">
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}