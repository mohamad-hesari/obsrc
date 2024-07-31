import React from "react";
import QrScanner from "qr-scanner";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

import { withLayout } from "../hocs";
import { Button } from "../components";
import { useServersStore } from "../stores";
import { uuid } from "../utils";

const BACK_EVENT = "qr-code-scanner-back";

function Header() {
  function handleBack() {
    window.dispatchEvent(new CustomEvent(BACK_EVENT));
  }
  return (
    <div className="flex items-center justify-start space-x-2">
      <Button
        as={Link}
        to="/"
        icon={FaArrowLeft}
        rounded
        color="glasses"
        onClick={handleBack}
      />
      <span>QR Code</span>
    </div>
  );
}

const QRCodeScanner = withLayout(function QRCodeScanner() {
  const store = useServersStore();
  const ref = React.useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = React.useState<QrScanner | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  React.useEffect(() => {
    function handler() {
      scanner?.stop();
      stream?.getTracks().forEach((track) => track.stop);
    }
    window.addEventListener(BACK_EVENT, handler);
    return () => {
      window.removeEventListener(BACK_EVENT, handler);
    };
  }, [scanner, stream]);

  React.useEffect(() => {
    const video = ref.current;
    if (!video) {
      return;
    }
    const qrScanner = new QrScanner(
      video,
      (result) => {
        if (result.data.startsWith("obs")) {
          const url = new URL(result.data.substring(3));
          const data = {
            id: uuid(),
            ip: url.hostname,
            port: url.port ? parseInt(url.port) : 4444,
            password: url.pathname.split("/")[1] || undefined,
          };
          if (
            !store.servers.find((s) => s.ip === data.ip && s.port === data.port)
          ) {
            store.addServer(data);
          }
        }
        console.log("decoded qr code:", result);
      },
      { maxScansPerSecond: 2 },
    );
    setScanner(qrScanner);
    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [store, store.servers]);

  function start() {
    const video = ref.current;
    if (!video) {
      return;
    }
    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      setStream(stream);
      scanner?.start();
    });
  }
  return (
    <div className="space-y-4 px-8 py-4">
      <div className="border border-black">
        <video ref={ref} className="aspect-[9/16] w-full" />
      </div>
      <Button onClick={start} color="primary">
        Start
      </Button>
    </div>
  );
}, Header);

export default QRCodeScanner;
