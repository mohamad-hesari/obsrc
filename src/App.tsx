import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { queryClient } from "./queryClient";
import { useOBSContextStore } from "./obs";
import { useServersStore } from "./stores";
import { uuid } from "./utils";
import { Loading } from "./components";

import Home from "./pages/Home";

import Settings from "./pages/Settings";
import SettingGridSize from "./pages/SettingGridSize";
import Connect from "./pages/Connect";
import Edit from "./pages/Edit";

import AddHome from "./pages/add/Home";
import Scenes from "./pages/add/Scenes";
import HotKeys from "./pages/add/HotKeys";
import CustomHotKey from "./pages/add/CustomHotKey";
import Sources from "./pages/add/Sources";
import Inputs from "./pages/add/Inputs";

const QRCodeScanner = React.lazy(() => import("./pages/QRCodeScanner"));

function QRCodeScannerWrapper() {
  return (
    <React.Suspense fallback={<Loading />}>
      <QRCodeScanner />
    </React.Suspense>
  );
}

if (import.meta.env.NODE_ENV === "production") {
  console.log = function () {};
}

const connectedRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route path="edit" element={<Edit />} />
      <Route path="settings" element={<Settings />} />
      <Route path="settings/grid-size" element={<SettingGridSize />} />
      <Route path="add/">
        <Route index element={<AddHome />} />
        <Route path="scenes" element={<Scenes />} />
        <Route path="hot-keys" element={<HotKeys />} />
        <Route path="custom-hot-key" element={<CustomHotKey />} />
        <Route path="sources" element={<Sources />} />
        <Route path="inputs" element={<Inputs />} />
      </Route>
      <Route path="connect" element={<Connect />} />
      <Route path="qr-code" element={<QRCodeScannerWrapper />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>,
  ),
  { basename: import.meta.env.VITE_BASE_URL },
);

const connectRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* <Route index element={<Loading />} /> */}
      <Route index element={<Connect />} />
      <Route path="connect" element={<Connect />} />
      <Route path="qr-code" element={<QRCodeScannerWrapper />} />
      <Route path="*" element={<Navigate to="/connect" />} />
    </Route>,
  ),
  { basename: import.meta.env.VITE_BASE_URL },
);

function AppWrapper() {
  const [loading, setLoading] = React.useState(true);
  const ref = React.useRef(uuid());
  const helperStore = useOBSContextStore();

  React.useEffect(() => {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.remove();
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    const id = ref.current;
    async function load(state: ReturnType<typeof useServersStore.getState>) {
      if (state.servers.length === 0 || !mounted) {
        console.log(id, "No servers or this component is un mounted", {
          mounted,
          servers: state.servers,
        });
        setTimeout(() => setLoading(false), 500);
        return;
      }
      console.log(id, "Connecting to servers", state.servers);
      await Promise.all(
        state.servers.map((server) => helperStore.addHelper(server)),
      );
      console.log(id, "Finished connecting to servers");
      setTimeout(() => setLoading(false), 500);
    }
    useServersStore.persist.onFinishHydration((state) => {
      load(state);
    });
    return () => {
      mounted = false;
    };
  }, [helperStore]);

  if (loading) {
    console.log(ref.current, "App is loading");
    return <Loading />;
  }

  console.log(ref.current, "App is loaded", helperStore.helpers);

  if (helperStore.helpers.find((h) => h.helper.controller.connected))
    return <RouterProvider router={connectedRouter} />;
  return <RouterProvider router={connectRouter} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
