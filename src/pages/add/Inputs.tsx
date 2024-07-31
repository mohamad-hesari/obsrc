import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { Button, Loading } from "../../components";

import { withLayout } from "../../hocs";
import hooks from "../../hooks";
import { useTilesStore } from "../../stores";
import { uuid } from "../../utils";
import { OBSSceneItem } from "../../obs/helper";
import { useForceOBSContext, useOBSContextStore } from "../../obs";

function Header() {
  return (
    <div className="flex items-center space-x-2">
      <Button as={Link} to="/add" icon={FaArrowLeft} rounded color="glasses" />
      <span>Add Scene Title</span>
    </div>
  );
}

const Inputs = withLayout(
  function Inputs() {
    const navigate = useNavigate();

    const query = hooks.requests.inputs.useGetAudioItems();
    const store = useTilesStore();
    const helperStore = useOBSContextStore();
    const helper = useForceOBSContext();
    const serverId = helper.controller.server.id;
    if (query.isLoading) return <Loading />;
    function handleClick(item: OBSSceneItem) {
      return () => {
        store.addTile({
          id: uuid(),
          name: item.fullSourceName,
          data: item,
          type: "input",
          serverId: serverId ?? "",
        });
        navigate("/");
        helperStore.setSelected("");
      };
    }
    return (
      <div className="divide-y divide-gray-400 [&>*]:rounded-none [&>*]:px-0 [&>*]:py-2">
        {query.data
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => (
            <Button
              key={`kind-${item.key}`}
              color="glasses"
              type="button"
              onClick={handleClick(item)}
              className="flex w-full items-center justify-between !text-black">
              <div className="text-start">
                <div className="font-semibold">{item.name}</div>
              </div>
            </Button>
          ))}
      </div>
    );
  },
  Header,
  true,
);

export default Inputs;
