'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useGetWhatsAppQrQuery } from '@/store/api';

export default function WhatsAppQRPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: qrData, isFetching } = useGetWhatsAppQrQuery(undefined, {
    skip: !isOpen,
  });

  useEffect(() => {
    const seen = sessionStorage.getItem('whatsapp-popup-seen');
    if (seen) return;

    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // const handleClose = () => {
  //   setIsOpen(false);
  //   sessionStorage.setItem('whatsapp-popup-seen', 'true');
  // };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('whatsapp-popup-seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-sm rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 rounded-full p-1 hover:bg-neutral-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-neutral-900">Get 10% Off!</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Scan the QR code to chat on WhatsApp and receive your exclusive discount code.
              </p>
              <div className="mt-4 flex justify-center">
                {qrData ? (
                  <div className="rounded-lg bg-white p-2 shadow-inner">
                    <Image
                      src={qrData.qr}
                      alt="WhatsApp QR Code"
                      width={200}
                      height={200}
                    />
                  </div>
                ) : (
                  <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-neutral-200" />
                )}
              </div>
              {qrData && (
                <a
                  href={qrData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Open WhatsApp
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
