import React from "react";
import { Link } from "react-router-dom";

import { withLayout } from "../hocs";
import { Button } from "../components";
import { useOBSContextStore } from "../obs";
import { useServersStore } from "../stores";

function Header() {
  return (
    <div className="flex items-center justify-between">
      <span>OBS Remote Controller</span>
    </div>
  );
}

const Connect = withLayout(function Connect() {
  const [loading, setLoading] = React.useState("");
  const helperStore = useOBSContextStore();
  const serverStore = useServersStore();
  const helpers = useOBSContextStore((state) => state.helpers);

  const data = React.useMemo(() => {
    return serverStore.servers.map((server) => {
      const helper = helpers.find(
        (h) => h.helper.controller.server.id === server.id,
      );
      return {
        ...server,
        text: `${server.ip}:${server.port}`,
        loading: !!helper?.helper.controller.loading,
        connected: !!helper?.helper.controller.connected,
        async handleClick() {
          setLoading(server.id);
          try {
            if (helper) {
              await helper.helper.controller.disconnect();
              helperStore.removeHelper(helper.id);
              return;
            }
            await helperStore.addHelper(server);
          } finally {
            setLoading("");
          }
        },
      };
    });
  }, [serverStore, helperStore, helpers]);
  return (
    <div className="flex flex-col space-y-4 pt-4 text-center">
      <span>Connect</span>
      <Button as={Link} to="/qr-code" color="primary">
        QR Code
      </Button>
      {data.map(({ id, text, handleClick, connected }) => (
        <Button
          key={id}
          type="button"
          color={connected ? "secondary" : "primary"}
          disabled={loading !== ""}
          loading={id === loading}
          onClick={handleClick}>
          {text}
        </Button>
      ))}
      <Button type="button" color="glasses" className="!text-blue-500">
        Connect Manually
      </Button>
    </div>
  );
}, Header);

export default Connect;
