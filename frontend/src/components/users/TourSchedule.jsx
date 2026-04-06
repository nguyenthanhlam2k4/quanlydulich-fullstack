export const TourSchedule = ({ schedule }) => {
  if (!schedule?.length) return null
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Lịch trình chi tiết</h2>
      <div className="space-y-4">
        {schedule.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {item.day}
              </div>
              {i < schedule.length - 1 && <div className="w-0.5 flex-1 bg-blue-100 mt-1" />}
            </div>
            <div className="pb-4">
              <p className="font-medium text-gray-700 mb-1">Ngày {item.day}</p>
              <p className="text-gray-500 text-sm">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}