import React, { useState, useEffect, createContext, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, MapPin, TrendingUp, Users, DollarSign, Calendar, Info, Smile, Frown, Meh, ChevronDown } from 'lucide-react';

// ============================================
// TRANSLATION DATA (i18n)
// ============================================
const translations = {
  en: {
    title: "Our Voice, Our Rights",
    subtitle: "Maharashtra MGNREGA Dashboard",
    intro: "Track employment, funds, and development in your district. Simple data for everyone.",
    selectDistrict: "Select Your District",
    loading: "Loading data...",
    offlineMode: "Offline Mode - Showing Cached Data",
    employmentProvided: "Employment Provided",
    fundsUtilization: "Funds: Allocated vs Used",
    genderDistribution: "Work Distribution by Gender",
    yearlyTrends: "Yearly Performance Trends",
    compareDistricts: "Compare Two Districts",
    whatDoesThisMean: "What does this mean?",
    employmentInfo: "Shows how many days of work were provided to people in each month",
    fundsInfo: "Shows how much money was given vs how much was actually spent on work",
    genderInfo: "Shows how work is divided between men and women workers",
    trendsInfo: "Shows how performance changed over the years",
    personDays: "Person-Days",
    allocated: "Allocated",
    utilized: "Utilized",
    male: "Male",
    female: "Female",
    crores: "Crores ₹",
    goodPerformance: "Good Performance!",
    needsImprovement: "Needs Improvement",
    averagePerformance: "Average Performance",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    autoDetectLocation: "Auto-detect my location"
  },
  hi: {
    title: "हमारी आवाज़, हमारे अधिकार",
    subtitle: "महाराष्ट्र मनरेगा डैशबोर्ड",
    intro: "अपने जिले में रोज़गार, धन और विकास को ट्रैक करें। सभी के लिए सरल डेटा।",
    selectDistrict: "अपना जिला चुनें",
    loading: "डेटा लोड हो रहा है...",
    offlineMode: "ऑफ़लाइन मोड - संग्रहीत डेटा दिखाया जा रहा है",
    employmentProvided: "प्रदान किया गया रोज़गार",
    fundsUtilization: "धन: आवंटित बनाम उपयोग",
    genderDistribution: "लिंग के अनुसार कार्य वितरण",
    yearlyTrends: "वार्षिक प्रदर्शन रुझान",
    compareDistricts: "दो जिलों की तुलना करें",
    whatDoesThisMean: "इसका क्या मतलब है?",
    employmentInfo: "दिखाता है कि प्रत्येक महीने में लोगों को कितने दिनों का काम दिया गया",
    fundsInfo: "दिखाता है कि कितना पैसा दिया गया और वास्तव में काम पर कितना खर्च हुआ",
    genderInfo: "दिखाता है कि पुरुष और महिला श्रमिकों के बीच काम कैसे बंटा है",
    trendsInfo: "दिखाता है कि वर्षों में प्रदर्शन कैसे बदला",
    personDays: "व्यक्ति-दिवस",
    allocated: "आवंटित",
    utilized: "उपयोग किया",
    male: "पुरुष",
    female: "महिला",
    crores: "करोड़ ₹",
    goodPerformance: "अच्छा प्रदर्शन!",
    needsImprovement: "सुधार की आवश्यकता",
    averagePerformance: "औसत प्रदर्शन",
    months: ["जन", "फर", "मार", "अप्र", "मई", "जून", "जुल", "अग", "सित", "अक्टू", "नव", "दिस"],
    autoDetectLocation: "मेरा स्थान स्वतः पता करें"
  },
  mr: {
    title: "आमचा आवाज, आमचे अधिकार",
    subtitle: "महाराष्ट्र मनरेगा डॅशबोर्ड",
    intro: "तुमच्या जिल्ह्यातील रोजगार, निधी आणि विकास ट्रॅक करा। सर्वांसाठी सोपा डेटा।",
    selectDistrict: "तुमचा जिल्हा निवडा",
    loading: "डेटा लोड होत आहे...",
    offlineMode: "ऑफलाइन मोड - संचयित डेटा दाखवत आहे",
    employmentProvided: "प्रदान केलेला रोजगार",
    fundsUtilization: "निधी: वाटप विरुद्ध वापर",
    genderDistribution: "लिंगानुसार कामाचे वाटप",
    yearlyTrends: "वार्षिक कामगिरी ट्रेंड",
    compareDistricts: "दोन जिल्ह्यांची तुलना करा",
    whatDoesThisMean: "याचा अर्थ काय आहे?",
    employmentInfo: "प्रत्येक महिन्यात लोकांना किती दिवसांचे काम दिले गेले ते दाखवते",
    fundsInfo: "किती पैसे दिले गेले आणि प्रत्यक्षात कामावर किती खर्च झाले ते दाखवते",
    genderInfo: "पुरुष आणि महिला कामगारांमध्ये काम कसे विभागले जाते ते दाखवते",
    trendsInfo: "वर्षानुवर्षे कामगिरी कशी बदलली ते दाखवते",
    personDays: "व्यक्ती-दिवस",
    allocated: "वाटप केले",
    utilized: "वापरले",
    male: "पुरुष",
    female: "महिला",
    crores: "कोटी ₹",
    goodPerformance: "चांगली कामगिरी!",
    needsImprovement: "सुधारणा आवश्यक",
    averagePerformance: "सरासरी कामगिरी",
    months: ["जाने", "फेब्रु", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑग", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"],
    autoDetectLocation: "माझे स्थान स्वयंचलितपणे शोधा"
  }
};

