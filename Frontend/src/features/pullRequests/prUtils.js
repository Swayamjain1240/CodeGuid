export const getGradeVariant = (grade)=>{

    const g = String(grade || "" ).toUpperCase();

    if(g === "A") return "Low";
    if(g === "B") return "Info";
    if(g === "C") return "Medium";
    if(g === "D") return "High";
    if(g === "F") return "Critical";

    return "default" ;
};

export const getSeverityVariant = (severity) => {

  const s = String(severity || "").toLowerCase();

  if (s === "critical") return "critical";
  if (s === "high") return "high";
  if (s === "medium") return "medium";
  if (s === "low") return "low";

  return "info";
};