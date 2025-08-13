import React from "react";
import {
  Bars3Icon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Button } from "../UI";

const Header = () => {
  const { toggleFilterPanel, isFilterPanelExpanded } = useAppStore();

  return (
    <header className="h-16 bg-blue-50 flex items-center justify-center px-6">
      <div className="flex items-center space-x-4">
        {/* Mobile filter toggle */}

        <div className="text-xl font-semibold text-gray-900">
        </div>
      </div>
    </header>
  );
};

export default Header;
