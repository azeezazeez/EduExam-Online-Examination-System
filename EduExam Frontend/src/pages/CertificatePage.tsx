import Certificate from "../components/Certificate";

interface UserData {
  username: string;
  userId: string;
  percentage: number;
  date: string;
}

export default function CertificatePage() {

  const userData: UserData = {
    username: "Azeez",
    userId: "EDU-2026-001",
    percentage: 92.5,
    date: new Date().toLocaleDateString()
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <Certificate
        username={userData.username}
        userId={userData.userId}
        percentage={userData.percentage}
        date={userData.date}
      />

    </div>
  );
}
