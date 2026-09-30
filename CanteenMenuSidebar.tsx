import React, { useState } from "react";
import { MenuItem } from "../types";
import { Search, X, Clock } from "lucide-react";

interface CanteenMenuSidebarProps {
  items: MenuItem[];
  onToggleAvailability: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CanteenMenuSidebar: React.FC<CanteenMenuSidebarProps> = ({
  items,
  onToggleAvailability,
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Main", "Side", "Beverage", "Snack"];

  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      item.dietary_tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCat && matchesSearch;
  });

  const availableCount = items.filter((i) => i.is_available).length;

  return (
    <aside
      id="canteen-menu-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-80 sm:w-96 bg-[#26362E] text-[#F2EFE4] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#F2EFE4]/20 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      {/* Chalkboard Header */}
      <div className="p-4 border-b border-[#F2EFE4]/20 bg-[#212f28] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl select-none" role="img" aria-label="canteen">
              🍱
            </span>
            <h2 className="font-chalk text-2xl text-[#F2EFE4] tracking-wide leading-none">
              Daily chalkboard menu
            </h2>
          </div>
          <p className="text-xs text-[#F2EFE4]/70 mt-1 font-body">
            Counter inventory: {availableCount} of {items.length} dishes ready
          </p>
        </div>
        <button
          id="close-sidebar-button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded text-[#F2EFE4]/70 hover:text-[#F2EFE4] hover:bg-[#26362E]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chalkboard search & categories */}
      <div className="p-3 border-b border-[#F2EFE4]/15 space-y-2.5 bg-[#26362E]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#F2EFE4]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="sidebar-search-input"
            type="text"
            placeholder="Search dish, ingredients, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1e2c25] border border-[#F2EFE4]/25 rounded text-xs text-[#F2EFE4] placeholder-[#F2EFE4]/40 focus:outline-none focus:border-[#E3A008] transition font-body"
          />
        </div>

        {/* Category Underline Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#F2EFE4]/10 text-xs font-body">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-1.5 whitespace-nowrap transition border-b-2 text-xs ${
                  isSelected
                    ? "border-[#E3A008] text-[#E3A008] font-semibold"
                    : "border-transparent text-[#F2EFE4]/70 hover:text-[#F2EFE4]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chalkboard Item List - No repetitive cards, presented like a written board */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`menu-item-${item.id}`}
            className={`pb-3.5 border-b border-[#F2EFE4]/15 transition ${
              item.is_available ? "" : "opacity-60"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="text-base select-none">{item.emoji}</span>
                <span
                  className={`font-medium text-sm text-[#F2EFE4] ${
                    item.is_available ? "" : "line-through text-[#F2EFE4]/50"
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[11px] text-[#F2EFE4]/50 italic">
                  ({item.category})
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-receipt font-semibold text-sm text-[#E3A008]">
                  ₹{item.price.toFixed(2)}
                </span>
                <button
                  id={`toggle-avail-${item.id}`}
                  onClick={() => onToggleAvailability(item.id)}
                  className={`text-[10px] px-1.5 py-0.5 rounded border transition font-receipt ${
                    item.is_available
                      ? "border-[#F2EFE4]/30 text-[#F2EFE4]/80 hover:border-[#C1442D] hover:text-[#C1442D]"
                      : "border-[#C1442D] text-[#C1442D] font-bold bg-[#C1442D]/10"
                  }`}
                  title="Click to toggle stock status"
                >
                  {item.is_available ? "In stock" : "Sold out"}
                </button>
              </div>
            </div>

            {/* Ingredients in chalk style */}
            <p className="text-xs text-[#F2EFE4]/65 mt-1 leading-relaxed">
              {item.ingredients.join(" • ")}
            </p>

            {/* Details & Tags */}
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#F2EFE4]/60">
              <span className="flex items-center gap-1 font-receipt">
                <Clock className="w-3 h-3 text-[#E3A008]" />
                {item.prep_time_minutes}m
              </span>
              <span>—</span>
              <div className="flex flex-wrap gap-1.5">
                {item.dietary_tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-[#F2EFE4]/70">
                    [{tag.toLowerCase()}]
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-[#F2EFE4]/50 text-xs italic font-chalk text-lg">
            No dishes listed under this heading today.
          </div>
        )}
      </div>

      {/* Board Footer */}
      <div className="p-3 border-t border-[#F2EFE4]/20 bg-[#212f28] text-xs text-[#F2EFE4]/60 flex items-center justify-between font-body">
        <span>Campus canteen counter</span>
        <span className="font-receipt text-[11px]">₹ Indian Rupees</span>
      </div>
    </aside>
  );
};

