import { Empty, Select, SelectProps, Spin } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { useDelayedLoading } from "@/shared/lib";
import isNil from "lodash/isNil";

interface FetchSelectProps<Entity, Multiple extends boolean>
  extends Omit<
    SelectProps,
    | "labelInValue"
    | "filterOption"
    | "showSearch"
    | "onSearch"
    | "notFoundContent"
    | "options"
    | "value"
    | "onChange"
    | "mode"
    | "onDropdownVisibleChange"
    | "loading"
  > {
  value?: Multiple extends true ? Entity[] : Entity | null;
  onChange?: (entity: Multiple extends true ? Entity[] : Entity | null) => void;
  renderLabel: (entity: Entity) => React.ReactNode;
  fetchEntities: (searchText: string) => Promise<Entity[]>;
  searchTimeout?: number;
  multiple?: Multiple;
}

/*
 * todo: test
 * case 1: удаление одного элемента из массива выбранных, если опции не загружены.
 */
export function FetchSelect<
  Entity extends {
    id: number;
  },
  Multiple extends boolean = false
>({
  value,
  onChange,
  fetchEntities,
  renderLabel,
  searchTimeout = 500,
  multiple,
  ...restProps
}: FetchSelectProps<Entity, Multiple>) {
  const [entities, setEntities] = useState<Entity[]>(() =>
    Array.isArray(value)
      ? value
      : isNil(value)
      ? []
      : [value as Multiple extends true ? never : Entity]
  );

  const fetchRef = useRef(0);
  const [fetching, setFetching] = useState(false);
  const fetchingDebounced = useDelayedLoading(fetching);

  const fetcher = useCallback(
    (searchText: string) => {
      const fetchId = ++fetchRef.current;
      setFetching(true);

      fetchEntities(searchText).then((newEntities) => {
        if (fetchId !== fetchRef.current) {
          return;
        }

        setEntities(newEntities);
        setFetching(false);
      });
    },
    [fetchEntities]
  );

  const handleSearch = useMemo(
    () => debounce(fetcher, searchTimeout),
    [searchTimeout, fetcher]
  );

  const entityToOption = (entity: Entity) => ({
    value: entity.id,
    label: renderLabel(entity),
    entity,
  });

  const options = entities.map(entityToOption);

  type SingleLabeledValue = {
    value: number;
    label: React.ReactNode;
  };

  type SelectedLabeledValue =
    | SingleLabeledValue
    | SingleLabeledValue[]
    | null
    | undefined;

  type SingleOption = SingleLabeledValue & {
    entity: Entity;
  };

  type SelectedOption = SingleOption | SingleOption[] | null | undefined;

  const handleChange = (
    _: SelectedLabeledValue,
    selectedOption: SelectedOption
  ) => {
    if (!onChange) {
      return;
    }

    if (Array.isArray(selectedOption)) {
      onChange(
        selectedOption.map(({ entity }) => entity) as Multiple extends true
          ? Entity[]
          : never
      );

      return;
    }

    onChange(
      (selectedOption ? selectedOption.entity : null) as Multiple extends true
        ? never
        : Entity | null
    );
  };

  const preparedValue: SelectedOption = (() => {
    if (value === null || value === undefined) {
      return value;
    }

    return Array.isArray(value)
      ? value.map(entityToOption)
      : entityToOption(value as Multiple extends true ? never : Entity);
  })();

  return (
    <Select
      {...restProps}
      value={preparedValue}
      onChange={handleChange}
      onDropdownVisibleChange={(open) => {
        if (open) {
          fetcher("");
        }
      }}
      labelInValue={true}
      loading={fetchingDebounced}
      filterOption={false}
      showSearch={true}
      onSearch={handleSearch}
      notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
      options={options}
      mode={multiple ? "multiple" : undefined}
    />
  );
}
