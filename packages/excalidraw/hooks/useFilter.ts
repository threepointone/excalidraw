import { useCallback, useState } from "react";

export const useFilter = <T extends Record<string, string | unknown>>(
  data: Array<T>,
  filterBy: keyof T,
  deps: unknown[] = [],
): [Array<T>, typeof filterByCallback] => {
  const [filteredData, setFilteredData] = useState(data);

  const filterByCallback = useCallback((filterTerm: string) => {
    const filteredData = data.filter((item) => {
      const prop = item[filterBy];

      if (typeof prop === "string" && prop.length) {
        return prop.toLowerCase().includes(filterTerm);
      }

      // don't filter by default
      return true;
    });

    setFilteredData(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [filteredData, filterByCallback];
};
