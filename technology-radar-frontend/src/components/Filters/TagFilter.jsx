import React from "react";
import { HashtagIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Checkbox, Badge } from "../UI";

const TagFilter = ({ tags }) => {
  const { filters, updateFilters } = useAppStore();

  const handleTagToggle = (tagId) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];

    updateFilters({ tags: newTags });
  };

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <HashtagIcon className="w-4 h-4 mr-2" />
            Tag
          </h3>
          <Badge variant="default" size="sm">
            {tags.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {tags.map((tag) => {
            const isSelected = filters.tags?.includes(tag.id);
            const bgColorClass =
              tag.name === "Leading"
                ? "bg-green-50 border-green-200"
                : tag.name === "Nascent"
                ? "bg-pink-50 border-pink-200"
                : "bg-blue-50 border-blue-200";

            return (
              <label
                key={tag.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${bgColorClass} ${
                  isSelected
                    ? "ring-2 ring-primary-blue ring-opacity-50"
                    : "hover:bg-opacity-80"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleTagToggle(tag.id)}
                  className="w-4 h-4 text-primary-blue bg-white border-gray-300 rounded focus:ring-primary-blue focus:ring-2"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {tag.name}
                    </span>
                    <Badge color={tag.color} size="sm">
                      {tag.count}
                    </Badge>
                  </div>
                  {tag.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {tag.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
