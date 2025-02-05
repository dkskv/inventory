import { useCallback, useEffect, useState } from "react";

export const useFetchHelper = <Data>(fetchData: () => Promise<Data>) => {
  const [data, setData] = useState<Data>();
  const [isLoading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const nextData = await fetchData();
    setLoading(false);

    setData(nextData);
  }, [fetchData]);

  useEffect(() => {
    // apollo сам отменяет предыдущий запрос
    refresh();
  }, [refresh]);

  return { data, isLoading, refresh } as const;
};
