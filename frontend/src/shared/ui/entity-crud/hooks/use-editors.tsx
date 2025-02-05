import { useTranslation } from "react-i18next";
import { useFormEditor } from "./use-form-editor";

export interface ConfigCreate<EditorValue> {
  autoFocusFieldName?: string;
  renderFormContent(editorValue: Partial<EditorValue>): React.ReactNode;
  onApply(editorValue: EditorValue): Promise<unknown>;
}

export interface ConfigUpdate<Entity, EditorValue> {
  prepareForEditor(entity: Entity): EditorValue;
  autoFocusFieldName?: string;
  isEqual?(a: Partial<EditorValue>, b: Partial<EditorValue>): boolean;
  renderFormContent(
    editorValue: Partial<EditorValue>,
    entity: Entity
  ): React.ReactNode;
  onApply(editorValue: EditorValue, entity: Entity): Promise<unknown>;
}

export interface ConfigDelete<Entity, EditorValue> {
  prepareForEditor(entity: Entity): EditorValue;
  renderFormContent(
    editorValue: Partial<EditorValue>,
    entity: Entity
  ): React.ReactNode;
  onApply(editorValue: EditorValue, entity: Entity): Promise<unknown>;
}

export interface EditorsConfigs<
  Entity,
  EditorValueCreate,
  EditorValueUpdate,
  EditorValueDelete
> {
  configCreate: ConfigCreate<EditorValueCreate>;
  configUpdate: ConfigUpdate<Entity, EditorValueUpdate>;
  configDelete: ConfigDelete<Entity, EditorValueDelete>;
}

export const useEditors = <
  Entity,
  EditorValueCreate,
  EditorValueUpdate,
  EditorValueDelete
>({
  configCreate,
  configUpdate,
  configDelete,
  onAfterSave,
}: EditorsConfigs<
  Entity,
  EditorValueCreate,
  EditorValueUpdate,
  EditorValueDelete
> & { onAfterSave: () => void }) => {
  const { t } = useTranslation();

  const editorCreate = useFormEditor<EditorValueCreate, null>({
    name: "CREATE",
    autoFocusFieldName: configCreate.autoFocusFieldName,
    okText: t("add"),
    title: t("addition"),
    renderFormContent: (v) => configCreate.renderFormContent(v),
  });

  const editorUpdate = useFormEditor({
    name: "UPDATE",
    autoFocusFieldName: configUpdate.autoFocusFieldName,
    okText: t("updateVerb"),
    title: t("updateNoun"),
    renderFormContent: configUpdate.renderFormContent,
    isEqual: configUpdate.isEqual,
  });

  const editorDelete = useFormEditor({
    name: "DELETE",
    okText: t("delete"),
    title: t("deletion"),
    renderFormContent: configDelete.renderFormContent,
    okButtonProps: {
      color: "danger",
      variant: "solid",
    },
  });

  const openCreateEditor = () => {
    editorCreate.open({
      initialValue: {},
      additionalData: null,
      onSave: (nextValue) => configCreate.onApply(nextValue).then(onAfterSave),
    });
  };

  const openUpdateEditor = (entity: Entity) => {
    editorUpdate.open({
      initialValue: configUpdate.prepareForEditor(entity),
      additionalData: entity,
      onSave: (nextValue) =>
        configUpdate.onApply(nextValue, entity).then(onAfterSave),
    });
  };

  const openDeleteEditor = (entity: Entity) => {
    editorDelete.open({
      initialValue: configDelete.prepareForEditor(entity),
      additionalData: entity,
      onSave: (nextValue) =>
        configDelete.onApply(nextValue, entity).then(onAfterSave),
    });
  };

  const renderEditors = () => (
    <>
      {editorCreate.element}
      {editorUpdate.element}
      {editorDelete.element}
    </>
  );

  return {
    openCreateEditor,
    openUpdateEditor,
    openDeleteEditor,
    renderEditors,
  } as const;
};
