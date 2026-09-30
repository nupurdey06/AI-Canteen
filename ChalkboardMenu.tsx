import React, { useState, useMemo } from "react";
import { MenuItem, TrayItem } from "../types";
import {
  Search,
  Clock,
  Plus,
  Sparkles,
  Check,
  Filter,
  Heart,
  Info,
  ArrowUpDown,
  Flame
} from "lucide-react";

interface ChalkboardMenuProps {
  items: MenuItem[];
  trayItems: TrayItem[];
  favorites: string[];
  onToggleFavorite: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
  onAddToTray: (item: MenuItem) => void;
  onAskAIWithItem: (item: MenuItem) => void;
  onSelectDishForDetail: (item: MenuItem) => void;
}

export const ChalkboardMenu: React.FC<ChalkboardMenuProps> = ({
  items,
  trayItems,
  favorites,
  onToggleFavorite,
  onToggleAvailability,
  onAddToTray,
  onAskAIWithItem,
  onSelectDishForDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "prep_asc" | "calories_asc">("default");
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(0); // 0 = any
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const categories = ["All", "Main", "Side", "Snack", "Beverage"];
  const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Gluten-Free"];

  const getTrayQuantity = (itemId: string): number => {
    const found = trayItems.find((t) => t.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(item.id)) {
        return false;
      }

      // Category match
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Max price budget filter
      if (maxBudgetFilter > 0 && item.price > maxBudgetFilter) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesIngredients = item.ingredients.some((ing) =>
          ing.toLowerCase().includes(q)
        );
        const matchesTags = item.dietary_tags.some((tag) =>
          tag.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesIngredients && !matchesTags) {
          return false;
        }
      }

      // Dietary filter match
      if (selectedDietary.length > 0) {
        const hasAllSelectedDietary = selectedDietary.every((tag) =>
          item.dietary_tags.includes(tag)
        );
        if (!hasAllSelectedDietary) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "prep_asc") {
      result.sort((a, b) => a.prep_time_minutes - b.prep_time_minutes);
    } else if (sortBy === "calories_asc") {
      result.sort((a, b) => (a.calories || 300) - (b.calories || 300));
    }

    return result;
  }, [items, selectedCategory, searchQuery, selectedDietary, sortBy, maxBudgetFilter, showOnlyFavorites, favorites]);

  const toggleDietaryTag = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const inStockCount = items.filter((i) => i.is_available).length;

  return (
    <section
      id="menu-board"
      className="chalkboard-bg text-[#F2EFE4] py-14 px-4 sm:px-6 border-b border-[#F2EFE4]/20 font-body"
    >
      <div className="max-w-7xl mx-auto">
        {/* Chalkboard Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-block border-b border-dashed border-[#E3A008]/60 pb-1">
            <span className="font-receipt text-xs text-[#E3A008] uppercase tracking-widest">
              Live Kitchen Chalkboard
            </span>
          </div>
          <h2 className="font-chalk text-4xl sm:text-5xl text-[#F2EFE4] tracking-wide">
            Today's Fresh Canteen Menu
          </h2>
          <p className="text-xs sm:text-sm text-[#F2EFE4]/75">
            Prepared fresh in our student kitchen. Click any dish for recipe & nutrition details, or tap "+ Add" to stock your meal tray.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#1f2c25] border border-[#F2EFE4]/25 p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs & Favorites Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowOnlyFavorites(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-receipt uppercase transition cursor-pointer shrink-0 ${
                    selectedCategory === cat && !showOnlyFavorites
                      ? "bg-[#E3A008] text-[#2A2420] font-bold border border-[#E3A008]"
                      : "border border-[#F2EFE4]/30 text-[#F2EFE4]/80 hover:border-[#F2EFE4]"
                  }`}
                >
                  {cat === "All" ? "All Dishes" : `${cat}s`}
                </button>
              ))}

              <button
                onClick={() => setShowOnlyFavorites((prev) => !prev)}
                className={`px-3 py-1.5 text-xs font-receipt uppercase transition cursor-pointer shrink-0 flex items-center gap-1 ${
                  showOnlyFavorites
                    ? "bg-[#C1442D] text-[#F2EFE4] font-bold border border-[#C1442D]"
                    : "border border-[#F2EFE4]/30 text-[#F2EFE4]/80 hover:border-[#F2EFE4]"
                }`}
              >
                <Heart className={`w-3 h-3 ${showOnlyFavorites ? "fill-current" : ""}`} />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>

            {/* Search Box & Sort Controls */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-[#F2EFE4]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, ingredients..."
                  className="w-full bg-[#26362E] border border-[#F2EFE4]/30 pl-9 pr-3 py-1.5 text-xs text-[#F2EFE4] placeholder-[#F2EFE4]/40 focus:outline-none focus:border-[#E3A008]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#F2EFE4]/50 hover:text-[#F2EFE4]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#26362E] border border-[#F2EFE4]/30 py-1.5 px-2 text-xs font-receipt text-[#F2EFE4] focus:outline-none focus:border-[#E3A008] cursor-pointer"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="prep_asc">Prep: Fastest first</option>
                  <option value="calories_asc">Calories: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget quick-filter chips & Dietary Certifications */}
          <div className="pt-3 border-t border-[#F2EFE4]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Dietary Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-receipt text-[#F2EFE4]/60 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#E3A008]" /> Dietary:
              </span>
              {dietaryOptions.map((tag) => {
                const active = selectedDietary.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleDietaryTag(tag)}
                    className={`text-[10px] font-receipt px-2 py-0.5 uppercase transition cursor-pointer flex items-center gap-1 ${
                      active
                        ? "bg-[#F2EFE4] text-[#26362E] font-bold"
                        : "border border-dashed border-[#F2EFE4]/40 text-[#F2EFE4]/70 hover:border-[#F2EFE4]"
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}

              {/* Price filter chips */}
              <span className="text-[#F2EFE4]/30">|</span>
              <span className="text-[11px] font-receipt text-[#F2EFE4]/60">Budget:</span>
              {[
                { label: "Any", val: 0 },
                { label: "≤ ₹50", val: 50 },
                { label: "≤ ₹100", val: 100 },
                { label: "≤ ₹150", val: 150 },
              ].map((b) => (
                <button
                  key={b.val}
                  onClick={() => setMaxBudgetFilter(b.val)}
                  className={`text-[10px] font-receipt px-2 py-0.5 transition cursor-pointer ${
                    maxBudgetFilter === b.val
                      ? "bg-[#E3A008] text-[#2A2420] font-bold"
                      : "border border-[#F2EFE4]/30 text-[#F2EFE4]/70 hover:border-[#F2EFE4]"
                  }`}
                >
                  {b.label}
                </button>
              ))}

              {(selectedDietary.length > 0 || maxBudgetFilter > 0 || showOnlyFavorites) && (
                <button
                  onClick={() => {
                    setSelectedDietary([]);
                    setMaxBudgetFilter(0);
                    setShowOnlyFavorites(false);
                  }}
                  className="text-[11px] text-[#C1442D] underline ml-1 cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="font-receipt text-[11px] text-[#F2EFE4]/75">
              Showing <span className="text-[#E3A008] font-bold">{filteredItems.length}</span> dishes •{" "}
              <span className="text-emerald-400 font-bold">{inStockCount} in stock</span>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-[#1f2c25] border border-dashed border-[#F2EFE4]/30 p-10 text-center space-y-2">
            <div className="text-3xl">🍽️</div>
            <div className="font-chalk text-2xl text-[#E3A008]">
              No dishes match your selection
            </div>
            <p className="text-xs text-[#F2EFE4]/70">
              Try adjusting your search query, budget ceiling, or dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDietary([]);
                setSelectedCategory("All");
                setMaxBudgetFilter(0);
                setShowOnlyFavorites(false);
              }}
              className="mt-2 px-3 py-1 bg-[#E3A008] text-[#2A2420] text-xs font-semibold cursor-pointer"
            >
              Show all dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredItems.map((item) => {
              const trayQty = getTrayQuantity(item.id);
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  className={`bg-[#202d26] border p-4 sm:p-5 flex flex-col justify-between transition relative group ${
                    item.is_available
                      ? "border-[#F2EFE4]/25 hover:border-[#E3A008]/80 shadow-sm"
                      : "border-[#C1442D]/40 opacity-70 bg-[#241f1e]"
                  }`}
                >
                  <div>
                    {/* Card Top: Emoji, Title, Category, Favorite button, Info */}
                    <div className="flex items-start justify-between gap-2.5 mb-2.5">
                      <div
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                        onClick={() => onSelectDishForDetail(item)}
                      >
                        <span className="text-3xl shrink-0 select-none group-hover:scale-110 transition-transform">
                          {item.emoji}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-chalk text-2xl text-[#F2EFE4] leading-snug truncate group-hover:text-[#E3A008] transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-receipt text-[#F2EFE4]/60">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-[#E3A008]" /> ~{item.prep_time_minutes}m
                            </span>
                            <span>•</span>
                            <span className="italic">{item.category}</span>
                            {item.calories && (
                              <>
                                <span>•</span>
                                <span>{item.calories} kcal</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="font-receipt font-bold text-lg text-[#E3A008]">
                          ₹{item.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleFavorite(item.id)}
                            className="p-1 hover:bg-white/10 rounded-full text-[#F2EFE4]/70 hover:text-[#F2EFE4] transition cursor-pointer"
                            title={isFav ? "Remove favorite" : "Add to favorites"}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isFav ? "fill-[#C1442D] text-[#C1442D]" : "text-[#F2EFE4]/60"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => onSelectDishForDetail(item)}
                            className="p-1 hover:bg-white/10 rounded-full text-[#F2EFE4]/70 hover:text-[#F2EFE4] transition cursor-pointer"
                            title="View recipe details & nutrition"
                          >
                            <Info className="w-3.5 h-3.5 text-[#E3A008]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients preview */}
                    <p
                      onClick={() => onSelectDishForDetail(item)}
                      className="text-xs text-[#F2EFE4]/80 leading-relaxed mb-3 line-clamp-2 cursor-pointer hover:text-[#F2EFE4]"
                    >
                      {item.ingredients.join(", ")}
                    </p>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.dietary_tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rubber-stamp text-[9px] ${
                            tag.toLowerCase() === "spicy"
                              ? "rubber-stamp-chili"
                              : "border-[#F2EFE4]/40 text-[#F2EFE4]/80"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions: Stock toggle, AI combo, Add to Tray */}
                  <div className="pt-3 border-t border-[#F2EFE4]/15 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      {/* Live stock status toggle */}
                      <button
                        onClick={() => onToggleAvailability(item.id)}
                        className={`text-[10px] font-receipt px-2 py-0.5 uppercase transition cursor-pointer border ${
                          item.is_available
                            ? "border-emerald-500/60 text-emerald-400 hover:border-emerald-400"
                            : "border-[#C1442D] text-[#C1442D] bg-[#C1442D]/10 hover:bg-[#C1442D]/20"
                        }`}
                        title="Click to toggle availability on live kitchen board"
                      >
                        {item.is_available ? "● In Stock" : "✕ Sold Out"}
                      </button>

                      <button
                        onClick={() => onAskAIWithItem(item)}
                        className="text-[11px] text-[#E3A008] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Ask AI to recommend combo with this"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Combo</span>
                      </button>
                    </div>

                    {/* Add to Tray Button */}
                    <button
                      onClick={() => {
                        if (item.is_available) onAddToTray(item);
                      }}
                      disabled={!item.is_available}
                      className={`w-full py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#2A2420]/20 ${
                        !item.is_available
                          ? "bg-gray-600/40 text-gray-400 cursor-not-allowed border-gray-600/30"
                          : trayQty > 0
                          ? "bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] shadow-xs"
                          : "bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420]"
                      }`}
                    >
                      {trayQty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>In Tray ({trayQty}) • Add +1</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{item.is_available ? "Add to Order Tray" : "Sold Out Today"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