// ============================================
// MOCK DATA (Fallback for offline/demo)
// ============================================
const mockData = {
  districts: [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", 
    "Amravati", "Kolhapur", "Sangli", "Jalgaon", "Ahmednagar", "Satara"
  ],
  districtData: {
    "Mumbai": {
      employment: [
        { month: 0, days: 45000 }, { month: 1, days: 52000 }, { month: 2, days: 48000 },
        { month: 3, days: 41000 }, { month: 4, days: 38000 }, { month: 5, days: 55000 },
        { month: 6, days: 62000 }, { month: 7, days: 58000 }, { month: 8, days: 54000 },
        { month: 9, days: 49000 }, { month: 10, days: 51000 }, { month: 11, days: 47000 }
      ],
      funds: { allocated: 125, utilized: 108 },
      gender: { male: 58, female: 42 },
      yearlyTrends: [
        { year: "2021", performance: 72 },
        { year: "2022", performance: 78 },
        { year: "2023", performance: 85 },
        { year: "2024", performance: 86 }
      ]
    },
    "Pune": {
      employment: [
        { month: 0, days: 68000 }, { month: 1, days: 72000 }, { month: 2, days: 65000 },
        { month: 3, days: 58000 }, { month: 4, days: 61000 }, { month: 5, days: 75000 },
        { month: 6, days: 82000 }, { month: 7, days: 78000 }, { month: 8, days: 71000 },
        { month: 9, days: 69000 }, { month: 10, days: 73000 }, { month: 11, days: 67000 }
      ],
      funds: { allocated: 180, utilized: 162 },
      gender: { male: 55, female: 45 },
      yearlyTrends: [
        { year: "2021", performance: 75 },
        { year: "2022", performance: 82 },
        { year: "2023", performance: 88 },
        { year: "2024", performance: 90 }
      ]
    }
  }
};

// Add similar data for other districts
mockData.districts.slice(2).forEach(district => {
  mockData.districtData[district] = {
    employment: mockData.districtData["Pune"].employment.map(e => ({
      ...e,
      days: Math.floor(e.days * (0.7 + Math.random() * 0.6))
    })),
    funds: {
      allocated: 100 + Math.floor(Math.random() * 100),
      utilized: 80 + Math.floor(Math.random() * 80)
    },
    gender: {
      male: 50 + Math.floor(Math.random() * 20),
      female: 50 - Math.floor(Math.random() * 20)
    },
    yearlyTrends: [
      { year: "2021", performance: 70 + Math.floor(Math.random() * 10) },
      { year: "2022", performance: 75 + Math.floor(Math.random() * 10) },
      { year: "2023", performance: 80 + Math.floor(Math.random() * 10) },
      { year: "2024", performance: 85 + Math.floor(Math.random() * 10) }
    ]
  };
});

// ============================================
// CONTEXT FOR LANGUAGE
// ============================================
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const t = translations[language];
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => useContext(LanguageContext);

// ============================================
// COMPONENTS
// ============================================

