import { useState } from "react";
import {
  SortableContainer,
  SortableElement,
  SortEnd,
  SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

import { Button, Form, Input, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { MdDragIndicator } from "react-icons/md";

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

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleAddField = () => {
    if (currentIndex === null) {
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

  const handleRemoveFeild = (name: string) => {
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

  const FieldCard = ({ fieldKey, name, restField }: any) => {
    return (
      <Row key={fieldKey} gutter={16}>
        <Col xs={{ span: 2 }} md={{ span: 1 }} xxl={{ span: 1 }}>
          <DragHandle />
        </Col>

        <Col xs={{ span: 8 }} md={{ span: 10 }} xxl={{ span: 11 }}>
          <Form.Item
            {...restField}
            name={[name, "name"]}
            rules={[{ required: true, message: "Missing name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 7 }} md={{ span: 8 }} xxl={{ span: 8 }}>
          <Form.Item
            {...restField}
            name={[name, "scale"]}
            rules={[{ required: true, message: "Missing scale" }]}
          >
            <Input placeholder="Scale" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 7 }} md={{ span: 5 }} xxl={{ span: 4 }}>
          <Form.Item>
            <div className="flex justify-end gap-3">
              <MinusCircleOutlined
                onClick={() => {
                  console.log("DELETE", name);
                  handleRemoveFeild(name);
                }}
              />
              <Button
                type="primary"
                htmlType="button"
                onClick={() => {
                  console.log("FINALIZE", name);
                }}
              >
                Finalize
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const SortableItem = SortableElement<SortableItemProps>(({ value }: any) => (
    <FieldCard
      fieldKey={value.fieldKey}
      name={value.name}
      restField={value.restField}
    />
  ));

  const SortableList = SortableContainer<SortableListProps>(
    ({ items }: any) => (
      <div>
        {items.map((value: any, index: any) => {
          return (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          );
        })}
      </div>
    )
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
