'use client';

export default function PostText({ text }: { text: string }) {
  return <>{text.split(/(https?:\/\/[^\s<>]+)/g).map((part, index) => {
    if (!/^https?:\/\//i.test(part)) return part;
    try {
      const url = new URL(part);
      if (!['https:', 'http:'].includes(url.protocol)) return part;
      return <a key={index} href={url.href} target="_blank" rel="noopener noreferrer ugc" className="text-fuchsia-300 underline underline-offset-4 break-all">{part}</a>;
    } catch {
      return part;
    }
  })}</>;
}
