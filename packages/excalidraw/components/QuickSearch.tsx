import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { searchIcon } from "./icons";

import "./QuickSearch.scss";

interface QuickSearchProps {
  className?: string;
  placeholder: string;
  onChange: (term: string) => void;
}

export const QuickSearch = React.forwardRef<HTMLInputElement, QuickSearchProps>(
  ({ className, placeholder, onChange }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      onChange(searchTerm.trim().toLowerCase());
    }, [onChange, searchTerm]);

    return (
      <div className={clsx("QuickSearch__wrapper", className)}>
        {searchIcon}
        <input
          ref={ref}
          className="QuickSearch__input"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    );
  },
);