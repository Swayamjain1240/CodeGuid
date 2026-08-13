import React from 'react'
import { Badge } from "../../../components/common/Badge.jsx"
import { getGradeVariant } from "../prUtils.js"


const SecurityGradeBadge = () => {

    const variant = getGradeVariant(grade);

    return (
        <Badge variant={variant} className={`font-bold uppercase tracking-wider ${className}`} >
            Grade {grade}
        </Badge>
    );
};

export default SecurityGradeBadge