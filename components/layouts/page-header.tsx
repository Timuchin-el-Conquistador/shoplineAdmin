"use client";

import Image from "next/image";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
};

function PageHeader({ 
  title, 
  subtitle, 
  notificationCount = 0,
  userAvatar,
  userName
}: PageHeaderProps) {
  return (
    <div className="px-4 pb-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* User Avatar */}
            {userAvatar ? (
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={userAvatar}
                  alt={userName || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
