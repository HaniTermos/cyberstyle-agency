import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center font-sans selection:bg-[#00F0FF] selection:text-black">
      {children}
    </div>
  );
}
