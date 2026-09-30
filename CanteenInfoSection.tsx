import React from "react";
import { Clock, MapPin, CreditCard, ShieldCheck, Heart, AlertCircle } from "lucide-react";

export const CanteenInfoSection: React.FC = () => {
  const timings = [
    { shift: "Morning Tiffins & Chai", time: "08:00 AM – 11:00 AM", note: "Hot idli, dosa, poha & filter coffee" },
    { shift: "Midday Lunch Service", time: "11:30 AM – 03:30 PM", note: "Thalis, rice bowls, wraps & daily curries" },
    { shift: "Evening Chai & Snacks", time: "04:30 PM – 07:30 PM", note: "Samosas, kathi rolls, lassi & cold drinks" },
    { shift: "Night Revision Counter", time: "08:00 PM – 10:30 PM", note: "Light comfort meals during exam weeks" },
  ];

  return (
    <section id="info" className="py-14 bg-[#F6EFE2] text-[#2A2420] border-b border-[#2A2420]/20 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-block border-b border-dashed border-[#2A2420]/30 pb-0.5">
            <span className="font-receipt text-xs text-[#2A2420]/70 uppercase tracking-widest">
              Campus Operations
            </span>
          </div>
          <h2 className="font-chalk text-4xl sm:text-5xl text-[#2A2420]">
            Canteen Hours & Student Guidelines
          </h2>
          <p className="text-xs sm:text-sm text-[#2A2420]/75">
            Everything you need to know about dining hall timings, payment options, and counter etiquette.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Shift Timings */}
          <div className="bg-[#FBF6EC] border border-[#2A2420]/25 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#2A2420] pb-2 border-b border-[#2A2420]/15">
              <Clock className="w-4 h-4 text-[#E3A008]" />
              <span>Daily Meal Shifts</span>
            </div>
            <div className="space-y-3">
              {timings.map((t) => (
                <div key={t.shift} className="text-xs space-y-0.5">
                  <div className="font-medium text-[#2A2420] flex justify-between">
                    <span>{t.shift}</span>
                  </div>
                  <div className="font-receipt text-[#E3A008] font-semibold text-[11px]">
                    {t.time}
                  </div>
                  <div className="text-[11px] text-[#2A2420]/65 italic">
                    {t.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Location & Windows */}
          <div className="bg-[#FBF6EC] border border-[#2A2420]/25 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#2A2420] pb-2 border-b border-[#2A2420]/15">
              <MapPin className="w-4 h-4 text-[#E3A008]" />
              <span>Location & Counter Windows</span>
            </div>
            <div className="text-xs text-[#2A2420]/80 space-y-3 leading-relaxed">
              <div>
                <span className="font-semibold text-[#2A2420] block">Campus Location:</span>
                Student Activity Center (SAC), Ground Floor, West Wing. Adjacent to the central auditorium lawn.
              </div>

              <div className="border-t border-dashed border-[#2A2420]/20 pt-2">
                <span className="font-semibold text-[#2A2420] block">Window 1 (Main Meals):</span>
                Pick-up for rice bowls, dosas, parathas, and hot chef combos.
              </div>

              <div className="border-t border-dashed border-[#2A2420]/20 pt-2">
                <span className="font-semibold text-[#2A2420] block">Window 2 (Express Tiffins):</span>
                Instant pick-up for samosas, puffs, chai, coffee, and chilled beverages.
              </div>
            </div>
          </div>

          {/* Card 3: Payments & Sustainability */}
          <div className="bg-[#FBF6EC] border border-[#2A2420]/25 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#2A2420] pb-2 border-b border-[#2A2420]/15">
              <CreditCard className="w-4 h-4 text-[#E3A008]" />
              <span>Payment & Campus Pledge</span>
            </div>
            <div className="text-xs text-[#2A2420]/80 space-y-3 leading-relaxed">
              <div>
                <span className="font-semibold text-[#2A2420] block">Accepted Payment Modes:</span>
                UPI (GPay / PhonePe / Paytm), Student RFID Dining Cards, and cash at Window 1 counter.
              </div>

              <div className="border-t border-dashed border-[#2A2420]/20 pt-2">
                <span className="font-semibold text-[#2A2420] block">Zero Waste Initiative:</span>
                All dishes are served on sanitized stainless steel trays. Please return your trays to the return conveyor station after meals.
              </div>

              <div className="border-t border-dashed border-[#2A2420]/20 pt-2 flex items-start gap-2 text-[11px] text-[#2A2420]/75">
                <AlertCircle className="w-3.5 h-3.5 text-[#E3A008] shrink-0 mt-0.5" />
                <span>Allergens: Please inform the counter supervisor for severe peanut or dairy allergies.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
