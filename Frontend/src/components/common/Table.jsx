import React from 'react'

export const Table = ({ headers = [], children, emptyMessage = "No Data found" }) => {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-3 font-medium">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                    {React.Children.count(children) > 0 ? (
                        children
                    ) : (
                        <tr>
                            <td colSpan={headers.length || 1} className="px-6 py-8 text-center text-slate-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};