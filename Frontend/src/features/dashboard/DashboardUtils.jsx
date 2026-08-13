export const calculateTotalAudits = (gradeDistribution = {}) =>{
    return Object.values(gradeDistribution).reduce((sum, count)=> sum + (count || 0), 0);
}

export const getGradePercentage = (count = 0 , total = 0 ) =>{
    if(!total || total === 0) return 0;

    return Math.round((count / total) * 100);
}