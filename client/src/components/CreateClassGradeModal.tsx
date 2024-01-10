import { useEffect, useState } from "react";
import {
  SortableContainer,
  SortableElement,
  SortEnd,
  SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Button, Form, Input, Row, Col, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { MdDragIndicator } from "react-icons/md";
import { toast } from "react-toastify";

interface PropType {
  fields: any[];
  setFields: React.Dispatch<React.SetStateAction<any[]>>;
  handleCreateGradeOk: (values: any) => void;
}

interface SortableItemProps {
  value: any;
}

interface SortableListProps {
  items: any[];
  onSortEnd: (sort: SortEnd) => void;
}

const CreateClassGradeModal = (props: PropType) => {
  const { fields, setFields, handleCreateGradeOk } = props;

  const [currentIndex, setCurrentIndex] = useState<number | null>(
    fields.length
  );

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  useEffect(() => {
    if (fields.length !== 0) setCurrentIndex(fields.length - 1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddField = () => {
    if (currentIndex === null && fields.length === 0) {
      setCurrentIndex(0);
      setFields([{ name: 0, key: 0, isListField: true, fieldKey: 0 }]);
    }

    if (currentIndex !== null) {
      let curr = currentIndex;
      curr = curr + 1;
      setCurrentIndex(curr);
      setFields([
        ...fields,
        { name: curr, key: curr, isListField: true, fieldKey: curr },
      ]);
    }
  };

  const checkRemovableField = (name: string) => {
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].name == name && fields[i].exams && fields[i].exams?.length != 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  const handleRemoveFeild = (name: string) => {
    if (!checkRemovableField(name)) {
      toast.error("Can't delete this grade column!");
      return;
    }
    console.log("cont to del")
    if (fields.length === 0) setCurrentIndex(null);

    if (currentIndex !== null && currentIndex > 0) {
      let curr = currentIndex;
      curr = curr - 1;
      setCurrentIndex(curr);
    }

    setFields(
      fields.filter((item) => {
        return item.name !== name;
      })
    );
  };

  const DragHandle = SortableHandle(() => (
    <Form.Item>
      <MdDragIndicator size={30} />
    </Form.Item>
  ));

  const FieldCard = ({ value }: any) => {
    const { fieldKey, name, scale } = value;

    return (
      <Row key={fieldKey} gutter={16}>
        <Col xs={{ span: 2 }} md={{ span: 1 }} xxl={{ span: 1 }}>
          <DragHandle />
        </Col>

        <Col xs={{ span: 8 }} md={{ span: 10 }} xxl={{ span: 11 }}>
          <Form.Item
            name={[name, "name"]}
            rules={[{ required: true, message: "Missing name" }]}
            initialValue={scale === undefined ? "" : name}
          >
            <Input placeholder="Name" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 7 }} md={{ span: 8 }} xxl={{ span: 8 }}>
          <Form.Item
            name={[name, "scale"]}
            rules={[{ required: true, message: "Missing scale" }]}
            initialValue={scale}
          >
            <InputNumber placeholder="Scale" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 7 }} md={{ span: 5 }} xxl={{ span: 4 }}>
          <Form.Item>
            <div className="flex justify-end gap-3">
              <Button
                danger
                type="primary"
                htmlType="button"
                onClick={() => {
                  // console.log("DELETE", name);
                  handleRemoveFeild(name);
                }}
              >
                Remove
              </Button>
              {/* <Button
                type="primary"
                htmlType="button"
                onClick={() => {
                  // console.log("FINALIZE", name);
                }}
              >
                Finalize
              </Button> */}
            </div>
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const SortableItem = SortableElement<SortableItemProps>(({ value }: any) => {
    return <FieldCard value={value} />;
  });

  const SortableList = SortableContainer<SortableListProps>(
    ({ items }: any) => {
      return (
        <div
          className={`px-2 py-4 mb-5 border border-solid rounded-md max-h-[300px] overflow-y-auto overflow-x-hidden ${isDarkMode ? "border-zinc-700" : "border-zinc-300"
            }`}
        >
          {items.length !== 0 &&
            items[0] != undefined &&
            items.map((value: any, index: any) => {
              return (
                <SortableItem
                  key={`item-${index}`}
                  index={index}
                  value={value}
                />
              );
            })}
        </div>
      );
    }
  );

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    const newFields = arrayMoveImmutable(fields, oldIndex, newIndex);
    setFields(newFields);
  };

  return (
    <div className="w-[100%] mt-10 mb-5 flex flex-col gap-14 items-start">
      <Form
        className="w-[100%]"
        name="create-grade-form"
        onFinish={handleCreateGradeOk}
        autoComplete="off"
      >
        <Form.List name="grades">
          {(_) => {
            return (
              <div>
                <SortableList
                  items={fields}
                  onSortEnd={onSortEnd}
                  useDragHandle
                />

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      handleAddField();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item>
          <div className="flex gap-3 justify-end">
            <Button type="primary" htmlType="submit">
              Save
            </Button>

            {/* <Button htmlType="button">Save</Button> */}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateClassGradeModal;
