import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { Button, Loading } from "../../components";

import { withLayout } from "../../hocs";
import hooks from "../../hooks";
import { useTilesStore } from "../../stores";
import { uuid } from "../../utils";
import { OBSScene } from "../../obs/helper";
import { useForceOBSContext, useOBSContextStore } from "../../obs";

function Header() {
  return (
    <div className="flex items-center space-x-2">
      <Button as={Link} to="/add" icon={FaArrowLeft} rounded color="glasses" />
      <span>Add Scene Title</span>
    </div>
  );
}

const Scenes = withLayout(
  function Scenes() {
    const navigate = useNavigate();
    const query = hooks.requests.scenes.useScenes();
    const store = useTilesStore();
    const helperStore = useOBSContextStore();
    const helper = useForceOBSContext();
    const serverId = helper.controller.server.id;
    if (query.isLoading) return <Loading />;
    function handleClick(scene: OBSScene) {
      return () => {
        store.addTile({
          id: uuid(),
          name: scene.name,
          data: scene,
          type: "switch-scene",
          serverId: serverId ?? "",
        });
        navigate("/");
        helperStore.setSelected("");
      };
    }
    return (
      <div className="divide-y divide-gray-400 [&>*]:rounded-none [&>*]:px-0 [&>*]:py-2">
        {query.data?.map((scene) => (
          <Button
            key={scene.key}
            color="glasses"
            type="button"
            onClick={handleClick(scene)}
            className="flex w-full items-center justify-between !text-black">
            <div className="text-start">
              <div className="font-semibold">{scene.name}</div>
            </div>
          </Button>
        ))}
      </div>
    );
  },
  Header,
  true,
);

export default Scenes;
