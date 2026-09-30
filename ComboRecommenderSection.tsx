import React, { useState } from "react";
import { MenuItem, RecommendationResult } from "../types";
import { RecommendationCard } from "./RecommendationCard";
import {
  Sparkles,
  Clock,
  Send,
  RotateCcw,
  Minus,
  Plus,
  Check,
  Receipt,
  Utensils,
  History,
} from "lucide-react";

interface ComboRecommenderSectionProps {
  menuItems: MenuItem[];
  budget: number;
  maxPrepTime: number;
  dietaryTags: string[];
  selectedMood: string;
  onBudgetChange: (val: number) => void;
  onPrepTimeChange: (val: number) => void;
  onToggleDietary: (tag: string) => void;
  onSelectMood: (mood: string) => void;
  onRequestRecommendation: (prompt: string) => Promise<void>;
  currentResult: RecommendationResult | null;
  historyResults: { id: string; prompt: string; result: RecommendationResult; time: string }[];
  isLoading: boolean;
  onAddComboToTray: (items: MenuItem[]) => void;
}

export const ComboRecommenderSection: React.FC<ComboRecommenderSectionProps> = ({
  menuItems,
  budget,
  maxPrepTime,
  dietaryTags,
  selectedMood,
  onBudgetChange,
  onPrepTimeChange,
  onToggleDietary,
  onSelectMood,
  onRequestRecommendation,
  currentResult,
  historyResults,
  isLoading,
  onAddComboToTray,
}) => {
  const [customText, setCustomText] = useState<string>("");
  const [activeHistoryIndex, setActiveHistoryIndex] = useState<number>(-1);

  const moodOptions = [
    { label: "Exams / Study revision", value: "Stressed and studying for exams, need warm comfort and brain food" },
    { label: "Short break (10m rush)", value: "Super tight break between lectures, need ultra-fast pickup meal" },
    { label: "Clean & light", value: "Craving fresh, light, and nutritious canteen food" },
    { label: "Comfort cravings", value: "Craving warm, savory canteen comfort food" },
    { label: "Post-workout protein", value: "Need high energy and satisfying protein" },
  ];

  const quickScenarios = [
    {
      title: "Stressed Vegetarian",
      prompt: "I have ₹150, I'm stressed with finals, only have 15 mins, and I'm vegetarian.",
      badge: "₹150 • 15m",
      budget: 150,
      time: 15,
      diet: ["Vegetarian"],
    },
    {
      title: "Vegan Quick Rush",
      prompt: "I need a clean Vegan lunch with an iced caffeine boost under ₹120 ready in 8 minutes!",
      badge: "₹120 • 8m",
      budget: 120,
      time: 8,
      diet: ["Vegan"],
    },
    {
      title: "Hearty Halal Lunch",
      prompt: "Looking for a hearty Halal and Gluten-Free meal under ₹160 before my 1pm class.",
      badge: "₹160 • 12m",
      budget: 160,
      time: 12,
      diet: ["Halal", "Gluten-Free"],
    },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = customText.trim() || `Recommend a balanced combo under ₹${budget} ready in ${maxPrepTime} mins.`;
    onRequestRecommendation(text);
  };

  const handleScenarioClick = (scenario: typeof quickScenarios[0]) => {
    onBudgetChange(scenario.budget);
    onPrepTimeChange(scenario.time);
    scenario.diet.forEach((d) => {
      if (!dietaryTags.includes(d)) onToggleDietary(d);
    });
    setCustomText(scenario.prompt);
    onRequestRecommendation(scenario.prompt);
  };

  // The displayed result is either the selected history item or current latest result
  const displayResult =
    activeHistoryIndex >= 0 && historyResults[activeHistoryIndex]
      ? historyResults[activeHistoryIndex].result
      : currentResult;

  return (
    <section
      id="recommender"
      className="py-14 bg-[#FBF6EC] text-[#2A2420] border-b border-[#2A2420]/20 font-body"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 border-b border-dashed border-[#E3A008] pb-0.5">
            <Sparkles className="w-4 h-4 text-[#E3A008]" />
            <span className="font-receipt text-xs text-[#2A2420] uppercase tracking-wider font-semibold">
              Interactive Digital Counter
            </span>
          </div>
          <h2 className="font-chalk text-4xl sm:text-5xl text-[#2A2420]">
            Smart Meal Combo Recommender
          </h2>
          <p className="text-xs sm:text-sm text-[#2A2420]/75 max-w-xl mx-auto">
            Set your budget and lecture break time below. Our Gemini assistant cross-references
            today's live menu inventory and generates an optimal printed token slip.
          </p>
        </div>

        {/* Two-Column Layout: Console Pad & Receipt Slip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Student Order Console (7 cols) */}
          <div className="lg:col-span-7 bg-[#F6EFE2] border border-[#2A2420]/25 p-5 sm:p-7 shadow-xs space-y-6">
            {/* 1. Steppers: Budget & Prep Time */}
            <div>
              <div className="text-xs font-semibold text-[#2A2420] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>1. Budget & Time Constraints</span>
                <span className="text-[10px] font-receipt text-[#2A2420]/60">tactile steppers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Budget Stepper */}
                <div className="bg-[#FBF6EC] border border-[#2A2420]/25 p-3.5 shadow-xs">
                  <div className="text-[11px] text-[#2A2420]/75 flex justify-between items-center mb-1">
                    <span>Student Budget Limit</span>
                    <span className="font-receipt text-[10px] text-[#2A2420]/50">Max ₹400</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => onBudgetChange(Math.max(30, budget - 10))}
                      className="w-8 h-8 flex items-center justify-center border border-[#2A2420]/30 hover:bg-[#2A2420]/10 text-[#2A2420] transition cursor-pointer"
                      aria-label="Decrease budget"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <span className="font-receipt font-bold text-2xl text-[#2A2420]">
                        ₹{budget.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => onBudgetChange(Math.min(400, budget + 10))}
                      className="w-8 h-8 flex items-center justify-center border border-[#2A2420]/30 hover:bg-[#2A2420]/10 text-[#2A2420] transition cursor-pointer"
                      aria-label="Increase budget"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Budget Presets */}
                  <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-dotted border-[#2A2420]/20 text-[10px] font-receipt">
                    {[60, 100, 150, 220].map((val) => (
                      <button
                        key={val}
                        onClick={() => onBudgetChange(val)}
                        className={`px-1.5 py-0.5 border cursor-pointer ${
                          budget === val
                            ? "bg-[#2A2420] text-[#FBF6EC] border-[#2A2420]"
                            : "border-[#2A2420]/30 text-[#2A2420]/70 hover:border-[#2A2420]"
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prep Time Stepper */}
                <div className="bg-[#FBF6EC] border border-[#2A2420]/25 p-3.5 shadow-xs">
                  <div className="text-[11px] text-[#2A2420]/75 flex justify-between items-center mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Max Ready Wait Time
                    </span>
                    <span className="font-receipt text-[10px] text-[#2A2420]/50">Kitchen timer</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => onPrepTimeChange(Math.max(3, maxPrepTime - 2))}
                      className="w-8 h-8 flex items-center justify-center border border-[#2A2420]/30 hover:bg-[#2A2420]/10 text-[#2A2420] transition cursor-pointer"
                      aria-label="Decrease time"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <span className="font-receipt font-bold text-2xl text-[#2A2420]">
                        {maxPrepTime} mins
                      </span>
                    </div>
                    <button
                      onClick={() => onPrepTimeChange(Math.min(35, maxPrepTime + 2))}
                      className="w-8 h-8 flex items-center justify-center border border-[#2A2420]/30 hover:bg-[#2A2420]/10 text-[#2A2420] transition cursor-pointer"
                      aria-label="Increase time"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Time Presets */}
                  <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-dotted border-[#2A2420]/20 text-[10px] font-receipt">
                    {[5, 10, 15, 25].map((val) => (
                      <button
                        key={val}
                        onClick={() => onPrepTimeChange(val)}
                        className={`px-1.5 py-0.5 border cursor-pointer ${
                          maxPrepTime === val
                            ? "bg-[#2A2420] text-[#FBF6EC] border-[#2A2420]"
                            : "border-[#2A2420]/30 text-[#2A2420]/70 hover:border-[#2A2420]"
                        }`}
                      >
                        {val}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Dietary Stamps */}
            <div>
              <div className="text-xs font-semibold text-[#2A2420] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>2. Dietary Preferences</span>
                <span className="text-[10px] font-receipt text-[#2A2420]/60">kitchen stamps</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Vegetarian", "Vegan", "Halal", "Gluten-Free"].map((tag) => {
                  const isSelected = dietaryTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => onToggleDietary(tag)}
                      className={`text-xs px-3 py-1 font-receipt uppercase transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "border-2 border-[#2A2420] bg-[#2A2420] text-[#FBF6EC] font-semibold"
                          : "border border-dashed border-[#2A2420]/40 text-[#2A2420]/75 hover:border-[#2A2420]"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Mood & Cravings (Underline selector) */}
            <div>
              <div className="text-xs font-semibold text-[#2A2420] uppercase tracking-wider mb-2">
                <span>3. Campus Mood & Context</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {moodOptions.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => onSelectMood(selectedMood === m.value ? "" : m.value)}
                    className={`text-xs py-0.5 transition cursor-pointer ${
                      selectedMood === m.value
                        ? "border-b-2 border-[#E3A008] text-[#2A2420] font-bold"
                        : "text-[#2A2420]/70 hover:text-[#2A2420]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
                {selectedMood && (
                  <button
                    onClick={() => onSelectMood("")}
                    className="text-[11px] text-[#C1442D] underline ml-1 cursor-pointer"
                  >
                    Clear mood
                  </button>
                )}
              </div>
            </div>

            {/* 4. One-Click Sample Orders */}
            <div>
              <div className="text-xs font-semibold text-[#2A2420] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>4. Quick Scenarios</span>
                <span className="text-[10px] font-receipt text-[#2A2420]/60">one-click testing</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {quickScenarios.map((sc) => (
                  <button
                    key={sc.title}
                    onClick={() => handleScenarioClick(sc)}
                    className="p-2.5 text-left bg-[#FBF6EC] border border-[#2A2420]/25 hover:border-[#E3A008] transition text-[#2A2420] cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-[#2A2420] group-hover:text-[#C1442D] transition flex items-center justify-between">
                      <span>{sc.title}</span>
                      <span className="text-[10px] font-receipt text-[#2A2420]/60">{sc.badge}</span>
                    </div>
                    <div className="text-[11px] text-[#2A2420]/70 mt-1 line-clamp-2">
                      "{sc.prompt}"
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Order Prompt Textarea */}
            <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-[#2A2420]/15">
              <label
                htmlFor="recommender-prompt"
                className="block text-xs font-semibold text-[#2A2420] uppercase tracking-wider"
              >
                5. Custom Order Request Note
              </label>
              <div className="relative">
                <textarea
                  id="recommender-prompt"
                  rows={2}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. 'I want something spicy with hot chai before 2 PM chemistry lecture under ₹120'..."
                  className="w-full bg-[#FBF6EC] border border-[#2A2420]/35 p-3 text-xs sm:text-sm text-[#2A2420] placeholder-[#2A2420]/45 focus:outline-none focus:border-[#2A2420]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-receipt text-[#2A2420]/65">
                  Filters applied: ₹{budget} • {maxPrepTime}m wait • {dietaryTags.length || "All"} tags
                </span>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50 border border-[#2A2420]/25 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#2A2420] border-t-transparent rounded-full animate-spin"></span>
                      <span>Calculating Kitchen Combo...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#2A2420]" />
                      <span>Generate Combo Slip</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Printed Order Slip Receipt Desk (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            {/* History Selector if more than 1 recommendation exists */}
            {historyResults.length > 1 && (
              <div className="bg-[#F6EFE2] border border-[#2A2420]/20 p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-receipt text-[11px] text-[#2A2420]/80">
                  <History className="w-3.5 h-3.5 text-[#E3A008]" />
                  <span>Recent Slips ({historyResults.length}):</span>
                </div>
                <div className="flex items-center gap-1">
                  {historyResults.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHistoryIndex(idx)}
                      className={`px-2 py-0.5 text-[10px] font-receipt border cursor-pointer ${
                        (activeHistoryIndex === idx || (activeHistoryIndex === -1 && idx === historyResults.length - 1))
                          ? "bg-[#2A2420] text-[#FBF6EC] border-[#2A2420] font-bold"
                          : "border-[#2A2420]/30 hover:bg-[#2A2420]/10"
                      }`}
                    >
                      Slip #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Display the active Recommendation Card or a blank Waiting Slip */}
            {isLoading ? (
              <div className="bg-[#FBF6EC] border-x border-[#2A2420]/20 p-8 shadow-md text-center space-y-3 font-body receipt-tear-top receipt-tear-bottom">
                <div className="w-8 h-8 mx-auto border-2 border-[#E3A008] border-t-transparent rounded-full animate-spin"></div>
                <div className="font-chalk text-2xl text-[#2A2420]">
                  Printing Kitchen Slip...
                </div>
                <p className="text-xs text-[#2A2420]/70 font-receipt">
                  Verifying current pan inventory, prep times & calorie budget...
                </p>
              </div>
            ) : displayResult ? (
              <RecommendationCard
                data={displayResult}
                allItems={menuItems}
                budgetLimit={budget}
                maxPrepTime={maxPrepTime}
                onAddComboToTray={onAddComboToTray}
              />
            ) : (
              /* Waiting Slip state */
              <div className="bg-[#FBF6EC] text-[#2A2420] border-x border-[#2A2420]/20 p-7 shadow-sm font-body text-center space-y-4 receipt-tear-top receipt-tear-bottom">
                <div className="pb-3 border-b border-dashed border-[#2A2420]/30">
                  <div className="font-chalk text-2xl text-[#2A2420]">
                    Campus Canteen Token Slip
                  </div>
                  <div className="font-receipt text-[11px] text-[#2A2420]/60">
                    AWAITING ORDER SPECIFICATIONS
                  </div>
                </div>

                <div className="py-6 space-y-3">
                  <div className="text-4xl select-none">🧾</div>
                  <p className="text-xs text-[#2A2420]/80 max-w-xs mx-auto leading-relaxed">
                    Select your budget or click any quick scenario on the left to print a personalized
                    canteen combo slip.
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#2A2420]/30 text-[11px] font-receipt text-[#2A2420]/60">
                  Window 1 & 2 Ready • Cash & UPI accepted
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
