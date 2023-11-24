import { useState } from "react";
import { Button, Modal, Tabs } from "antd";
import type { TabsProps } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import {
  manual,
  languageHistory,
  mathScience,
  art,
  sport,
  more,
} from "../utils/utils";

interface PropType {
  open: boolean;
  confirmLoading: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  themeUrl: string;
  setThemeUrl: React.Dispatch<React.SetStateAction<string>>;
}

const onChange = (key: string) => {
  console.log(key);
};

const ClassNewEditModal = (props: PropType) => {
  const {
    open,
    confirmLoading,
    handleOk,
    handleCancel,
    themeUrl,
    setThemeUrl,
  } = props;

  const [themeList, setThemeList] = useState<boolean>(false);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Manual",
      children: (
        <div className="flex gap-5 flex-wrap">
          {manual?.map((item) => {
            return (
              <div key={item} className="relative group">
                <img
                  className="w-[300px] rounded-md hover:shadow-xl hover:cursor-pointer"
                  src={`../../class theme/${item}`}
                  alt="theme"
                  onClick={() => {
                    setThemeUrl(item);
                  }}
                />
                <CheckCircleOutlined className="hidden absolute top-[5px] left-[10px]  group-hover:block" />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "2",
      label: "Language & History",
      children: (
        <div className="flex gap-5 flex-wrap">
          {languageHistory?.map((item) => {
            return (
              <div key={item} className="relative group">
                <img
                  className="w-[300px] rounded-md hover:shadow-xl hover:cursor-pointer"
                  src={`../../class theme/${item}`}
                  alt="theme"
                  onClick={() => {
                    setThemeUrl(item);
                  }}
                />
                <CheckCircleOutlined className="hidden absolute top-[5px] left-[10px]  group-hover:block" />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "3",
      label: "Math & Science",
      children: (
        <div className="flex gap-5 flex-wrap">
          {mathScience?.map((item) => {
            return (
              <div key={item} className="relative group">
                <img
                  className="w-[300px] rounded-md hover:shadow-xl hover:cursor-pointer"
                  src={`../../class theme/${item}`}
                  alt="theme"
                  onClick={() => {
                    setThemeUrl(item);
                  }}
                />
                <CheckCircleOutlined className="hidden absolute top-[5px] left-[10px]  group-hover:block" />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "4",
      label: "Art",
      children: (
        <div className="flex gap-5 flex-wrap">
          {art?.map((item) => {
            return (
              <div key={item} className="relative group">
                <img
                  className="w-[300px] rounded-md hover:shadow-xl hover:cursor-pointer"
                  src={`../../class theme/${item}`}
                  alt="theme"
                  onClick={() => {
                    setThemeUrl(item);
                  }}
                />
                <CheckCircleOutlined className="hidden absolute top-[5px] left-[10px]  group-hover:block" />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "5",
      label: "Sport",
      children: (
        <div className="flex gap-5 flex-wrap">
          {sport?.map((item) => {
            return (
              <div key={item} className="relative group">
                <img
                  className="w-[300px] rounded-md hover:shadow-xl hover:cursor-pointer"
                  src={`../../class theme/${item}`}
                  alt="theme"
                  onClick={() => {
                    setThemeUrl(item);
                  }}
                />
                <CheckCircleOutlined className="hidden absolute top-[5px] left-[10px]  group-hover:block" />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "6",
      label: "More",
      children: (
        <div className="flex gap-5 flex-wrap">
          {more?.map((item) => {
            return (
              <div key={item} className="relative group">
                <img
                  className="w-[300px] rounded-md hover:shadow-xl hover:cursor-pointer"
                  src={`../../class theme/${item}`}
                  alt="theme"
                  onClick={() => {
                    setThemeUrl(item);
                  }}
                />
                <CheckCircleOutlined className="hidden absolute top-[5px] left-[10px]  group-hover:block" />
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Theme customize"
      width={800}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <div className="flex flex-col">
        <img
          className="rounded-md"
          src={`../../class theme/${themeUrl}`}
          alt="theme"
        />
        <div className="my-10 flex justify-between">
          <p>Choose theme for your class news</p>
          <Button
            type="primary"
            onClick={() => {
              setThemeList(!themeList);
            }}
          >
            Choose image
          </Button>
        </div>
      </div>
      {themeList && (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      )}
    </Modal>
  );
};

export default ClassNewEditModal;
