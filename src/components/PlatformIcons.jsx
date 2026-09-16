import { FaWindows, FaApple, FaLinux } from 'react-icons/fa';

export default function PlatformIcons({ windows, mac, linux, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {windows && <FaWindows className="text-steam-text-dim text-xs" title="Windows" />}
      {mac && <FaApple className="text-steam-text-dim text-xs" title="macOS" />}
      {linux && <FaLinux className="text-steam-text-dim text-xs" title="Linux" />}
    </span>
  );
}
