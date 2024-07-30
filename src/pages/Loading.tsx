import React from "react";

import { withLayout } from "../hocs";

function Header() {
  return (
    <div className="flex items-center justify-between">
      <span>OBS Remote Controller Loading</span>
    </div>
  );
}

const Loading = withLayout(function Loading() {
  // const context = OBSProvider.useContext();
  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   useServersStore.persist.onFinishHydration((store) => {
  //     const serverId = store.lastServer;
  //     if (serverId) {
  //       const server = store.servers.find((s) => s.id === serverId);
  //       if (server) {
  //         context.connect(server).catch(() => navigate("/connect"));
  //         return;
  //       }
  //     }
  //     navigate("/connect");
  //   });
  // }, [context, navigate]);
  // React.useEffect(() => {
  //   if (context.isFirstTry) return;
  //   if (!context.connected) {
  //     navigate("/connect");
  //   }
  // }, [context.connected, context.isFirstTry, navigate]);
  // return (
  //   <div className="flex h-screen items-center justify-center">
  //     <span>Loading...</span>
  //   </div>
  // );
  return <></>;
}, Header);

export default Loading;
