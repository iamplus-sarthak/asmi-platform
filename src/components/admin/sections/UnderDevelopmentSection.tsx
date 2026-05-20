import React from "react";

export function UnderDevelopmentSection({ title }: { title: string }) {
    return (
        <div className="p-8">
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {title}
                </h2>
                <p className="text-slate-500 font-medium">This section is under development</p>
            </div>
        </div>
    );
}
