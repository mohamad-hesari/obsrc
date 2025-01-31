import React from "react";
import { useLoadingStore } from "../stores/loading";

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      viewBox="130 125 300 150"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle
        cx="280"
        cy="200"
        fill="#302e31"
        r="150"
        stroke="#ddd"
        strokeWidth="14.54"
      />
      <path
        d="m203.743 121.229c4.609-22.249 19.693-42.318 39.972-52.374-3.528 3.582-7.793 6.327-11.061 10.223-13.366 14.414-19.4 35.28-15.713 54.469 4.651 29.288 32.179 53.213 62.012 52.794 23.128 1.035 45.67-12.277 56.983-32.347 24.218.822 47.765 13.324 61.592 33.394 7.081 10.475 12.612 22.752 12.989 35.531-4.483-16.969-15.754-32.053-31.132-40.559-14.874-8.38-33.142-10.516-49.441-5.572-20.447 5.866-37.332 22.584-43.156 43.156-4.944 16.383-2.829 34.441 4.944 49.441-10.81 18.73-30.335 32.095-51.536 36.118-16.299 3.419-33.436.779-48.604-6.076 13.576 3.96 28.324 4.651 41.816-.148 18.1-5.991 33.058-20.53 39.637-38.463 7.29-19.525 4.525-42.738-7.752-59.497-9.176-13.199-23.631-22.5-39.343-25.81-4.986-.889-10.014-1.291-15.042-1.752-8.003-16.131-10.936-34.86-6.914-52.374l-.251-.154z"
        fill="#c4c2c4"
        fillRule="nonzero"
      />
    </svg>
  );
}

export function Loading() {
  const store = useLoadingStore();
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-2 bg-white">
      <Logo className="aspect-square w-1/3 animate-spin rounded-full" />
      <span className="sr-only">Loading...</span>
      <span className="w-full text-center">{store.state}</span>
    </div>
  );
}
