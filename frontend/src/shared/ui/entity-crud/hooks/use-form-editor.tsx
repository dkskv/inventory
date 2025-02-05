import { Alert, Form, Modal, ModalProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

interface FormEditorProps<T, AdditionalData>
  extends Pick<ModalProps, "okText" | "title" | "okButtonProps"> {
  name: string;
  autoFocusFieldName?: string;
  renderFormContent(
    value: Partial<T>,
    additionalData: AdditionalData
  ): React.ReactNode;
  isEqual?(a: Partial<T>, b: Partial<T>): boolean;
}

export const useFormEditor = <T, AdditionalData>({
  name,
  autoFocusFieldName,
  renderFormContent,
  isEqual,
  okButtonProps,
  ...modalProps
}: FormEditorProps<T, AdditionalData>) => {
  interface SaveCallback {
    (nextValue: T): Promise<void>;
  }

  interface OpenCallback {
    (params: {
      initialValue: Partial<T>;
      additionalData: AdditionalData;
      onSave: SaveCallback;
    }): void;
  }

  const [open, setOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const [form] = Form.useForm();
  const [error, setError] = useState<Error>();

  const currentValue: Partial<T> | undefined = Form.useWatch((v) => v, form);
  const [initialValue, setInitialValue] = useState<Partial<T>>({});
  const [additionalData, setAdditionalData] = useState<AdditionalData>();

  useEffect(() => {
    setTimeout(() => form.getFieldInstance("name")?.focus(), 1000);

    form.resetFields();
    form.setFieldsValue(initialValue);
  }, [form, initialValue]);

  const onSaveRef = useRef<SaveCallback>(Promise.resolve);

  const openEditor: OpenCallback = useCallback(
    ({ initialValue, additionalData, onSave }) => {
      onSaveRef.current = onSave;

      setInitialValue(initialValue);
      setAdditionalData(additionalData);
      setError(undefined);

      setContentVisible(true);
      setOpen(true);
    },
    []
  );

  const renderContent = () => (
    <Form
      layout="vertical"
      form={form}
      name={name}
      onFinish={(values: T) => {
        onSaveRef
          .current(values)
          .then(() => {
            setOpen(false);
          })
          .catch(setError);
      }}
    >
      {error && (
        <Form.Item>
          <Alert
            type="error"
            message={error.message}
            closable={true}
            onClose={() => setError(undefined)}
          />
        </Form.Item>
      )}
      {currentValue !== undefined &&
        additionalData !== undefined &&
        renderFormContent(currentValue, additionalData)}
    </Form>
  );

  const element = (
    <Modal
      {...modalProps}
      forceRender={true}
      closeIcon={null}
      open={open}
      onCancel={() => setOpen(false)}
      destroyOnClose={true}
      cancelText="Отменить"
      afterOpenChange={(open) => {
        if (open) {
          if (typeof autoFocusFieldName === "string") {
            form.getFieldInstance(autoFocusFieldName)?.focus();
          }
        } else {
          setInitialValue({});
          setAdditionalData(undefined);

          setContentVisible(false);
        }
      }}
      onOk={() => {
        form.submit();
      }}
      okButtonProps={{
        disabled:
          currentValue && initialValue && isEqual?.(currentValue, initialValue),
        ...okButtonProps,
      }}
    >
      {contentVisible && renderContent()}
    </Modal>
  );

  return { open: openEditor, element } as const;
};
