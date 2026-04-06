const team = [
  { name: "Nguyễn Văn A", role: "CEO & Founder",    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff&size=128" },
  { name: "Trần Thị B",   role: "Head of Tours",    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=06b6d4&color=fff&size=128"   },
  { name: "Lê Văn C",     role: "Customer Success", avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=8b5cf6&color=fff&size=128"      },
]

export const AboutTeam = () => (
  <div className="max-w-5xl mx-auto px-6 py-16">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Đội ngũ của chúng tôi</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {team.map((m) => (
        <div key={m.name} className="text-center">
          <img src={m.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg" />
          <h3 className="font-bold text-gray-800">{m.name}</h3>
          <p className="text-blue-500 text-sm">{m.role}</p>
        </div>
      ))}
    </div>
  </div>
)