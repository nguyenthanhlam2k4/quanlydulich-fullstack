const allTabs = ["Thông tin", "Lịch sử đặt tour", "Đánh giá", "Đổi mật khẩu"]

export const ProfileTabs = ({ activeTab, setActiveTab, isSelf }) => (
  <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
    <div className="max-w-4xl mx-auto px-6 flex gap-1">
      {(isSelf ? allTabs : ["Thông tin"]).map(tab => (
        <button key={tab} onClick={() => setActiveTab(tab)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          {tab}
        </button>
      ))}
    </div>
  </div>
)