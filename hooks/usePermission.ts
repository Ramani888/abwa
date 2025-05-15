import { useAuth } from "@/components/auth-provider";

export const usePermission = () => {
  const { permissions } = useAuth();

  const hasPermission = (perm: string) => permissions.includes(perm);
  const hasAnyPermission = (permList: string[]) => permList.some(p => permissions.includes(p));

  return { hasPermission, hasAnyPermission };
};