// Header Component
const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">{t.title}</h1>
              <p className="text-xs sm:text-sm text-blue-100">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                  {['en', 'hi', 'mr'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                        language === lang ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Info Tooltip Component
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
      >
        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      {show && (
        <div className="absolute left-0 top-8 w-64 bg-gray-900 text-white text-xs sm:text-sm p-3 rounded-lg shadow-xl z-50">
          {text}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Performance Indicator
const PerformanceIndicator = ({ percentage }) => {
  const { t } = useLanguage();
  let Icon, text, color;
  
  if (percentage >= 85) {
    Icon = Smile;
    text = t.goodPerformance;
    color = "text-green-500";
  } else if (percentage >= 70) {
    Icon = Meh;
    text = t.averagePerformance;
    color = "text-yellow-500";
  } else {
    Icon = Frown;
    text = t.needsImprovement;
    color = "text-red-500";
  }
  
  return (
    <div className={`flex items-center space-x-2 ${color} font-semibold`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="text-sm sm:text-base">{text}</span>
    </div>
  );
};

// District Selector
const DistrictSelector = ({ selected, onChange, districts }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <label className="text-base sm:text-lg font-semibold text-gray-800">
            {t.selectDistrict}
          </label>
        </div>
      </div>
      
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base sm:text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 hover:bg-white cursor-pointer"
      >
        <option value="">-- {t.selectDistrict} --</option>
        {districts.map(district => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>
    </div>
  );
};

// Employment Chart
const EmploymentChart = ({ data }) => {
  const { t } = useLanguage();
  
  const chartData = data.map(item => ({
    name: t.months[item.month],
    days: item.days
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{t.employmentProvided}</h3>
          <InfoTooltip text={t.employmentInfo} />
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#666" style={{ fontSize: '12px' }} />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
            formatter={(value) => [`${value.toLocaleString()} ${t.personDays}`, '']}
          />
          <Bar dataKey="days" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Funds Utilization Chart
const FundsUtilizationChart = ({ data }) => {
  const { t } = useLanguage();
  
  const chartData = [
    { name: t.allocated, value: data.allocated, color: '#3b82f6' },
    { name: t.utilized, value: data.utilized, color: '#10b981' }
  ];
  
  const percentage = Math.round((data.utilized / data.allocated) * 100);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{t.fundsUtilization}</h3>
          <InfoTooltip text={t.fundsInfo} />
        </div>
        <PerformanceIndicator percentage={percentage} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
              formatter={(value) => [`₹${value} ${t.crores}`, '']}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t.allocated}</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹{data.allocated} {t.crores}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t.utilized}</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{data.utilized} {t.crores}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-lg text-white">
            <p className="text-sm">{t.fundsUtilization}</p>
            <p className="text-2xl sm:text-3xl font-bold">{percentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gender Distribution Chart
const GenderDistributionChart = ({ data }) => {
  const { t } = useLanguage();
  
  const chartData = [
    { name: t.male, value: data.male, color: '#3b82f6' },
    { name: t.female, value: data.female, color: '#ec4899' }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{t.genderDistribution}</h3>
        <InfoTooltip text={t.genderInfo} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">{t.male}</span>
            <span className="text-2xl font-bold text-blue-600">{data.male}%</span>
          </div>
          <div className="flex items-center justify-between bg-pink-50 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">{t.female}</span>
            <span className="text-2xl font-bold text-pink-600">{data.female}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Yearly Trends Chart
const YearlyTrendsChart = ({ data }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mr-2" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{t.yearlyTrends}</h3>
        <InfoTooltip text={t.trendsInfo} />
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" stroke="#666" style={{ fontSize: '12px' }} />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
            formatter={(value) => [`${value}% Performance`, '']}
          />
          <Line 
            type="monotone" 
            dataKey="performance" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Dashboard
const Dashboard = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    if (selectedDistrict) {
      setLoading(true);
      
      setTimeout(() => {
        setDistrictData(mockData.districtData[selectedDistrict]);
        setOfflineMode(false);
        setLoading(false);
      }, 800);
    }
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 sm:p-8 mb-8 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.intro}</h2>
          <p className="text-blue-100 text-sm sm:text-base">
            {offlineMode && `⚠️ ${t.offlineMode}`}
          </p>
        </div>

        <DistrictSelector 
          selected={selectedDistrict}
          onChange={setSelectedDistrict}
          districts={mockData.districts}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl font-semibold text-gray-600">{t.loading}</p>
          </div>
        )}

        {!loading && districtData && (
          <div className="space-y-6">
            <EmploymentChart data={districtData.employment} />
            <FundsUtilizationChart data={districtData.funds} />
            <GenderDistributionChart data={districtData.gender} />
            <YearlyTrendsChart data={districtData.yearlyTrends} />
          </div>
        )}

        {!loading && !districtData && selectedDistrict === '' && (
          <div className="text-center py-20">
            <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">{t.selectDistrict}</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2025 {t.title} - Empowering Citizens with Data</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
}