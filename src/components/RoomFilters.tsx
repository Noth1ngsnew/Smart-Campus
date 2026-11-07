export default function RoomFilters({
  attendeesRaw,
  onAttendeesChange,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
}: {
  attendeesRaw: string;
  onAttendeesChange: (value: string) => void;
  equipmentOptions: string[];
  selectedEquipment: string[];
  onToggleEquipment: (item: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Attendees</span>
        <input
          type="number"
          inputMode="numeric"
          step={1}
          min={1}
          value={attendeesRaw}
          onChange={(e) => onAttendeesChange(e.target.value)}
          placeholder="Any"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-slate-700">Equipment</legend>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 select-none"
            >
              <input
                type="checkbox"
                checked={selectedEquipment.includes(item)}
                onChange={() => onToggleEquipment(item)}
                className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
