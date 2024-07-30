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

const Sources = withLayout(
  function Sources() {
    const navigate = useNavigate();
    const query = hooks.requests.scenes.useGetAllItems();
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
          type: "source",
          serverId: serverId ?? "",
        });
        navigate("/");
        helperStore.setSelected("");
      };
    }
    return (
      <div className="divide-y divide-gray-400 [&>*]:rounded-none [&>*]:px-0 [&>*]:py-2">
        {query.data
          ?.sort((a, b) => a.fullSourceName.localeCompare(b.fullSourceName))
          ?.map((item) => (
            <Button
              key={`scene-${item.key}`}
              color="glasses"
              type="button"
              onClick={handleClick(item)}
              className="flex w-full items-center justify-between !text-black">
              <div className="text-start">
                <div className="font-semibold">{item.fullSourceName}</div>
              </div>
            </Button>
          ))}
      </div>
    );
  },
  Header,
  true,
);

export default Sources;
