import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { Button, Loading } from "../../components";

import { withLayout } from "../../hocs";
import hooks from "../../hooks";
import { useTilesStore } from "../../stores";
import { uuid } from "../../utils";
import { useForceOBSContext, useOBSContextStore } from "../../obs";

function Header() {
  return (
    <div className="flex items-center space-x-2">
      <Button as={Link} to="/add" icon={FaArrowLeft} rounded color="glasses" />
      <span>Add Scene Title</span>
    </div>
  );
}

const HotKeys = withLayout(
  function HotKeys() {
    const navigate = useNavigate();
    const store = useTilesStore();
    const helperStore = useOBSContextStore();
    const helper = useForceOBSContext();
    const serverId = helper.controller.server.id;
    const query = hooks.requests.general.useGetHotkeyList();
    if (query.isLoading) return <Loading />;
    function handleSceneChange(hotkey: string) {
      return () => {
        store.addTile({
          id: uuid(),
          name: hotkey,
          data: hotkey,
          type: "hotkey",
          serverId: serverId ?? "",
        });
        navigate("/");
        helperStore.setSelected("");
      };
    }
    return (
      <div className="divide-y divide-gray-400 [&>*]:rounded-none [&>*]:px-0 [&>*]:py-2">
        {query.data?.map((hotkey) => (
          <Button
            key={hotkey}
            color="glasses"
            type="button"
            onClick={handleSceneChange(hotkey)}
            className="flex w-full items-center justify-between !text-black">
            <div className="text-start">
              <div className="font-semibold">{hotkey}</div>
            </div>
          </Button>
        ))}
      </div>
    );
  },
  Header,
  true,
);

export default HotKeys;
