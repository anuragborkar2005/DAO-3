"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback }: Props) {
    const { hasRole, isAdmin } = useUserRole();

    if (isAdmin) {
        return <>{children}</>;
    }

    const hasAccess = allowedRoles.some((role) => hasRole(role));

    if (!hasAccess) {
        return (
            fallback || (
                <div className="p-8 text-center bg-zinc-900 rounded-3xl border border-red-500/30">
                    <p className="text-red-400">Access Denied</p>
                    <p className="text-zinc-500 mt-2">
                        You don&apos;t have the required role for this action.
                    </p>
                </div>
            )
        );
    }

    return <>{children}</>;
}
